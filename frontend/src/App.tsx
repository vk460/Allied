import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import DashboardMain from './components/DashboardMain'
import LoginPage from './components/auth/LoginPage'
import SignupPage from './components/auth/SignupPage'
import ApiKeysPage from './components/dashboard/ApiKeysPage'
import UsageBillingPage from './components/dashboard/UsageBillingPage'
import TestClient from './components/TestClient'

type AuthState = 'login' | 'signup' | 'authenticated'
type DashboardPage =
  | 'dashboard'
  | 'api-keys'
  | 'usage-billing'
  | 'test-client'
  | 'feedback'
  | 'settings'

const pageOrder: DashboardPage[] = [
  'dashboard',
  'api-keys',
  'usage-billing',
  'test-client',
  'feedback',
  'settings',
]

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('login')
  const [currentPage, setCurrentPage] = useState<DashboardPage>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth_state') as AuthState | null
    const savedUser = localStorage.getItem('auth_user')
    if (savedAuth === 'authenticated' && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setAuthState('authenticated')
      } catch {}
    }
  }, [])

  const handleLogin = (email: string) => {
    setUser({ email, name: email.split('@')[0] })
    setAuthState('authenticated')
    localStorage.setItem('auth_state', 'authenticated')
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ email, name: email.split('@')[0] })
    )
  }

  const handleSignup = (data: any) => {
    setUser({ email: data.email, name: data.firstName })
    setAuthState('authenticated')
    localStorage.setItem('auth_state', 'authenticated')
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ email: data.email, name: data.firstName })
    )
  }

  const handleLogout = () => {
    setUser(null)
    setAuthState('login')
    setCurrentPage('dashboard')
    localStorage.removeItem('auth_state')
    localStorage.removeItem('auth_user')
  }

  const goBackPage = () => {
    const idx = pageOrder.indexOf(currentPage)
    if (idx > 0) {
      setCurrentPage(pageOrder[idx - 1])
    }
  }

  // Touchpad swipe (horizontal)
  useEffect(() => {
    let lastX = 0
    let isTouchpad = false

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > 20 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        isTouchpad = true
        if (e.deltaX < 0) goBackPage() // swipe right → back
      }
      lastX = e.deltaX
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [currentPage])

  // Mobile swipe
  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      if (touchEndX - touchStartX > 50) goBackPage() // swipe right → back
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentPage])

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardMain />
      case 'api-keys':
        return <ApiKeysPage />
      case 'usage-billing':
        return <UsageBillingPage />
      case 'test-client':
        return <TestClient />
      case 'feedback':
        return <div>Feedback Page (Coming Soon)</div>
      case 'settings':
        return <div>Settings Page (Coming Soon)</div>
      default:
        return <DashboardMain />
    }
  }

  if (authState === 'login') {
    return <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setAuthState('signup')} />
  }

  if (authState === 'signup') {
    return <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setAuthState('login')} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((c) => !c)}
            currentPage={currentPage}
            onPageChange={(p) => setCurrentPage(p as DashboardPage)}
            onLogout={handleLogout}
            user={user}
          />
          <div className="flex-1">{renderCurrentPage()}</div>
        </div>
      </div>
    </div>
  )
}
