import React, { useState } from 'react'
import { PlusIcon, KeyIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

type KeyItem = { 
  id: string
  name: string
  scopes: string[]
  created: string
  status: string
  key?: string
}

const SAMPLE_KEYS: KeyItem[] = [
  { 
    id: 'key_live_1', 
    name: 'Training Portal Key', 
    scopes: ['translate_text', 'glossary_read'], 
    created: '2025-09-20', 
    status: 'ACTIVE',
    key: 'lk_live_1234567890abcdef'
  },
  { 
    id: 'key_live_2', 
    name: 'Video Translator Key', 
    scopes: ['translate_video'], 
    created: '2025-10-02', 
    status: 'ACTIVE',
    key: 'lk_live_abcdef1234567890'
  }
]

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<KeyItem[]>(SAMPLE_KEYS)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [newKeyName, setNewKeyName] = useState('')
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])

  const availableScopes = [
    { id: 'translate_text', name: 'Translate Text', description: 'Translate text content' },
    { id: 'translate_audio', name: 'Translate Audio', description: 'Translate audio content' },
    { id: 'translate_video', name: 'Translate Video', description: 'Translate video content' },
    { id: 'glossary_read', name: 'Read Glossary', description: 'Access glossary entries' },
    { id: 'glossary_write', name: 'Write Glossary', description: 'Modify glossary entries' }
  ]

  function revoke(id: string) {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'REVOKED' } : k))
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

  function createNewKey() {
    if (!newKeyName.trim()) return
    
    const newKey: KeyItem = {
      id: `key_live_${Date.now()}`,
      name: newKeyName,
      scopes: selectedScopes,
      created: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      key: `lk_live_${Math.random().toString(36).substring(2, 18)}`
    }
    
    setKeys(prev => [...prev, newKey])
    setNewKeyName('')
    setSelectedScopes([])
    setShowCreateModal(false)
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
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="w-5 h-5" />
          Create New Key
        </button>
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
                        {visibleKeys.has(key.id) ? key.key : '••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        {visibleKeys.has(key.id) ? 
                          <EyeSlashIcon className="w-4 h-4 text-slate-400" /> : 
                          <EyeIcon className="w-4 h-4 text-slate-400" />
                        }
                      </button>
                    </div>
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
                  Revoke
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

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={createNewKey}
                disabled={!newKeyName.trim() || selectedScopes.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200"
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
