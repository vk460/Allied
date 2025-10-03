import os
import logging
import threading
import traceback
from django.conf import settings
from .models import Job

# Lazy-loaded globals
_whisper_model = None
_nllb_pipeline = None


def _ensure_dirs(path: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)


def _load_whisper():
    global _whisper_model
    if _whisper_model is None:
        import whisper
        # CPU-friendly size; change to 'small'/'medium' if needed
        _whisper_model = whisper.load_model("base")


def _load_nllb():
    global _nllb_pipeline
    if _nllb_pipeline is None:
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
        import os as _os
        # Allow overriding model and local dir via env for offline/corporate networks
        model_name = _os.getenv("NLLB_MODEL_NAME", "facebook/nllb-200-distilled-600M")
        local_dir = _os.getenv("NLLB_LOCAL_PATH")
        try:
            if local_dir and _os.path.exists(local_dir):
                logging.getLogger(__name__).info(
                    f"Loading NLLB from local directory: {local_dir}"
                )
                tok = AutoTokenizer.from_pretrained(local_dir, local_files_only=True)
                mdl = AutoModelForSeq2SeqLM.from_pretrained(local_dir, local_files_only=True)
            else:
                logging.getLogger(__name__).info(
                    "Loading NLLB from hub: %s (first download may be ~1GB and take several minutes)",
                    model_name,
                )
                tok = AutoTokenizer.from_pretrained(model_name)
                mdl = AutoModelForSeq2SeqLM.from_pretrained(model_name)
            _nllb_pipeline = pipeline("translation", model=mdl, tokenizer=tok)
        except Exception as e:
            # Add actionable hint for SSL/cert issues when fetching from Hugging Face
            raise RuntimeError(
                "Failed to load NLLB model. If you're behind a corporate proxy or restricted network, "
                "either set NLLB_LOCAL_PATH to a local model folder copied from a machine with internet, "
                "or configure certificates (REQUESTS_CA_BUNDLE) so Python/requests can verify TLS.\n"
                f"Original error: {e}"
            )


