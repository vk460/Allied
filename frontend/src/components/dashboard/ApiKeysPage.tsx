import React, { useEffect, useState } from 'react'
import { PlusIcon, KeyIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { api } from '../../lib/api'

type KeyItem = { 
  id: string
  name: string
  scopes: string[]
  created: string
  status: string
  key?: string
}

const ENV_ADMIN_KEY = (import.meta as any).env?.VITE_API_KEY || ''

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<KeyItem[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [newKeyName, setNewKeyName] = useState('')
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])
  const [adminKey, setAdminKey] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [createError, setCreateError] = useState<string>('')
  const [isCreating, setIsCreating] = useState<boolean>(false)

  async function loadKeys(){
    setError('')
    const useKey = adminKey || ENV_ADMIN_KEY
    if (!useKey) { setKeys([]); return }
    const res = await api.listKeys(useKey)
    const items = ((res?.items) || []).map((it: any) => ({
      id: it.id,
      name: it.name,
      scopes: it.scopes || [],
      created: new Date(it.created).toISOString().split('T')[0],
      status: it.status,
    })) as KeyItem[]
    setKeys(items)
  }

  useEffect(() => {
    // initialize admin key from localStorage or env
    const saved = localStorage.getItem('admin_api_key') || ''
    const initial = saved || ENV_ADMIN_KEY
    setAdminKey(initial)
  }, [])

  useEffect(() => { if (adminKey || ENV_ADMIN_KEY) { loadKeys().catch((e)=>setError(e?.message||'Failed to load')) } }, [adminKey])

  // Ensure a sensible default scope when opening the create modal
  useEffect(() => {
    if (showCreateModal && selectedScopes.length === 0) {
      setSelectedScopes(['translate_text'])
    }
    if (!showCreateModal) {
      setCreateError('')
    }
  }, [showCreateModal])

  const availableScopes = [
    { id: 'translate_text', name: 'Translate Text', description: 'Translate text content' },
    { id: 'translate_audio', name: 'Translate Audio', description: 'Translate audio content' },
    { id: 'translate_video', name: 'Translate Video', description: 'Translate video content' },
    { id: 'document_translate_analyze', name: 'Translate/Analyze Document', description: 'Translate and summarize/analyze documents' }
  ]

  async function revoke(id: string) {
    const useKey = adminKey || ENV_ADMIN_KEY
    await api.deleteKey(id, useKey)
    setKeys(prev => prev.filter(k => k.id !== id))
  }

  function toggleKeyVisibility(id: string) {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  async function createNewKey() {
    if (!newKeyName.trim()) return
    const useKey = adminKey || ENV_ADMIN_KEY
    setCreateError('')
    if (!useKey) { setCreateError('Admin API key is required. Paste it above and Save.'); return }
    if (selectedScopes.length === 0) { setCreateError('Select at least one scope.'); return }
    let created: any
    try {
      setIsCreating(true)
      created = await api.createKey(newKeyName, selectedScopes, useKey)
    } catch (e: any) {
      // Provide clearer guidance for common network/CORS errors.
      const msg = e?.message || 'Failed to create key'
      const maybeCors = /Failed to fetch|NetworkError|TypeError/i.test(String(msg))
      const backend = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:8000'
      setCreateError(
        maybeCors
          ? `Failed to reach backend at ${backend}. Check that the server is running, CORS is enabled for this origin, and the URL (VITE_BACKEND_URL) is correct.`
          : msg
      )
      return
    } finally {
      setIsCreating(false)
    }
    const item: KeyItem = {
      id: created.id,
      name: created.name,
      scopes: created.scopes || [],
      created: new Date(created.created).toISOString().split('T')[0],
      status: created.status,
      key: created.key, // show once
    }
    setKeys(prev => [item, ...prev])
    setVisibleKeys(prev => new Set([...prev, item.id]))
    setNewKeyName('')
    setSelectedScopes([])
    setShowCreateModal(false)
  }

  function onAdminKeySave(){
    localStorage.setItem('admin_api_key', adminKey)
    loadKeys().catch((e)=>setError(e?.message||'Failed to load'))
  }

  function toggleScope(scopeId: string) {
    setSelectedScopes(prev => 
      prev.includes(scopeId) 
        ? prev.filter(s => s !== scopeId)
        : [...prev, scopeId]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            API Keys Management
          </h1>
          <p className="text-slate-400 mt-2">Manage your API keys and access permissions</p>
        </div>
        <button
          onClick={() => { setShowCreateModal(true); if (selectedScopes.length===0) setSelectedScopes(['translate_text']) }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="w-5 h-5" />
          Create New Key
        </button>
      </div>

      <div className="card p-4 rounded-2xl border border-white/5">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-1">Admin API Key</label>
            <input
              value={adminKey}
              onChange={e=>setAdminKey(e.target.value)}
              placeholder="Paste admin API key used to manage keys"
              className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <button onClick={onAdminKeySave} className="px-4 py-2 bg-white/10 rounded-xl">Save</button>
        </div>
        {!adminKey && !ENV_ADMIN_KEY && (
          <div className="text-xs text-yellow-400 mt-2">Paste an admin API key to enable listing/creating/deleting keys.</div>
        )}
        {error && (<div className="text-xs text-red-400 mt-2">{error}</div>)}
      </div>

      <div className="grid gap-6">
        {keys.map(key => (
          <div key={key.id} className="card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <KeyIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{key.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      key.status === 'ACTIVE' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {key.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">Key:</span>
                      <code className="text-sm bg-slate-800/50 px-3 py-1 rounded-lg font-mono">
                        {visibleKeys.has(key.id) && key.key ? key.key : '••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => key.key && toggleKeyVisibility(key.id)}
                        disabled={!key.key}
                        title={key.key ? 'Show/Hide key (visible once after creation)' : 'Key is only shown once after creation'}
                        className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                      >
                        {key.key ? (
                          visibleKeys.has(key.id) ?
                            <EyeSlashIcon className="w-4 h-4 text-slate-400" /> :
                            <EyeIcon className="w-4 h-4 text-slate-400" />
                        ) : (
                          <EyeIcon className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                    </div>
                    {key.key && (
                      <div className="text-xs text-amber-300">This key is displayed only once. Copy and store it securely.</div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">Scopes:</span>
                      <div className="flex gap-2">
                        {key.scopes.map(scope => (
                          <span key={scope} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
                            {scope.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">
                      Created: {new Date(key.created).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => revoke(key.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors duration-200"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 grid place-items-center z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-slate-900/95 backdrop-blur-xl p-8 rounded-3xl card border border-white/10 w-full max-w-2xl mx-4">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Create New API Key
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Enter a descriptive name for your API key"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Select Scopes
                </label>
                <div className="space-y-3">
                  {availableScopes.map(scope => (
                    <label key={scope.id} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(scope.id)}
                        onChange={() => toggleScope(scope.id)}
                        className="mt-1 w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-slate-200">{scope.name}</div>
                        <div className="text-sm text-slate-400">{scope.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {createError && (
              <div className="text-sm text-red-400">{createError}</div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={createNewKey}
                disabled={isCreating}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating…' : 'Create Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
 }
