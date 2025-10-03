from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
import uuid
from django.conf import settings
from .models import Job, ApiKey
from .tasks import enqueue_job, translate_text as sync_translate_text
import hashlib
import secrets


API_KEY = os.getenv("API_KEY", "changeme")


def _check_api_key(request):
    provided = request.headers.get("X-API-Key") or request.headers.get("x-api-key")
    if not provided:
        return False
    # Allow env master key
    if API_KEY and provided == API_KEY:
        return True
    # Check DB keys
    h = hashlib.sha256(provided.encode("utf-8")).hexdigest()
    return ApiKey.objects.filter(key_hash=h, revoked=False).exists()


def _gen_api_key() -> str:
    return "lk_live_" + secrets.token_urlsafe(16).replace('-', '').replace('_', '')[:24]


@api_view(["GET", "POST"])  # List/create API keys
def keys(request):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    if request.method == "POST":
        name = request.data.get("name") or "Unnamed Key"
        scopes = request.data.get("scopes") or []
        raw = _gen_api_key()
        h = hashlib.sha256(raw.encode("utf-8")).hexdigest()
        ak = ApiKey.objects.create(name=name, key_hash=h, scopes=scopes, revoked=False)
        return Response({
            "id": str(ak.id), "name": ak.name, "scopes": ak.scopes, "created": ak.created_at, "status": "ACTIVE", "key": raw
        }, status=201)
    # GET list
    items = []
    for ak in ApiKey.objects.order_by("-created_at"):
        items.append({
            "id": str(ak.id),
            "name": ak.name,
            "scopes": ak.scopes,
            "created": ak.created_at,
            "status": "REVOKED" if ak.revoked else "ACTIVE",
        })
    return Response({"items": items})


@api_view(["DELETE"])  # Delete/revoke API key
def key_detail(request, key_id):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    try:
        ak = ApiKey.objects.get(id=key_id)
    except ApiKey.DoesNotExist:
        return Response({"detail": "not found"}, status=404)
    # Hard delete so the key does not reappear as REVOKED on refresh
    ak.delete()
    return Response(status=204)


@api_view(["GET"])  # Public health check (no auth)
def health(request):
    return Response({"status": "ok"})


