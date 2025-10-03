import React, { useState } from 'react'

type KeyItem = { id:string; name:string; scopes:string[]; created:string; status:string }

const SAMPLE_KEYS: KeyItem[] = [
  { id: 'key_live_1', name: 'Training Portal Key', scopes: ['translate_text','glossary_read'], created: '2025-09-20', status: 'ACTIVE' },
  { id: 'key_live_2', name: 'Video Translator Key', scopes: ['translate_video'], created: '2025-10-02', status: 'ACTIVE' }
]

export default function ApiKeysPanel(){
  const [keys, setKeys] = useState<KeyItem[]>(SAMPLE_KEYS)

  function revoke(id:string){
    setKeys(prev => prev.map(k => k.id===id?{...k,status:'REVOKED'}:k))
  }

  return (
    <div className="card p-4 rounded-2xl">
      <h3 className="font-semibold">API Keys</h3>
      <div className="mt-3 space-y-3">
        {keys.map(k => (
          <div key={k.id} className="p-3 bg-white/3 rounded-md flex items-center justify-between">
            <div>
              <div className="font-medium">{k.name}</div>
              <div className="text-xs text-slate-400">Scopes: {k.scopes.join(', ')}</div>
              <div className="text-xs text-slate-400">Created: {k.created}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`text-xs px-2 py-1 rounded ${k.status==='ACTIVE'?'bg-green-600':'bg-red-600'}`}>{k.status}</div>
              <button onClick={() => revoke(k.id)} className="text-sm px-3 py-1 rounded bg-white/5">❌ Revoke</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
