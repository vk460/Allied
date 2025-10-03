import React, { useState } from 'react'
import { 
  PlusIcon, 
  DocumentArrowUpIcon, 
  SpeakerWaveIcon,
  KeyIcon,
  XMarkIcon,
  CheckIcon,
  ArrowUpIcon,
  PlayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function QuickActions(){
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAudioModal, setShowAudioModal] = useState(false)
  const [showProjectKeyModal, setShowProjectKeyModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])
  const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null)
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null)
  const [projectKey, setProjectKey] = useState<string | null>(() => {
    try { return localStorage.getItem('project_api_key') } catch { return null }
  })

  const handleCreateKey = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowKeyModal(false)
      // You could add a success notification here
      // reset
      setNewKeyName('')
      setSelectedScopes([])
      // Persist created key so API keys list can show it
      const newKey = {
        id: `key_live_${Date.now()}`,
        name: newKeyName || 'New API Key',
        scopes: selectedScopes,
        created: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        key: `lk_live_${Math.random().toString(36).substring(2, 18)}`
      }
      try {
        const existing = JSON.parse(localStorage.getItem('created_api_keys') || '[]')
        existing.push(newKey)
        localStorage.setItem('created_api_keys', JSON.stringify(existing))
      } catch {}
    }, 1500)
  }

  const handleUploadDocument = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowUploadModal(false)
      // You could add a success notification here
      setSelectedDocFile(null)
    }, 2000)
  }

  const handleTranslateAudio = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowAudioModal(false)
      // You could add a success notification here
      setSelectedAudioFile(null)
    }, 2500)
  }

  return (
    <div className="card p-6 rounded-2xl border border-white/5">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <SparklesIcon className="w-5 h-5 text-blue-400" />
        Quick Actions
      </h3>
      <div className="space-y-3">
        {/* 1. Upload Document */}
        <button 
          onClick={() => setShowUploadModal(true)}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-white/10 hover:bg-slate-800/50 hover:border-white/20 transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
            <DocumentArrowUpIcon className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-slate-200">Upload Document</div>
            <div className="text-sm text-slate-400">Translate documents instantly</div>
          </div>
          <ArrowUpIcon className="w-5 h-5 text-purple-400" />
        </button>

        {/* 2. Translate Audio */}
        <button 
          onClick={() => setShowAudioModal(true)}
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-white/10 hover:bg-slate-800/50 hover:border-white/20 transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
            <SpeakerWaveIcon className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-slate-200">Translate Audio</div>
            <div className="text-sm text-slate-400">Convert speech to text</div>
          </div>
          <PlayIcon className="w-5 h-5 text-emerald-400" />
        </button>

        {/* 3. Create API Key */}
        <button 
          onClick={() => setShowKeyModal(true)} 
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
            <KeyIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-slate-200">Create API Key</div>
            <div className="text-sm text-slate-400">Generate a new API key</div>
          </div>
          <PlusIcon className="w-5 h-5 text-blue-400" />
        </button>

        {/* 4. Project API Key */}
        <button 
          onClick={() => setShowProjectKeyModal(true)} 
          className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-white/10 hover:bg-slate-800/50 transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
            <KeyIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-slate-200">Get Project API Key</div>
            <div className="text-sm text-slate-400">Single key for the entire app</div>
          </div>
          <PlusIcon className="w-5 h-5 text-indigo-400" />
        </button>
      </div>

      {/* Create API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 grid place-items-center z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowKeyModal(false)} />
          <div className="relative bg-slate-900/95 backdrop-blur-xl p-8 rounded-3xl card border border-white/10 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Create API Key
              </h4>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e)=>setNewKeyName(e.target.value)}
                  placeholder="Enter a descriptive name"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Scopes
                </label>
                <div className="space-y-2">
                  {['translate_text', 'translate_audio', 'translate_video', 'document_translate_analyze'].map(scope => (
                    <label key={scope} className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={selectedScopes.includes(scope)}
                        onChange={() => setSelectedScopes(prev => prev.includes(scope) ? prev.filter(s=>s!==scope) : [...prev, scope])}
                        className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded" />
                      <span className="text-sm text-slate-300">{scope.replaceAll('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setShowKeyModal(false)}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateKey}
                disabled={isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Create Key
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 grid place-items-center z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div className="relative bg-slate-900/95 backdrop-blur-xl p-8 rounded-3xl card border border-white/10 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Upload Document
              </h4>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <label className="block border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
                <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e)=> setSelectedDocFile(e.target.files?.[0] || null)} />
                <DocumentArrowUpIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 mb-2">{selectedDocFile ? selectedDocFile.name : 'Drop your document here'}</p>
                <p className="text-sm text-slate-400">or click to browse</p>
                <p className="text-xs text-slate-500 mt-2">Supports PDF, DOC, TXT (max 10MB)</p>
              </label>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Language
                </label>
                <select className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                  <option>English</option>
                  <option>Assamese</option>
                  <option>Bengali</option>
                  <option>Bodo</option>
                  <option>Dogri</option>
                  <option>Gujarati</option>
                  <option>Hindi</option>
                  <option>Kannada</option>
                  <option>Kashmiri</option>
                  <option>Konkani</option>
                  <option>Maithili</option>
                  <option>Malayalam</option>
                  <option>Manipuri</option>
                  <option>Marathi</option>
                  <option>Odia</option>
                  <option>Punjabi</option>
                  <option>Sanskrit</option>
                  <option>Santali</option>
                  <option>Sindhi</option>
                  <option>Tamil</option>
                  <option>Telugu</option>
                  <option>Urdu</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleUploadDocument}
                disabled={isProcessing || !selectedDocFile}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <DocumentArrowUpIcon className="w-4 h-4" />
                    Upload & Translate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Translate Audio Modal */}
      {showAudioModal && (
        <div className="fixed inset-0 grid place-items-center z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAudioModal(false)} />
          <div className="relative bg-slate-900/95 backdrop-blur-xl p-8 rounded-3xl card border border-white/10 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                Translate Audio
              </h4>
              <button 
                onClick={() => setShowAudioModal(false)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <label className="block border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
                <input type="file" accept="audio/*" className="hidden" onChange={(e)=> setSelectedAudioFile(e.target.files?.[0] || null)} />
                <SpeakerWaveIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 mb-2">{selectedAudioFile ? selectedAudioFile.name : 'Drop your audio file here'}</p>
                <p className="text-sm text-slate-400">or click to browse</p>
                <p className="text-xs text-slate-500 mt-2">Supports MP3, WAV, M4A (max 25MB)</p>
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    From Language
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option>English</option>
                    <option>Assamese</option>
                    <option>Bengali</option>
                    <option>Bodo</option>
                    <option>Dogri</option>
                    <option>Gujarati</option>
                    <option>Hindi</option>
                    <option>Kannada</option>
                    <option>Kashmiri</option>
                    <option>Konkani</option>
                    <option>Maithili</option>
                    <option>Malayalam</option>
                    <option>Manipuri</option>
                    <option>Marathi</option>
                    <option>Odia</option>
                    <option>Punjabi</option>
                    <option>Sanskrit</option>
                    <option>Santali</option>
                    <option>Sindhi</option>
                    <option>Tamil</option>
                    <option>Telugu</option>
                    <option>Urdu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    To Language
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option>Assamese</option>
                    <option>Bengali</option>
                    <option>Bodo</option>
                    <option>Dogri</option>
                    <option>Gujarati</option>
                    <option>Hindi</option>
                    <option>Kannada</option>
                    <option>Kashmiri</option>
                    <option>Konkani</option>
                    <option>Maithili</option>
                    <option>Malayalam</option>
                    <option>Manipuri</option>
                    <option>Marathi</option>
                    <option>Nepali</option>
                    <option>Odia</option>
                    <option>Punjabi</option>
                    <option>Sanskrit</option>
                    <option>Santali</option>
                    <option>Sindhi</option>
                    <option>Tamil</option>
                    <option>Telugu</option>
                    <option>Urdu</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setShowAudioModal(false)}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleTranslateAudio}
                disabled={isProcessing || !selectedAudioFile}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <SpeakerWaveIcon className="w-4 h-4" />
                    Translate Audio
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project API Key Modal */}
      {showProjectKeyModal && (
        <div className="fixed inset-0 grid place-items-center z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowProjectKeyModal(false)} />
          <div className="relative bg-slate-900/95 backdrop-blur-xl p-8 rounded-3xl card border border-white/10 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
                Project API Key
              </h4>
              <button 
                onClick={() => setShowProjectKeyModal(false)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-400">Use a single API key that combines permissions across your workspace.</p>
              <div className="flex items-center gap-2 bg-slate-800/50 border border-white/10 rounded-xl px-3 py-2">
                <code className="font-mono text-slate-200 text-sm truncate flex-1">{projectKey || 'Not generated yet'}</code>
                <button
                  onClick={async() => { try { await navigator.clipboard.writeText(projectKey || '') } catch {} }}
                  disabled={!projectKey}
                  className="px-3 py-1 text-sm rounded-lg bg-white/10 disabled:opacity-50"
                >Copy</button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowProjectKeyModal(false)}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors duration-200"
              >Close</button>
              <button
                onClick={() => {
                  const key = `proj_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`
                  try { localStorage.setItem('project_api_key', key) } catch {}
                  setProjectKey(key)
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white rounded-xl font-medium transition-all duration-200"
              >{projectKey ? 'Regenerate' : 'Generate'} Key</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
