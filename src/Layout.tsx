import { useRef, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Bell, User, LogOut } from 'lucide-react'
import BottomTabs from './BottomTabs'
import ThemeToggle from './ThemeToggle'
import { images } from './assets/Images/Images'
import type { User as UserType } from './types'
import './Dashboard.css'

interface Props {
  user: UserType
  onLogout: () => void
}

export default function Layout({ user, onLogout }: Props) {
  const [dropOpen, setDropOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', isDark)
    return isDark
  })
  const dropRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  function toggleTheme() {
    const isDark = !dark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="dash-wrapper">
      <header className="dash-header">
        <div className="dash-header-left">
          <img src={images.logo} alt="logo" className="dash-logo-img" />
          {user.role === 'owner' && (
            <span className="dash-shop-name">🏪 {user.username}'s Shop</span>
          )}
        </div>

        <div className="dash-header-right">
          {/* <ThemeToggle dark={dark} onToggle={toggleTheme} /> */}
          <div className="dash-drop-wrap" ref={dropRef}>
            <button className="dash-avatar-btn" onClick={() => setDropOpen(o => !o)} aria-label="Profile">
              <img src={images.profile} alt="profile" className="dash-avatar" />
            </button>
            {dropOpen && (
              <div className="dash-dropdown">
                <div className="drop-user">
                  <span className="drop-username">{user.username}</span>
                  <span className="drop-role">{user.role}</span>
                </div>
                <div className="drop-divider" />
                <button className="drop-item" onClick={() => { navigate('/app/profile'); setDropOpen(false) }}>
                  <User size={16} /> Profile
                </button>
                <button className="drop-item" onClick={() => { navigate('/app/activity'); setDropOpen(false) }}>
                  <Bell size={16} /> Notifications
                </button>
                <div className="drop-divider" />
                <button className="drop-item drop-item--danger" onClick={() => { onLogout(); navigate('/login') }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="dash-main">
        <Outlet />
      </main>

      <BottomTabs role={user.role} />
    </div>
  )
}
