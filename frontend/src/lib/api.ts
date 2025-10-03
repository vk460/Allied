export type ApiClientOptions = {
  baseUrl?: string
  apiKey?: string
}

const BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:8000'
const API_KEY = (import.meta as any).env?.VITE_API_KEY || ''

function headers(extra?: HeadersInit, overrideKey?: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...((overrideKey ?? API_KEY) ? { 'X-API-Key': (overrideKey ?? API_KEY) } : {}),
    ...(extra || {}),
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body: any = undefined
    try { body = await res.json() } catch {}
    throw new Error(body?.detail || `HTTP ${res.status}`)
  }
  try {
    return await res.json() as T
  } catch {
    return undefined as unknown as T
  }
}

export const api = {
  health: async (overrideKey?: string) => {
    const res = await fetch(`${BASE_URL}/api/health`, { headers: headers(undefined, overrideKey) })
    return handle<{ status: string }>(res)
  },
  translateVideoUrl: async (url: string, target_lang: string, overrideKey?: string) => {
    const res = await fetch(`${BASE_URL}/api/translate/video-url`, {
      method: 'POST',
      headers: headers(undefined, overrideKey),
      body: JSON.stringify({ url, target_lang }),
    })
    return handle<any>(res)
  },
  translate: async (payload: { text: string; source_lang?: string; target_lang: string; }, overrideKey?: string) => {
    const res = await fetch(`${BASE_URL}/api/translate`, {
      method: 'POST',
      headers: headers(undefined, overrideKey),
      body: JSON.stringify(payload),
    })
    return handle<{ translation: string }>(res)
  },
  translateAudio: async (file: File, target_lang: string, overrideKey?: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('target_lang', target_lang)
    const res = await fetch(`${BASE_URL}/api/translate/audio`, {
      method: 'POST',
      headers: {
        ...(overrideKey ?? API_KEY ? { 'X-API-Key': (overrideKey ?? API_KEY) } : {}),
      },
      body: form,
    })
    return handle<any>(res)
  },
  translateVideo: async (file: File, target_lang: string, overrideKey?: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('target_lang', target_lang)
    const res = await fetch(`${BASE_URL}/api/translate/video`, {
      method: 'POST',
      headers: {
        ...(overrideKey ?? API_KEY ? { 'X-API-Key': (overrideKey ?? API_KEY) } : {}),
      },
      body: form,
    })
    return handle<any>(res)
  },
  jobStatus: async (jobId: string, overrideKey?: string) => {
    const res = await fetch(`${BASE_URL}/api/jobs/${jobId}`, {
      headers: headers(undefined, overrideKey),
    })
    return handle<any>(res)
  },
  listKeys: async (overrideKey?: string) => {
    const res = await fetch(`${BASE_URL}/api/keys`, {
      headers: headers(undefined, overrideKey),
    })
    return handle<{ items: any[] }>(res)
  },
  createKey: async (name: string, scopes: string[], overrideKey?: string) => {
    const res = await fetch(`${BASE_URL}/api/keys`, {
      method: 'POST',
      headers: headers(undefined, overrideKey),
      body: JSON.stringify({ name, scopes }),
    })
    return handle<any>(res)
  },
  deleteKey: async (id: string, overrideKey?: string) => {
    const res = await fetch(`${BASE_URL}/api/keys/${id}`, {
      method: 'DELETE',
      headers: headers(undefined, overrideKey),
    })
    if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`)
    return true
  },
}

export const LANGUAGES_22 = [
  'Arabic', 'Bengali', 'Chinese (Simplified)', 'Dutch', 'English', 'French',
  'German', 'Gujarati', 'Hindi', 'Italian', 'Japanese', 'Kannada', 'Korean',
  'Malayalam', 'Marathi', 'Portuguese', 'Punjabi', 'Russian', 'Spanish', 'Tamil',
  'Telugu', 'Turkish', 'Urdu'
]
