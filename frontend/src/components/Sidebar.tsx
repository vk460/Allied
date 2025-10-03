import React from 'react'
import clsx from 'clsx'
import Logo from './Logo'
import { 
  HomeIcon, 
  KeyIcon, 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  currentPage: string
  onPageChange: (page: string) => void
  onLogout: () => void
  user: { email: string; name: string } | null
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { id: 'api-keys', label: 'API Keys', icon: KeyIcon },
  { id: 'usage-billing', label: 'Usage & Billing', icon: ChartBarIcon },
  { id: 'test-client', label: 'Test Client', icon: ChatBubbleLeftRightIcon },
  { id: 'feedback', label: 'Feedback', icon: ChatBubbleLeftRightIcon },
  { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
]

export default function Sidebar({ collapsed, onToggle, currentPage, onPageChange, onLogout, user }: SidebarProps) {
  return (
    <aside className={clsx('w-full sm:w-80 transition-all duration-300', collapsed && 'sm:w-20', 'fixed sm:static bottom-0 left-0 z-40 sm:z-auto bg-slate-900/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-0')}> 
      <div className="p-2 sm:p-4 card rounded-t-2xl sm:rounded-2xl h-full flex flex-row sm:flex-col items-center sm:items-stretch justify-between sm:justify-start">
        {/* Header with Logo */}
  <div className="flex items-center justify-between mb-0 sm:mb-6 w-full">
          <div className="hidden sm:block">
            {!collapsed ? (
              <Logo size="md" showText={true} />
            ) : (
              <Logo size="md" showText={false} />
            )}
          </div>
          <button 
            onClick={onToggle} 
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div className={clsx(
                'w-3 h-3 border-l-2 border-t-2 border-slate-400 transform transition-transform duration-200',
                collapsed ? 'rotate-45' : '-rotate-45'
              )} />
            </div>
          </button>
        </div>

        {/* Navigation */}
        {/* Desktop Navigation */}
        <nav className="hidden sm:flex flex-1 flex-col gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={clsx(
                  'flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left',
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400' 
                    : 'hover:bg-white/5 text-slate-300 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
        {/* Mobile Bottom Navigation */}
        <nav className="flex sm:hidden flex-row gap-1 w-full justify-between">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={clsx(
                  'flex flex-col items-center justify-center flex-1 p-2 rounded-xl transition-all duration-200',
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400' 
                    : 'hover:bg-white/5 text-slate-300 hover:text-white'
                )}
              >
                <Icon className="w-6 h-6 mx-auto" />
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Collapsed Navigation Icons */}
        {collapsed && (
          <nav className="flex-1 flex flex-col gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={clsx(
                    'flex items-center justify-center p-3 rounded-xl transition-all duration-200',
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400' 
                      : 'hover:bg-white/5 text-slate-300 hover:text-white'
                  )}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              )
            })}
          </nav>
        )}

        {/* User Section */}
        {/* User Section Desktop */}
        {!collapsed && user && (
          <div className="hidden sm:block mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200 truncate">
                  {user.name}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {user.email}
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors duration-200 mt-2"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        )}
        {/* User Section Mobile */}
        {user && (
          <div className="sm:hidden flex flex-col items-center gap-1 mt-2">
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors duration-200"
              title="Sign Out"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Collapsed User Section */}
        {collapsed && user && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors duration-200"
                title="Sign Out"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
