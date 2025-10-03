import React, { useState } from 'react'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

type GlossaryEntry = {
  id: string
  term: string
  translations: { [language: string]: string }
  category: string
  created: string
  updated: string
}

const SAMPLE_ENTRIES: GlossaryEntry[] = [
  {
    id: '1',
    term: 'Machine Learning',
    translations: {
      'es': 'Aprendizaje Automático',
      'fr': 'Apprentissage Automatique',
      'de': 'Maschinelles Lernen',
      'ja': '機械学習'
    },
    category: 'Technology',
    created: '2024-09-15',
    updated: '2024-10-01'
  },
  {
    id: '2',
    term: 'Artificial Intelligence',
    translations: {
      'es': 'Inteligencia Artificial',
      'fr': 'Intelligence Artificielle',
      'de': 'Künstliche Intelligenz',
      'ja': '人工知能'
    },
    category: 'Technology',
    created: '2024-09-20',
    updated: '2024-09-25'
  },
  {
    id: '3',
    term: 'User Interface',
    translations: {
      'es': 'Interfaz de Usuario',
      'fr': 'Interface Utilisateur',
      'de': 'Benutzeroberfläche',
      'ja': 'ユーザーインターフェース'
    },
    category: 'Design',
    created: '2024-10-01',
    updated: '2024-10-01'
  }
]

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
]

const CATEGORIES = ['Technology', 'Design', 'Business', 'Marketing', 'General']

export default function GlossaryPage() {
  const [entries, setEntries] = useState<GlossaryEntry[]>(SAMPLE_ENTRIES)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<GlossaryEntry | null>(null)
  const [newEntry, setNewEntry] = useState({
    term: '',
    category: 'General',
    translations: {} as { [language: string]: string }
  })

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(entry.translations).some(translation =>
        translation.toLowerCase().includes(searchTerm.toLowerCase())
      )
    const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  function createEntry() {
    if (!newEntry.term.trim()) return

    const entry: GlossaryEntry = {
      id: Date.now().toString(),
      term: newEntry.term,
      translations: newEntry.translations,
      category: newEntry.category,
      created: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0]
    }

    setEntries(prev => [...prev, entry])
    setNewEntry({ term: '', category: 'General', translations: {} })
    setShowCreateModal(false)
  }

  function updateEntry(entry: GlossaryEntry) {
    setEntries(prev => prev.map(e =>
      e.id === entry.id
        ? { ...entry, updated: new Date().toISOString().split('T')[0] }
        : e
    ))
    setEditingEntry(null)
  }

  function deleteEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function startEdit(entry: GlossaryEntry) {
    setEditingEntry(entry)
    setNewEntry({
      term: entry.term,
      category: entry.category,
      translations: { ...entry.translations }
    })
    setShowCreateModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            Glossary Management
          </h1>
          <p className="text-slate-400 mt-2">Manage your translation glossary and terminology</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="w-5 h-5" />
          Add Term
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search terms or translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Glossary Entries */}
      <div className="grid gap-4">
        {filteredEntries.map(entry => (
          <div key={entry.id} className="card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <GlobeAltIcon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{entry.term}</h3>
                    <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-md">
                      {entry.category}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(entry.translations).map(([lang, translation]) => {
                    const language = LANGUAGES.find(l => l.code === lang)
                    return (
                      <div key={lang} className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-lg">
                        <span className="text-lg">{language?.flag}</span>
                        <div>
                          <div className="text-xs text-slate-400 uppercase">{lang}</div>
                          <div className="text-sm font-medium">{translation}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                  <span>Created: {new Date(entry.created).toLocaleDateString()}</span>
                  <span>Updated: {new Date(entry.updated).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => startEdit(entry)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <PencilIcon className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <GlobeAltIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No terms found</h3>
          <p className="text-slate-500">Try adjusting your search or add a new term to get started.</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 grid place-items-center z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setShowCreateModal(false)
            setEditingEntry(null)
            setNewEntry({ term: '', category: 'General', translations: {} })
          }} />
          <div className="relative bg-slate-900/95 backdrop-blur-xl p-8 rounded-3xl card border border-white/10 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              {editingEntry ? 'Edit Term' : 'Add New Term'}
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Term (English)
                  </label>
                  <input
                    type="text"
                    value={newEntry.term}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, term: e.target.value }))}
                    placeholder="Enter the term in English"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Translations
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LANGUAGES.filter(lang => lang.code !== 'en').map(language => (
                    <div key={language.code} className="flex items-center gap-3">
                      <span className="text-lg w-8">{language.flag}</span>
                      <span className="text-sm text-slate-400 w-16">{language.name}</span>
                      <input
                        type="text"
                        value={newEntry.translations[language.code] || ''}
                        onChange={(e) => setNewEntry(prev => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [language.code]: e.target.value
                          }
                        }))}
                        placeholder={`Translation in ${language.name}`}
                        className="flex-1 px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingEntry(null)
                  setNewEntry({ term: '', category: 'General', translations: {} })
                }}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={editingEntry ? () => updateEntry({ ...editingEntry, ...newEntry }) : createEntry}
                disabled={!newEntry.term.trim()}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200"
              >
                {editingEntry ? 'Update Term' : 'Add Term'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
