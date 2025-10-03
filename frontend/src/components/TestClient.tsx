import React, { useMemo, useState } from 'react'
import { api, LANGUAGES_22 } from '../lib/api'

export default function TestClient() {
  type Mode = 'text' | 'audio' | 'video' | 'url'
  const [mode, setMode] = useState<Mode>('text')
  const [apiKey, setApiKey] = useState<string>('')
  const [targetLang, setTargetLang] = useState<string>('Hindi')
  const [text, setText] = useState<string>('Hello, welcome to our vocational training module!')
  const [file, setFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [all22, setAll22] = useState<boolean>(false)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<string>('')

  const targetLangCode = useMemo(() => {
    // Minimal mapping for demo purposes. Backend accepts any string; models would need exact codes.
    const map: Record<string, string> = {
      'Arabic': 'ar', 'Bengali': 'bn', 'Chinese (Simplified)': 'zh', 'Dutch': 'nl', 'English': 'en', 'French': 'fr',
      'German': 'de', 'Gujarati': 'gu', 'Hindi': 'hi', 'Italian': 'it', 'Japanese': 'ja', 'Kannada': 'kn', 'Korean': 'ko',
      'Malayalam': 'ml', 'Marathi': 'mr', 'Portuguese': 'pt', 'Punjabi': 'pa', 'Russian': 'ru', 'Spanish': 'es', 'Tamil': 'ta',
      'Telugu': 'te', 'Turkish': 'tr', 'Urdu': 'ur'
    }
    return map[targetLang] || 'hi'
  }, [targetLang])

  async function runTest() {
    setBusy(true)
    setError('')
    setResult(null)
    setJobId(null)
    setJobStatus('')
    try {
      if (!apiKey) throw new Error('Please paste an API key')
      if (mode === 'text') {
        const res = await api.translate({ text, source_lang: 'auto', target_lang: targetLangCode }, apiKey)
        setResult(res)
      } else if (mode === 'audio') {
        if (!file) throw new Error('Please choose an audio file')
        const res = await api.translateAudio(file, targetLangCode, apiKey)
        if (res?.job_id) {
          setJobId(res.job_id)
          setJobStatus(res.status || 'PENDING')
          pollJob(res.job_id)
        } else {
          setResult(res)
        }
      } else if (mode === 'video') {
        if (!file) throw new Error('Please choose a video file')
        const res = await api.translateVideo(file, all22 ? 'ALL22' : targetLangCode, apiKey)
        if (res?.job_id) {
          setJobId(res.job_id)
          setJobStatus(res.status || 'PENDING')
          pollJob(res.job_id)
        } else {
          setResult(res)
        }
      } else if (mode === 'url') {
        if (!videoUrl.trim()) throw new Error('Please paste a video/course URL')
        const res = await api.translateVideoUrl(videoUrl.trim(), all22 ? 'ALL22' : targetLangCode, apiKey)
        if (res?.job_id) {
          setJobId(res.job_id)
          setJobStatus(res.status || 'PENDING')
          pollJob(res.job_id)
        } else {
          setResult(res)
        }
      }
    } catch (e: any) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  async function pollJob(id: string) {
    // simple polling every 3s until DONE/ERROR
    let attempts = 0
    const maxAttempts = 200 // ~10 minutes
    async function step() {
      try {
        const data = await api.jobStatus(id, apiKey)
        setJobStatus(data.status)
        setResult(data)
        if (data.status === 'DONE' || data.status === 'ERROR') return
      } catch (e: any) {
        setError(e?.message || 'Job polling failed')
        return
      }
      attempts += 1
      if (attempts < maxAttempts) setTimeout(step, 3000)
    }
    step()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-500 bg-clip-text text-transparent">Test Client</h1>
        <p className="text-slate-400 mt-2">Paste API key, choose input type (text/audio/video), select a target language (22 supported in UI), and run.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 rounded-2xl border border-white/5 space-y-4">
          <label className="block text-sm font-medium text-slate-300">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your API key (X-API-Key)"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          />

          <label className="block text-sm font-medium text-slate-300 mt-4">Mode</label>
          <div className="flex gap-2">
            {(['text','audio','video','url'] as Mode[]).map(m => (
              <button key={m}
                className={`px-3 py-2 rounded-lg border ${mode===m?'bg-blue-500/20 border-blue-500/40 text-blue-300':'bg-slate-800/50 border-white/10 text-slate-300'}`}
                onClick={() => setMode(m)}
              >{m.toUpperCase()}</button>
            ))}
          </div>

          {mode === 'text' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>
          )}

          {(mode === 'audio' || mode === 'video') && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">{mode === 'audio' ? 'Audio File' : 'Video File'}</label>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          )}

          {mode === 'url' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Video/Course URL</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste Udemy / Skill India / SkillBuild or direct video URL"
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
              <div className="text-xs text-slate-500 mt-1">Note: Protected/course platforms may not allow direct fetching. Direct video URLs work best.</div>
            </div>
          )}

          <label className="block text-sm font-medium text-slate-300 mt-4">Target Language</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          >
            {LANGUAGES_22.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 mt-2 text-sm text-slate-300">
            <input type="checkbox" checked={all22} onChange={(e) => setAll22(e.target.checked)} />
            Generate dubbing in all 22 languages
          </label>

          <button
            onClick={runTest}
            disabled={busy}
            className="mt-6 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
          >
            {busy ? 'Running...' : 'Run Test'}
          </button>
        </div>

        <div className="lg:col-span-2 card p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold mb-4">Result</h3>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">{error}</div>
          )}
          {jobId && (
            <div className="mb-3 text-sm text-slate-300">Job: {jobId} — Status: {jobStatus || '...'}</div>
          )}
          {result ? (
            <div className="space-y-3">
              <pre className="whitespace-pre-wrap break-words text-sm bg-slate-800/40 p-4 rounded-xl border border-white/5">{JSON.stringify(result, null, 2)}</pre>
              {(result?.srt_url || result?.vtt_url || result?.dubbed_audio_url || result?.dubbed_video_url) && (
                <div className="space-y-2">
                  {result?.srt_url && <a className="text-blue-400 underline" href={result.srt_url} target="_blank">Download SRT</a>}
                  {result?.vtt_url && <a className="text-blue-400 underline block" href={result.vtt_url} target="_blank">Download VTT</a>}
                  {result?.dubbed_audio_url && <a className="text-blue-400 underline block" href={result.dubbed_audio_url} target="_blank">Dubbed Audio</a>}
                  {result?.dubbed_video_url && <a className="text-blue-400 underline block" href={result.dubbed_video_url} target="_blank">Dubbed Video</a>}
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-400">No result yet. Run a test to see response here.</div>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-400">
        Note: Audio/video translation uses stub endpoints that accept files and return receipt; full Whisper/NLLB dubbing can be integrated next.
      </div>
    </div>
  )
}
