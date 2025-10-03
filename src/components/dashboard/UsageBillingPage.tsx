import React, { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, BarElement } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, ChartBarIcon } from '@heroicons/react/24/outline'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, BarElement)

const usageData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  datasets: [{
    label: 'API Calls (thousands)',
    data: [8.2, 12.5, 9.8, 15.2, 18.5, 22.1, 19.8, 25.3, 28.7, 32.4],
    tension: 0.35,
    fill: true,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.8)',
    borderWidth: 2
  }]
}

const billingData = {
  labels: ['Text Translation', 'Audio Translation', 'Video Translation', 'Glossary Access', 'API Calls'],
  datasets: [{
    label: 'Usage This Month',
    data: [45, 23, 12, 8, 32],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(147, 51, 234, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(245, 158, 11, 0.8)'
    ],
    borderColor: [
      'rgba(59, 130, 246, 1)',
      'rgba(147, 51, 234, 1)',
      'rgba(236, 72, 153, 1)',
      'rgba(34, 197, 94, 1)',
      'rgba(245, 158, 11, 1)'
    ],
    borderWidth: 1
  }]
}

export default function UsageBillingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const currentUsage = {
    requests: 32450,
    audioMinutes: 320,
    documents: 42,
    cost: 89.50
  }

  const previousUsage = {
    requests: 28900,
    audioMinutes: 280,
    documents: 38,
    cost: 76.20
  }

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Usage & Billing
          </h1>
          <p className="text-slate-400 mt-2">Monitor your usage and manage billing</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-xl font-medium transition-all duration-200">
            <CreditCardIcon className="w-5 h-5" />
            Manage Billing
          </button>
        </div>
      </div>

      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              parseFloat(calculateChange(currentUsage.requests, previousUsage.requests)) > 0 
                ? 'text-green-400' : 'text-red-400'
            }`}>
              {parseFloat(calculateChange(currentUsage.requests, previousUsage.requests)) > 0 ? 
                <ArrowUpIcon className="w-4 h-4" /> : 
                <ArrowDownIcon className="w-4 h-4" />
              }
              {Math.abs(parseFloat(calculateChange(currentUsage.requests, previousUsage.requests)))}%
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">{currentUsage.requests.toLocaleString()}</div>
            <div className="text-sm text-slate-400">API Requests</div>
          </div>
        </div>

        <div className="card p-6 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
              </svg>
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              parseFloat(calculateChange(currentUsage.audioMinutes, previousUsage.audioMinutes)) > 0 
                ? 'text-green-400' : 'text-red-400'
            }`}>
              {parseFloat(calculateChange(currentUsage.audioMinutes, previousUsage.audioMinutes)) > 0 ? 
                <ArrowUpIcon className="w-4 h-4" /> : 
                <ArrowDownIcon className="w-4 h-4" />
              }
              {Math.abs(parseFloat(calculateChange(currentUsage.audioMinutes, previousUsage.audioMinutes)))}%
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">{currentUsage.audioMinutes}</div>
            <div className="text-sm text-slate-400">Audio Minutes</div>
          </div>
        </div>

        <div className="card p-6 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              parseFloat(calculateChange(currentUsage.documents, previousUsage.documents)) > 0 
                ? 'text-green-400' : 'text-red-400'
            }`}>
              {parseFloat(calculateChange(currentUsage.documents, previousUsage.documents)) > 0 ? 
                <ArrowUpIcon className="w-4 h-4" /> : 
                <ArrowDownIcon className="w-4 h-4" />
              }
              {Math.abs(parseFloat(calculateChange(currentUsage.documents, previousUsage.documents)))}%
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">{currentUsage.documents}</div>
            <div className="text-sm text-slate-400">Documents</div>
          </div>
        </div>

        <div className="card p-6 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CreditCardIcon className="w-6 h-6 text-green-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              parseFloat(calculateChange(currentUsage.cost, previousUsage.cost)) > 0 
                ? 'text-red-400' : 'text-green-400'
            }`}>
              {parseFloat(calculateChange(currentUsage.cost, previousUsage.cost)) > 0 ? 
                <ArrowUpIcon className="w-4 h-4" /> : 
                <ArrowDownIcon className="w-4 h-4" />
              }
              {Math.abs(parseFloat(calculateChange(currentUsage.cost, previousUsage.cost)))}%
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">${currentUsage.cost}</div>
            <div className="text-sm text-slate-400">This Month</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold mb-4">Usage Trends</h3>
          <div className="h-64">
            <Line 
              data={usageData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: { color: '#94a3b8' }
                  }
                },
                scales: {
                  x: { 
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  },
                  y: { 
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="card p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold mb-4">Usage Breakdown</h3>
          <div className="h-64">
            <Bar 
              data={billingData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: { color: '#94a3b8' }
                  }
                },
                scales: {
                  x: { 
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  },
                  y: { 
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="card p-6 rounded-2xl border border-white/5">
        <h3 className="text-lg font-semibold mb-4">Recent Billing</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Description</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2024-10-01', desc: 'Monthly Subscription', amount: '$89.50', status: 'Paid' },
                { date: '2024-09-01', desc: 'Monthly Subscription', amount: '$76.20', status: 'Paid' },
                { date: '2024-08-01', desc: 'Monthly Subscription', amount: '$68.90', status: 'Paid' },
                { date: '2024-07-15', desc: 'Overage Charges', amount: '$12.30', status: 'Paid' }
              ].map((bill, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-3 px-4 text-slate-300">{bill.date}</td>
                  <td className="py-3 px-4 text-slate-300">{bill.desc}</td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{bill.amount}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {bill.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
