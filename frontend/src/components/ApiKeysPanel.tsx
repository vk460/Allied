import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

type KeyItem = { id:string; name:string; scopes:string[]; created:string; status:string }

const ADMIN_KEY = (import.meta as any).env?.VITE_API_KEY || ''

export default function ApiKeysPanel(){
  const [keys, setKeys] = useState<KeyItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  async function load(){
    setLoading(true)
    try{
      const res = await api.listKeys(ADMIN_KEY)
      const items = (res.items||[]).slice(0,3).map((it:any)=>({
        id: it.id,
        name: it.name,
        scopes: it.scopes||[],
        created: new Date(it.created).toISOString().split('T')[0],
        status: it.status,
      })) as KeyItem[]
      setKeys(items)
    }catch{
      setKeys([])
    }finally{
      setLoading(false)
    }
  }

  async function revoke(id:string){
    try{ await api.deleteKey(id, ADMIN_KEY) }catch{}
    setKeys(prev => prev.filter(k => k.id !== id))
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="card p-4 rounded-2xl">
      <h3 className="font-semibold">API Keys</h3>
      {loading && <div className="text-xs text-slate-400 mt-2">Loading...</div>}
      <div className="mt-3 space-y-3">
        {keys.map(k => (
          <div key={k.id} className="p-3 bg-white/3 rounded-md flex items-center justify-between">
            <div>
              <div className="font-medium">{k.name}</div>
              <div className="text-xs text-slate-400">Scopes: {k.scopes.join(', ') || '—'}</div>
              <div className="text-xs text-slate-400">Created: {k.created}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`text-xs px-2 py-1 rounded ${k.status==='ACTIVE'?'bg-green-600':'bg-red-600'}`}>{k.status}</div>
              <button onClick={() => revoke(k.id)} className="text-sm px-3 py-1 rounded bg-white/5">🗑 Delete</button>
            </div>
          </div>
        ))}
        {!loading && keys.length===0 && (
          <div className="text-xs text-slate-400">No keys yet. Create one in the API Keys page.</div>
        )}
      </div>
    </div>
  )
}
