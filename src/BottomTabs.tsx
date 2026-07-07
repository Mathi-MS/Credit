import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Plus, Activity, User } from 'lucide-react'
import type { Role } from './types'
import AddLendModal from './AddLendModal'
import './BottomTabs.css'

interface Tab { id: string; label: string; icon: React.ReactNode }

const superadminTabs: Tab[] = [
  { id: 'dashboard', label: 'Home',     icon: <LayoutDashboard size={22} /> },
  { id: 'owner',     label: 'Owners',   icon: <Users size={22} /> },
  { id: 'add',       label: '',         icon: <Plus size={26} strokeWidth={2.5} /> },
  { id: 'activity',  label: 'Activity', icon: <Activity size={22} /> },
  { id: 'profile',   label: 'Profile',  icon: <User size={22} /> },
]

const ownerTabs: Tab[] = [
  { id: 'dashboard', label: 'Home',     icon: <LayoutDashboard size={22} /> },
  { id: 'users',     label: 'Users',    icon: <Users size={22} /> },
  { id: 'add',       label: '',         icon: <Plus size={26} strokeWidth={2.5} /> },
  { id: 'activity',  label: 'Activity', icon: <Activity size={22} /> },
  { id: 'profile',   label: 'Profile',  icon: <User size={22} /> },
]

export default function BottomTabs({ role }: { role: Role }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [ripple, setRipple] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const tabs = role === 'superadmin' ? superadminTabs : ownerTabs

  function handleTap(id: string) {
    if (id === 'add') { setShowModal(true); return }
    setRipple(id)
    setTimeout(() => setRipple(null), 400)
    navigate(`/app/${id}`)
  }

  return (
    <>
    {showModal && <AddLendModal onClose={() => setShowModal(false)} />}
    <nav className="bottom-tabs">
      {tabs.map(tab =>
        tab.id === 'add' ? (
          <button key={tab.id} className="tab-fab" onClick={() => handleTap('add')} aria-label="Add">
            <span className="fab-inner">
              <Plus size={32} strokeWidth={2.5} />
            </span>
          </button>
        ) : (
          <button
            key={tab.id}
            className={`tab-btn ${pathname.endsWith(tab.id) ? 'active' : ''}`}
            onClick={() => handleTap(tab.id)}
            aria-label={tab.label}
          >
            <span className="tab-float">
              {ripple === tab.id && <span className="tab-ripple" />}
              <span className="tab-icon">{tab.icon}</span>
            </span>
            <span className="tab-label">{tab.label}</span>
            {pathname.endsWith(tab.id) && <span className="tab-dot" />}
          </button>
        )
      )}
    </nav>
    </>
  )
}