@api_view(["POST"])  # AI-driven translation engine
def translate(request):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    payload = request.data
    source_text = payload.get("text", "")
    source_lang = payload.get("source_lang", "auto")
    target_lang = payload.get("target_lang", "hi")
    # Ensure model receives explicit src/tgt; fallback to English if auto
    if not source_lang or str(source_lang).lower() == "auto":
        source_lang = "en"
    # Real translation via NLLB pipeline (CPU). source_lang is ignored in this stub.
    try:
        translation = sync_translate_text(source_text, target_lang, source_lang)
    except Exception as ex:
        return Response({"detail": f"translation failed: {ex}"}, status=500)
    return Response(
        {
            "text": source_text,
            "source_lang": source_lang,
            "target_lang": target_lang,
            "translation": translation,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET", "POST"])  # Domain-specific vocabulary banks
def vocab(request):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    if request.method == "POST":
        # TODO: Persist vocab item for a domain/sector
        return Response({"message": "Vocab item created (stub)"}, status=201)
    # GET
    # TODO: Filter by domain/sector query params
    return Response({"items": [
        {"term": "apprenticeship", "domain": "skills", "translations": {"hi": "प्रशिक्षुता"}}
    ]})


@api_view(["GET", "POST"])  # Automated localization workflows
def workflows(request):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    if request.method == "POST":
        # TODO: Kick off localization workflow for a file/module
        return Response({"message": "Workflow started (stub)", "workflow_id": "wf_123"}, status=202)
    return Response({"workflows": [{"id": "wf_123", "status": "queued"}]})


@api_view(["GET"])  # Integrations for NCVET & MSDE platforms
def integrations_ncvet_msde(request):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    # TODO: OAuth/keys and push-pull sync
    return Response({"status": "ncvet-msde integration stub"})


@api_view(["GET"])  # Integrations for partner LMSs
def integrations_lms(request):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    # TODO: Implement LTI/SCORM/xAPI adapters
    return Response({"status": "lms integration stub"})


@api_view(["POST"])  # Accessibility: Text-to-Speech
def accessibility_tts(request):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    text = request.data.get("text", "")
    voice = request.data.get("voice", "female")
    # TODO: Integrate TTS provider and return audio URL/blob
    return Response({"audio_url": "stub://tts/audio.wav", "voice": voice, "text": text})


@api_view(["POST"])  # Accessibility: Speech-to-Text
def accessibility_stt(request):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    # TODO: Accept file upload and process via STT provider
    return Response({"transcript": "<stub transcript>"})


@api_view(["POST"])  # Audio translation (multipart)
def translate_audio(request):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    audio = request.FILES.get("file")
    target_lang = request.POST.get("target_lang", "hi")
    if not audio:
        return Response({"detail": "No file uploaded with field name 'file'"}, status=400)
    # Create job and save input file
    job = Job.objects.create(job_type="audio", target_lang=target_lang, status="PENDING")
    job_dir = os.path.join(settings.MEDIA_ROOT, "jobs", str(job.id))
    os.makedirs(job_dir, exist_ok=True)
    input_path = os.path.join(job_dir, getattr(audio, 'name', 'input_audio'))
    with open(input_path, 'wb') as f:
        for chunk in audio.chunks():
            f.write(chunk)
    job.input_path = input_path
    job.save(update_fields=["input_path", "updated_at"])
    enqueue_job(job)
    return Response({
        "job_id": str(job.id),
        "status": job.status,
        "target_lang": job.target_lang,
        "detail": "Job queued. Poll /api/jobs/<job_id> for status/results.",
    }, status=202)


def _download_video_to_path(url: str, out_path: str):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    try:
        import ffmpeg  # ffmpeg-python
        (
            ffmpeg
            .input(url)
            .output(out_path, c='copy')
            .overwrite_output()
            .run(quiet=True)
        )
        return
    except Exception:
        try:
            import imageio_ffmpeg
            import subprocess
            exe = imageio_ffmpeg.get_ffmpeg_exe()
            cmd = [exe, '-y', '-i', url, '-c', 'copy', out_path]
            subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            return
        except Exception as e:
            raise RuntimeError(f"Failed to fetch video from URL: {e}")


# Minimal set of 22 languages (codes) to batch when ALL22 is requested
LANG_22_CODES = ['ar','bn','zh','nl','en','fr','de','gu','hi','it','ja','kn','ko','ml','mr','pt','pa','ru','es','ta','te','tr','ur']


@api_view(["POST"])  # Video translation by URL (JSON)
def translate_video_url(request):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    url = request.data.get("url")
    target_lang = request.data.get("target_lang", "hi")
    if not url:
        return Response({"detail": "Missing 'url'"}, status=400)

    # Download once to a shared temp file
    shared_dir = os.path.join(settings.MEDIA_ROOT, "jobs", "shared")
    os.makedirs(shared_dir, exist_ok=True)
    shared_name = f"shared_{uuid.uuid4()}.mp4"
    shared_path = os.path.join(shared_dir, shared_name)
    try:
        _download_video_to_path(url, shared_path)
    except Exception as e:
        return Response({"detail": str(e)}, status=400)

    # Prepare job(s)
    if str(target_lang).upper() == 'ALL22':
        ids = []
        for code in LANG_22_CODES:
            job = Job.objects.create(job_type="video", target_lang=code, status="PENDING")
            job_dir = os.path.join(settings.MEDIA_ROOT, "jobs", str(job.id))
            os.makedirs(job_dir, exist_ok=True)
            input_path = os.path.join(job_dir, f"input_video.mp4")
            try:
                import shutil
                shutil.copyfile(shared_path, input_path)
            except Exception:
                # If copy failed, fallback to reference the shared path (not ideal but workable)
                input_path = shared_path
            job.input_path = input_path
            job.save(update_fields=["input_path", "updated_at"])
            enqueue_job(job)
            ids.append(str(job.id))
        return Response({
            "job_ids": ids,
            "status": "PENDING",
            "detail": "Batch queued. Poll /api/jobs/<job_id> for each id.",
        }, status=202)
    else:
        job = Job.objects.create(job_type="video", target_lang=target_lang, status="PENDING")
        job_dir = os.path.join(settings.MEDIA_ROOT, "jobs", str(job.id))
        os.makedirs(job_dir, exist_ok=True)
        input_path = os.path.join(job_dir, f"input_video.mp4")
        try:
            import shutil
            shutil.copyfile(shared_path, input_path)
        except Exception:
            input_path = shared_path
        job.input_path = input_path
        job.save(update_fields=["input_path", "updated_at"])
        enqueue_job(job)
        return Response({
            "job_id": str(job.id),
            "status": job.status,
            "target_lang": job.target_lang,
            "detail": "Job queued. Poll /api/jobs/<job_id> for status/results.",
        }, status=202)


@api_view(["POST"])  # Video translation (multipart)
def translate_video(request):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    video = request.FILES.get("file")
    target_lang = request.POST.get("target_lang", "hi")
    if not video:
        return Response({"detail": "No file uploaded with field name 'file'"}, status=400)
    job = Job.objects.create(job_type="video", target_lang=target_lang, status="PENDING")
    job_dir = os.path.join(settings.MEDIA_ROOT, "jobs", str(job.id))
    os.makedirs(job_dir, exist_ok=True)
    input_path = os.path.join(job_dir, getattr(video, 'name', 'input_video'))
    with open(input_path, 'wb') as f:
        for chunk in video.chunks():
            f.write(chunk)
    job.input_path = input_path
    job.save(update_fields=["input_path", "updated_at"])
    enqueue_job(job)
    return Response({
        "job_id": str(job.id),
        "status": job.status,
        "target_lang": job.target_lang,
        "detail": "Job queued. Poll /api/jobs/<job_id> for status/results.",
    }, status=202)


@api_view(["GET"])  # Job status/result
def job_status(request, job_id):
    if not _check_api_key(request):
        return Response({"detail": "Invalid or missing API key"}, status=401)
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"detail": "job not found"}, status=404)
    def to_url(path: str):
        if not path:
            return None
        # Convert absolute MEDIA_ROOT path to MEDIA_URL
        if path.startswith(str(settings.MEDIA_ROOT)):
            rel = path[len(str(settings.MEDIA_ROOT)):]  # keep leading slash if present
            return f"{request.build_absolute_uri(settings.MEDIA_URL.rstrip('/'))}{rel}"
        return path
    data = {
        "job_id": str(job.id),
        "status": job.status,
        "target_lang": job.target_lang,
        "error": job.error or None,
        "transcript_text": job.transcript_text if job.status == "DONE" else None,
        "translation_text": job.translation_text if job.status == "DONE" else None,
        "srt_url": to_url(job.srt_path),
        "vtt_url": to_url(job.vtt_path),
        "dubbed_audio_url": to_url(job.dubbed_audio_path),
        "dubbed_video_url": to_url(job.dubbed_video_path),
    }
    return Response(data)
