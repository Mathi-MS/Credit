import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'
import './ActivityDetailPage.css'

const STATUS_COLORS = { returned: '#22c55e', pending: '#f59e0b', overdue: '#ef4444' }
type Status = 'returned' | 'pending' | 'overdue'

interface Lend {
  id: number
  name: string
  mobile: string
  aadhar: string
  amount: number
  endDate: string
  extendedDate: string | null
  remarks: string
  status: Status
}

export default function ActivityDetailPage() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  const [lend, setLend]       = useState<Lend>(state?.item)
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState<Lend>({ ...state?.item })
  const [confirm, setConfirm] = useState(false)

  if (!lend) { navigate(-1); return null }

  const color = STATUS_COLORS[lend.status]

  function set(key: keyof Lend, val: string) {
    setForm(f => ({ ...f, [key]: key === 'amount' ? Number(val) : val === '' ? null : val }))
  }

  function handleConfirm() {
    setLend(form)
    setConfirm(false)
    setEditing(false)
  }

  return (
    <div className="ad-page">

      {/* header */}
      <div className="ad-header">
        <button className="ad-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="ad-header-title">Lend Details</span>
        <button className="ad-edit-btn" onClick={() => { setForm({ ...lend }); setEditing(e => !e) }}>
          <Pencil size={14} />{editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* hero */}
      <div className="ad-hero">
        <div className="ad-hero-avatar">
          {lend.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <span className="ad-hero-name">{lend.name}</span>
        <span className="ad-hero-mobile">{lend.mobile}</span>
        <span className="ad-hero-amount">₹{lend.amount.toLocaleString('en-IN')}</span>
        <span className="ad-status-badge" style={{ background: color + '22', color }}>
          {lend.status.charAt(0).toUpperCase() + lend.status.slice(1)}
        </span>
      </div>

      {editing ? (
        <div className="ad-edit-form">
          {([
            { key: 'name',         label: 'Name',          type: 'text'   },
            { key: 'mobile',       label: 'Mobile',        type: 'tel'    },
            { key: 'aadhar',       label: 'Aadhar',        type: 'text'   },
            { key: 'amount',       label: 'Amount (₹)',    type: 'number' },
            { key: 'endDate',      label: 'End Date',      type: 'date'   },
            { key: 'extendedDate', label: 'Extended Date', type: 'date'   },
            { key: 'remarks',      label: 'Remarks',       type: 'text'   },
          ] as { key: keyof Lend; label: string; type: string }[]).map(({ key, label, type }) => (
            <div className="ad-form-field" key={key}>
              <label className="ad-form-label">{label}</label>
              <input
                className="ad-form-input"
                type={type}
                value={(form[key] ?? '') as string}
                onChange={e => set(key, e.target.value)}
              />
            </div>
          ))}
          <div className="ad-form-field">
            <label className="ad-form-label">Status</label>
            <select
              className="ad-form-input ad-form-select"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}
            >
              <option value="pending">Pending</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <button className="ad-submit-btn" onClick={() => setConfirm(true)}>Submit</button>
        </div>
      ) : (
        <div className="ad-card">
          {([
            ['Aadhar',        lend.aadhar],
            ['End Date',      lend.endDate],
            ['Extended Date', lend.extendedDate ?? '—'],
            ['Remarks',       lend.remarks],
          ] as [string, string][]).map(([label, value]) => (
            <div className="ad-row" key={label}>
              <span className="ad-label">{label}</span>
              <span className="ad-value">{value}</span>
            </div>
          ))}
        </div>
      )}

      {confirm && (
        <div className="ad-confirm-overlay">
          <div className="ad-confirm-box">
            <p className="ad-confirm-msg">Are you sure you want to save the changes?</p>
            <div className="ad-confirm-actions">
              <button className="ad-confirm-cancel" onClick={() => setConfirm(false)}>Cancel</button>
              <button className="ad-confirm-ok" onClick={handleConfirm}>OK, Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
