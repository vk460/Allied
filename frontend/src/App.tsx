import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import DashboardMain from './components/DashboardMain'
import LoginPage from './components/auth/LoginPage'
import SignupPage from './components/auth/SignupPage'
import ApiKeysPage from './components/dashboard/ApiKeysPage'
import UsageBillingPage from './components/dashboard/UsageBillingPage'
import GlossaryPage from './components/dashboard/GlossaryPage'
import FeedbackForm from './components/feedback/FeedbackForm'

type AuthState = 'login' | 'signup' | 'authenticated'
type DashboardPage = 'dashboard' | 'api-keys' | 'usage-billing' | 'glossary' | 'feedback' | 'settings'

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('login')
  const [currentPage, setCurrentPage] = useState<DashboardPage>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.email) {
          setUser({ email: parsed.email, name: parsed.name || parsed.email.split('@')[0] })
          setAuthState('authenticated')
        }
      }
    } catch {}
  }, [])

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
    try {
      localStorage.removeItem('auth_user')
    } catch {}
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
              <p className="text-slate-400 mt-2">Tell us about your results and ideas. We will use this to improve future outputs.</p>
            </div>
            <FeedbackForm />
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
      {/* Fixed sidebar at extreme left */}
      <div className="fixed left-0 top-0 h-screen">
        <Sidebar 
          collapsed={collapsed} 
          onToggle={() => setCollapsed(c => !c)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
          user={user}
        />
      </div>
      {/* Content with left padding to accommodate sidebar width (w-80 or w-20) */}
      <div className={collapsed ? 'pl-20' : 'pl-80'}> 
        <div className="p-6">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  )
}
