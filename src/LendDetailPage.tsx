import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'
import './LendDetailPage.css'

const LEND_COLORS = { returned: '#22c55e', pending: '#f59e0b', overdue: '#ef4444' }
type LendStatus = 'returned' | 'pending' | 'overdue'

interface Lend {
  id: number
  amount: number
  endDate: string
  extendedDate: string | null
  remarks: string
  lendStatus: LendStatus
}

export default function LendDetailPage() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const userName  = state?.userName ?? ''

  const [lend, setLend]       = useState<Lend>(state?.lend)
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState<Lend>({ ...state?.lend })
  const [confirm, setConfirm] = useState(false)

  if (!lend) { navigate(-1); return null }

  const color = LEND_COLORS[lend.lendStatus]

  function set(key: keyof Lend, val: string) {
    setForm(f => ({ ...f, [key]: key === 'amount' ? Number(val) : val === '' ? null : val }))
  }

  function handleConfirm() {
    setLend(form)
    setConfirm(false)
    setEditing(false)
  }

  return (
    <div className="ld-page">
      {/* header */}
      <div className="ld-header">
        <button className="ld-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="ld-header-title">Lend Details</span>
        <button className="ld-edit-btn" onClick={() => { setForm({ ...lend }); setEditing(e => !e) }}>
          <Pencil size={14} />{editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* hero */}
      <div className="ld-hero">
        <div className="ld-hero-avatar">{userName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}</div>
        <span className="ld-hero-name">{userName}</span>
        <span className="ld-hero-amount">₹{lend.amount.toLocaleString('en-IN')}</span>
        <span className="ld-status-badge" style={{ background: color + '22', color }}>
          {lend.lendStatus.charAt(0).toUpperCase() + lend.lendStatus.slice(1)}
        </span>
      </div>

      {editing ? (
        <div className="ld-edit-form">
          {([
            { key: 'amount',       label: 'Amount (₹)',    type: 'number' },
            { key: 'endDate',      label: 'End Date',      type: 'date'   },
            { key: 'extendedDate', label: 'Extended Date', type: 'date'   },
            { key: 'remarks',      label: 'Remarks',       type: 'text'   },
          ] as { key: keyof Lend; label: string; type: string }[]).map(({ key, label, type }) => (
            <div className="ld-form-field" key={key}>
              <label className="ld-form-label">{label}</label>
              <input
                className="ld-form-input"
                type={type}
                value={(form[key] ?? '') as string}
                onChange={e => set(key, e.target.value)}
              />
            </div>
          ))}
          <div className="ld-form-field">
            <label className="ld-form-label">Status</label>
            <select
              className="ld-form-input ld-form-select"
              value={form.lendStatus}
              onChange={e => setForm(f => ({ ...f, lendStatus: e.target.value as LendStatus }))}
            >
              <option value="pending">Pending</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <button className="ld-submit-btn" onClick={() => setConfirm(true)}>Submit</button>
        </div>
      ) : (
        <div className="ld-card">
          {([
            ['Remarks',       lend.remarks],
            ['End Date',      lend.endDate],
            ['Extended Date', lend.extendedDate ?? '—'],
          ] as [string, string][]).map(([label, value]) => (
            <div className="ld-row" key={label}>
              <span className="ld-label">{label}</span>
              <span className="ld-value">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* confirm dialog */}
      {confirm && (
        <div className="ld-confirm-overlay">
          <div className="ld-confirm-box">
            <p className="ld-confirm-msg">Are you sure you want to save the changes?</p>
            <div className="ld-confirm-actions">
              <button className="ld-confirm-cancel" onClick={() => setConfirm(false)}>Cancel</button>
              <button className="ld-confirm-ok" onClick={handleConfirm}>OK, Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
