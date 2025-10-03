import React, { useState } from 'react'

export default function FeedbackForm(){
  const [feedback, setFeedback] = useState('')
  const [category, setCategory] = useState('results')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Persist locally for now; could be sent to backend later
    try {
      const item = { id: Date.now(), category, feedback, email, createdAt: new Date().toISOString() }
      const existing = JSON.parse(localStorage.getItem('feedback_items') || '[]')
      existing.push(item)
      localStorage.setItem('feedback_items', JSON.stringify(existing))
      setSubmitted(true)
      setFeedback('')
      setEmail('')
      setCategory('results')
    } catch {
      // ignore
    }
  }

  if (submitted) {
    return (
      <div className="card p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold mb-2">Thanks for your feedback!</h3>
        <p className="text-slate-400">We will use it to improve future results.</p>
        <button onClick={()=>setSubmitted(false)} className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Submit another</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 rounded-2xl border border-white/10 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-slate-300 mb-2">Category</label>
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10">
            <option value="results">Results Quality</option>
            <option value="ux">User Experience</option>
            <option value="feature">Feature Request</option>
            <option value="bug">Bug Report</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-300 mb-2">Email (optional)</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@company.com" className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10 text-white placeholder-slate-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Your Feedback</label>
        <textarea value={feedback} onChange={(e)=>setFeedback(e.target.value)} rows={6} placeholder="Describe what worked, what didn’t, and how we can improve."
          className="w-full px-4 py-3 rounded-2xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/40" />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={!feedback.trim()} className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:opacity-50">
          Submit Feedback
        </button>
      </div>
    </form>
  )
}


