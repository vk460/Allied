import React from 'react'
import UsageCard from './UsageCard'
import QuickActions from './QuickActions'
import ApiKeysPanel from './ApiKeysPanel'
import { 
  ClockIcon, 
  CheckCircleIcon, 
  DocumentTextIcon,
  KeyIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function DashboardMain(){
  const recentActivities = [
    {
      id: 1,
      type: 'audio',
      title: 'Translated audio (5m)',
      status: 'Completed',
      time: '2 hours ago',
      icon: CheckCircleIcon,
      color: 'text-green-400'
    },
    {
      id: 2,
      type: 'api',
      title: 'Created API key',
      status: 'Training Portal Key',
      time: '1 day ago',
      icon: KeyIcon,
      color: 'text-blue-400'
    },
    {
      id: 3,
      type: 'document',
      title: 'Uploaded document',
      status: 'safety_manual.pdf',
      time: '2 days ago',
      icon: DocumentTextIcon,
      color: 'text-purple-400'
    },
    {
      id: 4,
      type: 'usage',
      title: 'Usage milestone',
      status: '10K API calls reached',
      time: '3 days ago',
      icon: ArrowTrendingUpIcon,
      color: 'text-yellow-400'
    }
  ]

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome back! 👋
          </h1>
          <p className="text-slate-400 mt-2">Your localization platform dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl">
            <SparklesIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Free Plan</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold">AK</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <UsageCard />
          
          {/* Enhanced Recent Activity */}
          <div className="card p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-slate-400" />
                Recent Activity
              </h3>
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-200">{activity.title}</div>
                      <div className="text-sm text-slate-400">{activity.status}</div>
                    </div>
                    <div className="text-xs text-slate-500">{activity.time}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <QuickActions />
          <ApiKeysPanel />
        </div>
      </div>
    </div>
  )
}
