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
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCreateKey = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowKeyModal(false)
      // You could add a success notification here
    }, 1500)
  }

  const handleUploadDocument = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowUploadModal(false)
      // You could add a success notification here
    }, 2000)
  }

  const handleTranslateAudio = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowAudioModal(false)
      // You could add a success notification here
    }, 2500)
  }

  return (
    <div className="card p-6 rounded-2xl border border-white/5">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <SparklesIcon className="w-5 h-5 text-blue-400" />
        Quick Actions
      </h3>
      <div className="space-y-3">
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
                  placeholder="Enter a descriptive name"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Scopes
                </label>
                <div className="space-y-2">
                  {['translate_text', 'translate_audio', 'glossary_read'].map(scope => (
                    <label key={scope} className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded" />
                      <span className="text-sm text-slate-300">{scope.replace('_', ' ')}</span>
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
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
                <DocumentArrowUpIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 mb-2">Drop your document here</p>
                <p className="text-sm text-slate-400">or click to browse</p>
                <p className="text-xs text-slate-500 mt-2">Supports PDF, DOC, TXT (max 10MB)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Language
                </label>
                <select className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
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
                disabled={isProcessing}
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
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
                <SpeakerWaveIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 mb-2">Drop your audio file here</p>
                <p className="text-sm text-slate-400">or click to browse</p>
                <p className="text-xs text-slate-500 mt-2">Supports MP3, WAV, M4A (max 25MB)</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    From Language
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    To Language
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Japanese</option>
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
                disabled={isProcessing}
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
    </div>
  )
}
