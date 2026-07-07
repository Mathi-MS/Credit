import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, Table2, SlidersHorizontal, XCircle, X, Pencil, ChevronRight } from 'lucide-react'
import './UsersPage.css'

interface UserRecord {
  id: number
  name: string
  mobile: string
  aadhar: string
  address: string
  status: 'active' | 'inactive'
}

interface LendRecord {
  id: number
  userId: number
  amount: number
  endDate: string
  extendedDate: string | null
  remarks: string
  lendStatus: 'returned' | 'pending' | 'overdue'
}

const LEND_COLORS = { returned: '#22c55e', pending: '#f59e0b', overdue: '#ef4444' }

function makeDate(offset: number) {
  const d = new Date(); d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

const USERS: UserRecord[] = [
  { id:1,  name:'Ravi Kumar',   mobile:'9876543210', aadhar:'2345 6789 0123', address:'12, Anna Nagar, Chennai',       status:'active'   },
  { id:2,  name:'Priya Devi',   mobile:'9123456780', aadhar:'3456 7890 1234', address:'45, Gandhi Road, Coimbatore',   status:'active'   },
  { id:3,  name:'Suresh Babu',  mobile:'9988776655', aadhar:'4567 8901 2345', address:'78, MG Road, Madurai',          status:'inactive' },
  { id:4,  name:'Meena S',      mobile:'9001122334', aadhar:'5678 9012 3456', address:'23, Nehru St, Salem',           status:'active'   },
  { id:5,  name:'Arjun R',      mobile:'9445566778', aadhar:'6789 0123 4567', address:'56, Kamaraj Ave, Trichy',       status:'active'   },
  { id:6,  name:'Kavitha M',    mobile:'9334455667', aadhar:'7890 1234 5678', address:'89, Rajaji St, Erode',          status:'inactive' },
  { id:7,  name:'Dinesh P',     mobile:'9556677889', aadhar:'8901 2345 6789', address:'34, Bharathi Nagar, Vellore',   status:'active'   },
  { id:8,  name:'Lakshmi V',    mobile:'9667788990', aadhar:'9012 3456 7890', address:'67, Periyar St, Tirunelveli',   status:'active'   },
  { id:9,  name:'Vijay T',      mobile:'9778899001', aadhar:'0123 4567 8901', address:'90, Ambedkar Rd, Thanjavur',    status:'active'   },
  { id:10, name:'Anitha K',     mobile:'9889900112', aadhar:'1234 5678 9012', address:'11, Subash Nagar, Villupuram',  status:'inactive' },
  { id:11, name:'Karthik S',    mobile:'9900112233', aadhar:'2345 6789 0124', address:'22, Indira Nagar, Cuddalore',   status:'active'   },
  { id:12, name:'Deepa R',      mobile:'9011223344', aadhar:'3456 7890 1235', address:'33, Nehru Colony, Puducherry',  status:'active'   },
  { id:13, name:'Murugan A',    mobile:'9122334455', aadhar:'4567 8901 2346', address:'44, Anna St, Karur',            status:'active'   },
  { id:14, name:'Selvi B',      mobile:'9233445566', aadhar:'5678 9012 3457', address:'55, Gandhi Nagar, Namakkal',    status:'inactive' },
  { id:15, name:'Bala C',       mobile:'9344556677', aadhar:'6789 0123 4568', address:'66, Rajiv Nagar, Dharmapuri',   status:'active'   },
]

const LENDS: LendRecord[] = [
  { id:1,  userId:1,  amount:50000, endDate:makeDate(-30), extendedDate:makeDate(-10), remarks:'Gold pledge',       lendStatus:'returned' },
  { id:2,  userId:1,  amount:20000, endDate:makeDate(-60), extendedDate:null,           remarks:'Medical expense',  lendStatus:'returned' },
  { id:3,  userId:1,  amount:15000, endDate:makeDate(5),   extendedDate:null,           remarks:'Business need',    lendStatus:'pending'  },
  { id:4,  userId:2,  amount:30000, endDate:makeDate(-5),  extendedDate:null,           remarks:'Urgent need',      lendStatus:'overdue'  },
  { id:5,  userId:2,  amount:12000, endDate:makeDate(3),   extendedDate:makeDate(10),   remarks:'Education fee',    lendStatus:'pending'  },
  { id:6,  userId:3,  amount:8000,  endDate:makeDate(-15), extendedDate:null,           remarks:'House repair',     lendStatus:'overdue'  },
  { id:7,  userId:4,  amount:45000, endDate:makeDate(-60), extendedDate:makeDate(-30),  remarks:'Vehicle purchase', lendStatus:'returned' },
  { id:8,  userId:4,  amount:22000, endDate:makeDate(7),   extendedDate:null,           remarks:'Shop stock',       lendStatus:'pending'  },
  { id:9,  userId:5,  amount:18000, endDate:makeDate(-45), extendedDate:makeDate(-20),  remarks:'Shop renovation',  lendStatus:'returned' },
  { id:10, userId:6,  amount:9000,  endDate:makeDate(-10), extendedDate:null,           remarks:'Personal use',     lendStatus:'overdue'  },
  { id:11, userId:7,  amount:35000, endDate:makeDate(7),   extendedDate:null,           remarks:'Land purchase',    lendStatus:'pending'  },
  { id:12, userId:8,  amount:11000, endDate:makeDate(-3),  extendedDate:makeDate(5),    remarks:'Medical bills',    lendStatus:'pending'  },
  { id:13, userId:9,  amount:60000, endDate:makeDate(-90), extendedDate:makeDate(-60),  remarks:'Business expand',  lendStatus:'returned' },
  { id:14, userId:10, amount:7500,  endDate:makeDate(-8),  extendedDate:null,           remarks:'Grocery stock',    lendStatus:'overdue'  },
  { id:15, userId:11, amount:25000, endDate:makeDate(2),   extendedDate:null,           remarks:'Rent advance',     lendStatus:'pending'  },
]

function avatar(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return (
    <span className="usr-badge" style={{
      background: status === 'active' ? '#22c55e22' : '#94a3b822',
      color: status === 'active' ? '#16a34a' : '#64748b'
    }}>{status}</span>
  )
}

function LendBadge({ status }: { status: LendRecord['lendStatus'] }) {
  return (
    <span className="usr-badge" style={{ background: LEND_COLORS[status] + '22', color: LEND_COLORS[status] }}>
      {status}
    </span>
  )
}

/* ── User Detail Drawer ── */
function UserDrawer({ user, lends, onClose, onSave }: {
  user: UserRecord
  lends: LendRecord[]
  onClose: () => void
  onSave: (u: UserRecord) => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<UserRecord>({ ...user })
  const [confirm, setConfirm] = useState(false)
  const navigate = useNavigate()

  const total    = lends.length
  const returned = lends.filter(l => l.lendStatus === 'returned').length
  const pending  = lends.filter(l => l.lendStatus === 'pending').length
  const overdue  = lends.filter(l => l.lendStatus === 'overdue').length

  function set(key: keyof UserRecord, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  return (
    <div className="usr-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="usr-drawer">

        {/* header */}
        <div className="usr-drawer-head">
          <div className="usr-drawer-avatar">{avatar(user.name)}</div>
          <div className="usr-drawer-head-text">
            <span className="usr-drawer-name">{user.name}</span>
            <StatusBadge status={form.status} />
          </div>
          <div className="usr-drawer-head-actions">
            <button className="usr-edit-toggle" onClick={() => setEditing(e => !e)}>
              <Pencil size={13} />{editing ? 'Cancel' : 'Edit'}
            </button>
            <button className="usr-close-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        <div className="usr-drawer-body">
          {editing ? (
            <div className="usr-edit-form">
              {([
                { key: 'name',    label: 'Name',    type: 'text' },
                { key: 'mobile',  label: 'Mobile',  type: 'tel'  },
                { key: 'aadhar',  label: 'Aadhar',  type: 'text' },
                { key: 'address', label: 'Address', type: 'text' },
              ] as { key: keyof UserRecord; label: string; type: string }[]).map(({ key, label, type }) => (
                <div className="usr-form-field" key={key}>
                  <label className="usr-form-label">{label}</label>
                  <input className="usr-form-input" type={type} value={form[key] as string}
                    onChange={e => set(key, e.target.value)} />
                </div>
              ))}
              <div className="usr-form-field">
                <label className="usr-form-label">Status</label>
                <select className="usr-form-input usr-form-select" value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as UserRecord['status'] }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button className="usr-submit-btn" onClick={() => setConfirm(true)}>Submit</button>
            </div>
          ) : (
            <div className="usr-detail-rows">
              {([
                ['Mobile',  user.mobile],
                ['Aadhar',  user.aadhar],
                ['Address', user.address],
              ] as [string, string][]).map(([label, value]) => (
                <div className="usr-detail-row" key={label}>
                  <span className="usr-detail-label">{label}</span>
                  <span className="usr-detail-value">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* lend summary */}
          <div className="usr-lend-section">
            <span className="usr-section-title">Lend Summary</span>
            <div className="usr-lend-stats">
              <div className="usr-lend-stat">
                <span className="usr-lend-stat-val">{total}</span>
                <span className="usr-lend-stat-lbl">Total</span>
              </div>
              <div className="usr-lend-stat green">
                <span className="usr-lend-stat-val">{returned}</span>
                <span className="usr-lend-stat-lbl">Returned</span>
              </div>
              <div className="usr-lend-stat amber">
                <span className="usr-lend-stat-val">{pending}</span>
                <span className="usr-lend-stat-lbl">Pending</span>
              </div>
              <div className="usr-lend-stat red">
                <span className="usr-lend-stat-val">{overdue}</span>
                <span className="usr-lend-stat-lbl">Overdue</span>
              </div>
            </div>
          </div>

          {/* lend activity */}
          {lends.length > 0 && (
            <div className="usr-lend-section">
              <span className="usr-section-title">Lend Activity</span>
              <div className="usr-lend-list">
                {lends.map(l => (
                  <div className="usr-lend-row" key={l.id} onClick={() => navigate(`/app/lend/${l.id}`, { state: { lend: l, userName: user.name } })}>
                    <div className="usr-lend-row-left">
                      <span className="usr-lend-amount">₹{l.amount.toLocaleString('en-IN')}</span>
                      <span className="usr-lend-remarks">{l.remarks}</span>
                    </div>
                    <div className="usr-lend-row-right">
                      <LendBadge status={l.lendStatus} />
                      <span className="usr-lend-date">{l.endDate}</span>
                    </div>
                    <ChevronRight size={14} color="#94a3b8" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {lends.length === 0 && (
            <p className="usr-no-lend">No lend activity found.</p>
          )}
        </div>
      </div>

      {confirm && (
        <div className="usr-confirm-overlay" onClick={e => e.stopPropagation()}>
          <div className="usr-confirm-box">
            <p className="usr-confirm-msg">Are you sure you want to save the changes?</p>
            <div className="usr-confirm-actions">
              <button className="usr-confirm-cancel" onClick={() => setConfirm(false)}>Cancel</button>
              <button className="usr-confirm-ok" onClick={() => { onSave(form); setConfirm(false); setEditing(false) }}>OK, Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Filter Sheet ── */
interface FilterState { status: string; name: string }
const EMPTY: FilterState = { status: '', name: '' }

function FilterSheet({ filters, onApply, onClose }: {
  filters: FilterState
  onApply: (f: FilterState) => void
  onClose: () => void
}) {
  const [local, setLocal] = useState({ ...filters })
  return (
    <div className="usr-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="usr-drawer" style={{ maxHeight: '50svh' }}>
        <div className="usr-drawer-head">
          <span className="usr-drawer-name" style={{ flex: 1 }}>Filters</span>
          <button className="usr-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="usr-edit-form">
          <div className="usr-form-field">
            <label className="usr-form-label">Name</label>
            <input className="usr-form-input" placeholder="Search by name"
              value={local.name} onChange={e => setLocal(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="usr-form-field">
            <label className="usr-form-label">Status</label>
            <select className="usr-form-input usr-form-select" value={local.status}
              onChange={e => setLocal(f => ({ ...f, status: e.target.value }))}>
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="usr-filter-actions">
            <button className="usr-confirm-cancel" onClick={() => setLocal(EMPTY)}>Reset</button>
            <button className="usr-submit-btn" style={{ flex: 1, margin: 0 }}
              onClick={() => { onApply(local); onClose() }}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function UsersPage() {
  const [users, setUsers]       = useState<UserRecord[]>(USERS)
  const [view, setView]         = useState<'card' | 'table'>('card')
  const [selected, setSelected] = useState<UserRecord | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters]   = useState<FilterState>(EMPTY)
  const [statusToggle, setStatusToggle] = useState<UserRecord | null>(null)

  const active = !!(filters.status || filters.name)

  const filtered = useMemo(() => users.filter(u => {
    if (filters.status && u.status !== filters.status) return false
    if (filters.name && !u.name.toLowerCase().includes(filters.name.toLowerCase())) return false
    return true
  }), [users, filters])

  function handleSave(updated: UserRecord) {
    setUsers(u => u.map(x => x.id === updated.id ? updated : x))
    setSelected(updated)
  }

  function confirmToggle() {
    if (!statusToggle) return
    const updated = { ...statusToggle, status: statusToggle.status === 'active' ? 'inactive' : 'active' } as UserRecord
    setUsers(u => u.map(x => x.id === updated.id ? updated : x))
    if (selected?.id === updated.id) setSelected(updated)
    setStatusToggle(null)
  }

  const userLends = (userId: number) => LENDS.filter(l => l.userId === userId)

  return (
    <div className="usr-wrap">
      <div className="usr-topbar">
        <span className="usr-title">Users</span>
        <div className="usr-topbar-right">
          {active && (
            <button className="usr-filter-clear" onClick={() => setFilters(EMPTY)}><XCircle size={18} /></button>
          )}
          <button className={`usr-filter-btn${active ? ' active' : ''}`} onClick={() => setShowFilter(true)}>
            <SlidersHorizontal size={16} />
            {active && <span className="usr-filter-dot" />}
          </button>
          <div className="usr-toggle">
            <button className={view === 'card'  ? 'active' : ''} onClick={() => setView('card')}><LayoutGrid size={16} /></button>
            <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}><Table2 size={16} /></button>
          </div>
        </div>
      </div>

      {active && (
        <div className="usr-chips">
          {filters.name   && <span className="usr-chip">Name: {filters.name}</span>}
          {filters.status && <span className="usr-chip">Status: {filters.status}</span>}
          <span className="usr-chip usr-chip--count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {view === 'card' ? (
        <div className="usr-card-grid">
          {filtered.map(u => {
            const lends = userLends(u.id)
            return (
              <div className="usr-card" key={u.id} onClick={() => setSelected(u)}>
                <div className="usr-card-top">
                  <div className="usr-card-avatar">{avatar(u.name)}</div>
                  <div className="usr-card-info">
                    <span className="usr-card-name">{u.name}</span>
                    <span className="usr-card-mobile">{u.mobile}</span>
                  </div>
                  <div className="usr-card-right">
                    <button
                      className={`usr-status-toggle${u.status === 'active' ? ' on' : ''}`}
                      onClick={e => { e.stopPropagation(); setStatusToggle(u) }}
                    >
                      <span className="usr-status-thumb" />
                    </button>
                    <ChevronRight size={16} color="var(--muted-fg)" />
                  </div>
                </div>
                <div className="usr-card-bottom">
                  <div className="usr-card-field">
                    <span className="usr-card-lbl">Total Lend</span>
                    <span className="usr-card-val">{lends.length}</span>
                  </div>
                  <div className="usr-card-field">
                    <span className="usr-card-lbl">Returned</span>
                    <span className="usr-card-val green">{lends.filter(l => l.lendStatus === 'returned').length}</span>
                  </div>
                  <div className="usr-card-field">
                    <span className="usr-card-lbl">Pending</span>
                    <span className="usr-card-val amber">{lends.filter(l => l.lendStatus === 'pending').length}</span>
                  </div>
                  <div className="usr-card-field">
                    <span className="usr-card-lbl">Overdue</span>
                    <span className="usr-card-val red">{lends.filter(l => l.lendStatus === 'overdue').length}</span>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && <p className="usr-empty">No users found.</p>}
        </div>
      ) : (
        <div className="usr-table-wrap">
          <table className="usr-table">
            <thead>
              <tr>
                <th>Name</th><th>Mobile</th><th>Aadhar</th><th>Address</th>
                <th>Lends</th><th>Status</th><th>View</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td className="td-name">{u.name}</td>
                  <td>{u.mobile}</td>
                  <td>{u.aadhar}</td>
                  <td className="td-addr">{u.address}</td>
                  <td className="td-center">{userLends(u.id).length}</td>
                  <td>
                    <button
                      className={`usr-status-toggle${u.status === 'active' ? ' on' : ''}`}
                      onClick={() => setStatusToggle(u)}
                    >
                      <span className="usr-status-thumb" />
                    </button>
                  </td>
                  <td>
                    <button className="usr-view-btn" onClick={() => setSelected(u)}>
                      <ChevronRight size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="usr-empty">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <UserDrawer
          user={selected}
          lends={userLends(selected.id)}
          onClose={() => setSelected(null)}
          onSave={handleSave}
        />
      )}
      {showFilter && (
        <FilterSheet filters={filters} onApply={setFilters} onClose={() => setShowFilter(false)} />
      )}

      {statusToggle && (
        <div className="usr-confirm-overlay" onClick={() => setStatusToggle(null)}>
          <div className="usr-confirm-box" onClick={e => e.stopPropagation()}>
            <p className="usr-confirm-msg">
              Change <strong>{statusToggle.name}</strong> to{' '}
              <strong>{statusToggle.status === 'active' ? 'Inactive' : 'Active'}</strong>?
            </p>
            <div className="usr-confirm-actions">
              <button className="usr-confirm-cancel" onClick={() => setStatusToggle(null)}>Cancel</button>
              <button className="usr-confirm-ok" onClick={confirmToggle}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
