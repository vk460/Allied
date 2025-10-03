import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import DashboardMain from './components/DashboardMain'
import LoginPage from './components/auth/LoginPage'
import SignupPage from './components/auth/SignupPage'
import ApiKeysPage from './components/dashboard/ApiKeysPage'
import UsageBillingPage from './components/dashboard/UsageBillingPage'
import GlossaryPage from './components/dashboard/GlossaryPage'

type AuthState = 'login' | 'signup' | 'authenticated'
type DashboardPage = 'dashboard' | 'api-keys' | 'usage-billing' | 'glossary' | 'feedback' | 'settings'

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('login')
  const [currentPage, setCurrentPage] = useState<DashboardPage>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  const handleLogin = (email: string, password: string) => {
    // Simulate successful login
    setUser({ email, name: email.split('@')[0] })
    setAuthState('authenticated')
  }

  const handleSignup = (data: any) => {
    // Simulate successful signup
    setUser({ email: data.email, name: data.firstName })
    setAuthState('authenticated')
  }

  const handleLogout = () => {
    setUser(null)
    setAuthState('login')
    setCurrentPage('dashboard')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardMain />
      case 'api-keys':
        return <ApiKeysPage />
      case 'usage-billing':
        return <UsageBillingPage />
      case 'glossary':
        return <GlossaryPage />
      case 'feedback':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Feedback & Support
              </h1>
              <p className="text-slate-400 mt-2">Share your feedback and get help</p>
            </div>
            <div className="card p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-slate-400">Feedback and support features are under development.</p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-slate-500 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-slate-400 mt-2">Manage your account and preferences</p>
            </div>
            <div className="card p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-slate-400">Settings and preferences are under development.</p>
            </div>
          </div>
        )
      default:
        return <DashboardMain />
    }
  }

  if (authState === 'login') {
    return (
      <LoginPage 
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthState('signup')}
      />
    )
  }

  if (authState === 'signup') {
    return (
      <SignupPage 
        onSignup={handleSignup}
        onSwitchToLogin={() => setAuthState('login')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          <Sidebar 
            collapsed={collapsed} 
            onToggle={() => setCollapsed(c => !c)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onLogout={handleLogout}
            user={user}
          />
          <div className="flex-1">
            {renderCurrentPage()}
          </div>
        </div>
      </div>
    </div>
  )
}
