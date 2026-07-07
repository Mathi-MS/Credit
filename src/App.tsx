import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import LoginPage from './LoginPage'
import Layout from './Layout'
import Dashboard from './Dashboard'
import ProfilePage from './ProfilePage'
import type { User } from './types'
import './App.css'

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  function handleLogin(u: User) {
    sessionStorage.setItem('user', JSON.stringify(u))
    setUser(u)
  }

  function handleLogout() {
    sessionStorage.removeItem('user')
    setUser(null)
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/app/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
      />
      <Route
        path="/app"
        element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="owner" element={<div  className="page-placeholder">Owners content goes here.</div>} />
        <Route path="add" element={<div  className="page-placeholder">Add New content goes here.</div>} />
        <Route path="activity" element={<div  className="page-placeholder">Activity content goes here.</div>} />
        <Route path="profile" element={<ProfilePage user={user!} onLogout={handleLogout} />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