def _write_srt(segments, out_path: str):
    _ensure_dirs(out_path)
    with open(out_path, "w", encoding="utf-8") as f:
        for i, seg in enumerate(segments, 1):
            start = seg.get("start", 0.0)
            end = seg.get("end", 0.0)
            text = seg.get("text", "").strip()
            def fmt(t):
                h = int(t // 3600)
                m = int((t % 3600) // 60)
                s = int(t % 60)
                ms = int((t - int(t)) * 1000)
                return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
            f.write(f"{i}\n{fmt(start)} --> {fmt(end)}\n{text}\n\n")


def _write_vtt(segments, out_path: str):
    _ensure_dirs(out_path)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for seg in segments:
            start = seg.get("start", 0.0)
            end = seg.get("end", 0.0)
            text = seg.get("text", "").strip()
            def fmt(t):
                h = int(t // 3600)
                m = int((t % 3600) // 60)
                s = int(t % 60)
                ms = int((t - int(t)) * 1000)
                return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"
            f.write(f"{fmt(start)} --> {fmt(end)}\n{text}\n\n")


def _extract_audio_if_needed(input_path: str, work_dir: str) -> str:
    ext = (os.path.splitext(input_path)[1] or '').lower()
    # Always convert to a standard 16k mono WAV so Whisper can work without ffmpeg
    out_wav = os.path.join(work_dir, "audio_16k_mono.wav")
    _ensure_dirs(out_wav)
    try:
        import ffmpeg  # ffmpeg-python wrapper
        (
            ffmpeg
            .input(input_path)
            .output(out_wav, ac=1, ar=16000, acodec='pcm_s16le', vn=None)
            .overwrite_output()
            .run(quiet=True)
        )
        return out_wav
    except Exception:
        try:
            import imageio_ffmpeg
            import subprocess
            exe = imageio_ffmpeg.get_ffmpeg_exe()
            cmd = [exe, '-y', '-i', input_path, '-vn', '-ac', '1', '-ar', '16000', '-acodec', 'pcm_s16le', out_wav]
            subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            return out_wav
        except Exception:
            raise RuntimeError("ffmpeg not available; install ffmpeg or imageio-ffmpeg to process video")


def _read_wav_numpy(path: str):
    import wave
    import numpy as np
    with wave.open(path, 'rb') as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        raw = wf.readframes(n_frames)
    # Expect 16-bit PCM mono at 16k
    if sampwidth != 2:
        raise RuntimeError(f"Unexpected sample width: {sampwidth*8} bits")
    dtype = np.int16
    audio = np.frombuffer(raw, dtype=dtype)
    if n_channels > 1:
        audio = audio.reshape(-1, n_channels).mean(axis=1).astype(np.int16)
    # Convert to float32 in [-1,1]
    audio_f = (audio.astype(np.float32) / 32768.0).clip(-1.0, 1.0)
    # If not 16k, we could resample, but our extractor forces 16k
    if framerate != 16000:
        # Soft fail; Whisper can resample internally, but warn
        pass
    return audio_f


# Map simple ISO-like codes to NLLB codes
_NLLB_CODE_MAP = {
    'ar': 'arb_Arab', 'bn': 'ben_Beng', 'zh': 'zho_Hans', 'nl': 'nld_Latn', 'en': 'eng_Latn', 'fr': 'fra_Latn',
    'de': 'deu_Latn', 'gu': 'guj_Gujr', 'hi': 'hin_Deva', 'it': 'ita_Latn', 'ja': 'jpn_Jpan', 'kn': 'kan_Knda',
    'ko': 'kor_Hang', 'ml': 'mal_Mlym', 'mr': 'mar_Deva', 'pt': 'por_Latn', 'pa': 'pan_Guru', 'ru': 'rus_Cyrl',
    'es': 'spa_Latn', 'ta': 'tam_Taml', 'te': 'tel_Telu', 'tr': 'tur_Latn', 'ur': 'urd_Arab'
}

def _to_nllb(code: str) -> str:
    if not code:
        return 'eng_Latn'
    # If already looks like an NLLB code, return as-is
    if '_' in code:
        return code
    code = code.lower()
    return _NLLB_CODE_MAP.get(code, 'eng_Latn')


def _translate_text(text: str, tgt_lang_code: str, src_lang_code: str = 'en') -> str:
    _load_nllb()
    # Ensure we pass valid NLLB src/tgt codes
    src = _to_nllb(src_lang_code)
    tgt = _to_nllb(tgt_lang_code)
    result = _nllb_pipeline(text, src_lang=src, tgt_lang=tgt, max_length=1024)
    return result[0]['translation_text']


def translate_text(text: str, tgt_lang_code: str, src_lang_code: str = 'en') -> str:
    """Public helper to translate a short text synchronously.
    Accepts simple ISO-like codes (e.g., 'en', 'hi') or NLLB codes (e.g., 'eng_Latn').
    Defaults source to English if not provided.
    """
    return _translate_text(text, tgt_lang_code, src_lang_code)


def _process_job(job: Job):
    job.status = "RUNNING"
    job.save(update_fields=["status", "updated_at"])
    work_dir = os.path.join(settings.MEDIA_ROOT, "jobs", str(job.id))
    os.makedirs(work_dir, exist_ok=True)
    try:
        _load_whisper()
        _load_nllb()
        # Prepare audio path (standardized 16k mono wav) and load samples
        audio_path = _extract_audio_if_needed(job.input_path, work_dir)
        audio_samples = _read_wav_numpy(audio_path)
        # Transcribe with Whisper (CPU) from numpy array to avoid ffmpeg dependency
        result = _whisper_model.transcribe(audio_samples, fp16=False)
        segments = result.get("segments", [])
        full_text = result.get("text", "").strip()
        job.transcript_text = full_text
        # Translate full text with NLLB
        translated = _translate_text(full_text, job.target_lang)
        job.translation_text = translated
        # Write subtitles
        srt_path = os.path.join(work_dir, "subtitles.srt")
        vtt_path = os.path.join(work_dir, "subtitles.vtt")
        _write_srt(segments, srt_path)
        _write_vtt(segments, vtt_path)
        job.srt_path = srt_path
        job.vtt_path = vtt_path
        # TODO: Dubbing (TTS + mux). For now, omitted due to CPU constraints.
        job.status = "DONE"
        job.save()
    except Exception as ex:
        job.status = "ERROR"
        job.error = f"{ex}\n\n{traceback.format_exc()}"
        job.save()


def enqueue_job(job: Job):
    t = threading.Thread(target=_process_job, args=(job,), daemon=True)
    t.start()
