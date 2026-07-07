import { useState, useMemo } from 'react'
import { LayoutGrid, Table2, X, Eye, SlidersHorizontal, XCircle, Pencil } from 'lucide-react'
import './ActivityPage.css'

export interface Lend {
  id: number
  name: string
  mobile: string
  aadhar: string
  amount: number
  endDate: string
  extendedDate: string | null
  remarks: string
  status: 'returned' | 'pending' | 'overdue'
}

const STATUS_COLORS: Record<Lend['status'], string> = {
  returned: '#22c55e',
  pending:  '#f59e0b',
  overdue:  '#ef4444',
}

function makeDate(offset: number) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

const INITIAL: Lend[] = [
  { id:1,  name:'Ravi Kumar',   mobile:'9876543210', aadhar:'2345 6789 0123', amount:50000, endDate:makeDate(-30), extendedDate:makeDate(-10), remarks:'Gold pledge',       status:'returned' },
  { id:2,  name:'Priya Devi',   mobile:'9123456780', aadhar:'3456 7890 1234', amount:20000, endDate:makeDate(0),   extendedDate:null,           remarks:'Urgent need',      status:'pending'  },
  { id:3,  name:'Suresh Babu',  mobile:'9988776655', aadhar:'4567 8901 2345', amount:15000, endDate:makeDate(-5),  extendedDate:null,           remarks:'Medical expense',  status:'overdue'  },
  { id:4,  name:'Meena S',      mobile:'9001122334', aadhar:'5678 9012 3456', amount:30000, endDate:makeDate(3),   extendedDate:makeDate(10),   remarks:'Business loan',    status:'pending'  },
  { id:5,  name:'Arjun R',      mobile:'9445566778', aadhar:'6789 0123 4567', amount:12000, endDate:makeDate(5),   extendedDate:null,           remarks:'Education fee',    status:'pending'  },
  { id:6,  name:'Kavitha M',    mobile:'9334455667', aadhar:'7890 1234 5678', amount:8000,  endDate:makeDate(-15), extendedDate:null,           remarks:'House repair',     status:'overdue'  },
  { id:7,  name:'Dinesh P',     mobile:'9556677889', aadhar:'8901 2345 6789', amount:45000, endDate:makeDate(-60), extendedDate:makeDate(-30),  remarks:'Vehicle purchase', status:'returned' },
  { id:8,  name:'Lakshmi V',    mobile:'9667788990', aadhar:'9012 3456 7890', amount:22000, endDate:makeDate(-20), extendedDate:null,           remarks:'Wedding expense',  status:'overdue'  },
  { id:9,  name:'Vijay T',      mobile:'9778899001', aadhar:'0123 4567 8901', amount:18000, endDate:makeDate(-45), extendedDate:makeDate(-20),  remarks:'Shop renovation',  status:'returned' },
  { id:10, name:'Anitha K',     mobile:'9889900112', aadhar:'1234 5678 9012', amount:9000,  endDate:makeDate(-10), extendedDate:null,           remarks:'Personal use',     status:'overdue'  },
  { id:11, name:'Karthik S',    mobile:'9900112233', aadhar:'2345 6789 0124', amount:35000, endDate:makeDate(7),   extendedDate:null,           remarks:'Land purchase',    status:'pending'  },
  { id:12, name:'Deepa R',      mobile:'9011223344', aadhar:'3456 7890 1235', amount:11000, endDate:makeDate(-3),  extendedDate:makeDate(5),    remarks:'Medical bills',    status:'pending'  },
  { id:13, name:'Murugan A',    mobile:'9122334455', aadhar:'4567 8901 2346', amount:60000, endDate:makeDate(-90), extendedDate:makeDate(-60),  remarks:'Business expand',  status:'returned' },
  { id:14, name:'Selvi B',      mobile:'9233445566', aadhar:'5678 9012 3457', amount:7500,  endDate:makeDate(-8),  extendedDate:null,           remarks:'Grocery stock',    status:'overdue'  },
  { id:15, name:'Bala C',       mobile:'9344556677', aadhar:'6789 0123 4568', amount:25000, endDate:makeDate(2),   extendedDate:null,           remarks:'Rent advance',     status:'pending'  },
  { id:16, name:'Nirmala D',    mobile:'9455667788', aadhar:'7890 1234 5679', amount:14000, endDate:makeDate(-25), extendedDate:makeDate(-15),  remarks:'School fees',      status:'returned' },
  { id:17, name:'Senthil E',    mobile:'9566778899', aadhar:'8901 2345 6780', amount:40000, endDate:makeDate(-12), extendedDate:null,           remarks:'Two-wheeler loan', status:'overdue'  },
  { id:18, name:'Geetha F',     mobile:'9677889900', aadhar:'9012 3456 7891', amount:5000,  endDate:makeDate(6),   extendedDate:null,           remarks:'Daily expenses',   status:'pending'  },
  { id:19, name:'Prakash G',    mobile:'9788990011', aadhar:'0123 4567 8902', amount:32000, endDate:makeDate(-50), extendedDate:makeDate(-35),  remarks:'Farm equipment',   status:'returned' },
  { id:20, name:'Usha H',       mobile:'9899001122', aadhar:'1234 5678 9013', amount:17000, endDate:makeDate(-7),  extendedDate:null,           remarks:'Hospital deposit', status:'overdue'  },
  { id:21, name:'Ramesh I',     mobile:'9900112234', aadhar:'2345 6789 0125', amount:28000, endDate:makeDate(4),   extendedDate:makeDate(12),   remarks:'Shop stock',       status:'pending'  },
  { id:22, name:'Padma J',      mobile:'9011223345', aadhar:'3456 7890 1236', amount:6500,  endDate:makeDate(-40), extendedDate:null,           remarks:'Utility bills',    status:'returned' },
  { id:23, name:'Venkat K',     mobile:'9122334456', aadhar:'4567 8901 2347', amount:55000, endDate:makeDate(-18), extendedDate:makeDate(-5),   remarks:'Property tax',     status:'overdue'  },
  { id:24, name:'Saranya L',    mobile:'9233445567', aadhar:'5678 9012 3458', amount:10000, endDate:makeDate(1),   extendedDate:null,           remarks:'Travel expense',   status:'pending'  },
  { id:25, name:'Manoj M',      mobile:'9344556678', aadhar:'6789 0123 4569', amount:48000, endDate:makeDate(-70), extendedDate:makeDate(-50),  remarks:'Home loan part',   status:'returned' },
]

function StatusBadge({ status }: { status: Lend['status'] }) {
  return (
    <span className="act-badge" style={{ background: STATUS_COLORS[status] + '22', color: STATUS_COLORS[status] }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

/* ─── Edit + Detail Modal ─── */
interface ModalProps { item: Lend; onClose: () => void; onSave: (updated: Lend) => void }

function DetailModal({ item, onClose, onSave }: ModalProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState<Lend>({ ...item })
  const [confirm, setConfirm] = useState(false)

  function set(key: keyof Lend, val: string) {
    setForm(f => ({ ...f, [key]: key === 'amount' ? Number(val) : val === '' ? null : val }))
  }

  function handleSubmit() { setConfirm(true) }
  function handleConfirm() { onSave(form); setConfirm(false); setEditing(false) }

  return (
    <div className="act-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="act-modal">

        {/* header */}
        <div className="act-modal-head">
          <div className="act-modal-avatar">{item.name.split(' ').map(w => w[0]).join('').slice(0,2)}</div>
          <div className="act-modal-head-text">
            <div className="act-modal-name">{item.name}</div>
            <StatusBadge status={form.status} />
          </div>
          <div className="act-modal-head-actions">
            <button className="act-edit-toggle" onClick={() => setEditing(e => !e)}>
              <Pencil size={14} />
              {editing ? 'Cancel Edit' : 'Edit'}
            </button>
            <button className="act-modal-close" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        {/* body */}
        <div className="act-modal-body">
          {editing ? (
            <div className="act-edit-form">
              {([
                { key: 'name',         label: 'Name',          type: 'text'   },
                { key: 'mobile',       label: 'Mobile',        type: 'tel'    },
                { key: 'aadhar',       label: 'Aadhar',        type: 'text'   },
                { key: 'amount',       label: 'Amount (₹)',    type: 'number' },
                { key: 'endDate',      label: 'End Date',      type: 'date'   },
                { key: 'extendedDate', label: 'Extended Date', type: 'date'   },
                { key: 'remarks',      label: 'Remarks',       type: 'text'   },
              ] as { key: keyof Lend; label: string; type: string }[]).map(({ key, label, type }) => (
                <div className="act-form-field" key={key}>
                  <label className="act-form-label">{label}</label>
                  <input
                    className="act-form-input"
                    type={type}
                    value={(form[key] ?? '') as string}
                    onChange={e => set(key, e.target.value)}
                  />
                </div>
              ))}

              <div className="act-form-field">
                <label className="act-form-label">Status</label>
                <select
                  className="act-form-input act-form-select"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as Lend['status'] }))}
                >
                  <option value="pending">Pending</option>
                  <option value="returned">Returned</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <button className="act-submit-btn" onClick={handleSubmit}>Submit</button>
            </div>
          ) : (
            <>
              {([
                ['Mobile',        item.mobile],
                ['Aadhar',        item.aadhar],
                ['Amount',        `₹${item.amount.toLocaleString('en-IN')}`],
                ['End Date',      item.endDate],
                ['Extended Date', item.extendedDate ?? '—'],
                ['Remarks',       item.remarks],
                ['Status',        item.status],
              ] as [string, string][]).map(([label, value]) => (
                <div className="act-detail-row" key={label}>
                  <span className="act-detail-label">{label}</span>
                  {label === 'Status'
                    ? <StatusBadge status={value as Lend['status']} />
                    : <span className="act-detail-value">{value}</span>
                  }
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* confirm dialog */}
      {confirm && (
        <div className="act-confirm-overlay" onClick={e => e.stopPropagation()}>
          <div className="act-confirm-box">
            <p className="act-confirm-msg">Are you sure you want to save the changes?</p>
            <div className="act-confirm-actions">
              <button className="act-confirm-cancel" onClick={() => setConfirm(false)}>Cancel</button>
              <button className="act-confirm-ok" onClick={handleConfirm}>OK, Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Filter Sheet ─── */
interface FilterState { status: string; name: string; fromDate: string; toDate: string }
const EMPTY_FILTER: FilterState = { status: '', name: '', fromDate: '', toDate: '' }

function isFiltered(f: FilterState) {
  return !!(f.status || f.name || f.fromDate || f.toDate)
}

interface FilterSheetProps { filters: FilterState; onApply: (f: FilterState) => void; onClose: () => void }

function FilterSheet({ filters, onApply, onClose }: FilterSheetProps) {
  const [local, setLocal] = useState<FilterState>({ ...filters })
  function set(key: keyof FilterState, val: string) { setLocal(f => ({ ...f, [key]: val })) }

  return (
    <div className="act-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="act-modal">
        <div className="act-modal-head">
          <span className="act-modal-name" style={{ flex: 1 }}>Filters</span>
          <button className="act-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="act-edit-form">
          <div className="act-form-field">
            <label className="act-form-label">Name</label>
            <input className="act-form-input" placeholder="Search by name" value={local.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="act-form-field">
            <label className="act-form-label">Status</label>
            <select className="act-form-input act-form-select" value={local.status} onChange={e => set('status', e.target.value)}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="act-form-field">
            <label className="act-form-label">From Date</label>
            <input className="act-form-input" type="date" value={local.fromDate} onChange={e => set('fromDate', e.target.value)} />
          </div>
          <div className="act-form-field">
            <label className="act-form-label">To Date</label>
            <input className="act-form-input" type="date" value={local.toDate} onChange={e => set('toDate', e.target.value)} />
          </div>
          <div className="act-filter-actions">
            <button className="act-confirm-cancel" onClick={() => { setLocal(EMPTY_FILTER) }}>Reset</button>
            <button className="act-submit-btn" style={{ flex: 1 }} onClick={() => { onApply(local); onClose() }}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function ActivityPage() {
  const [data, setData]         = useState<Lend[]>(INITIAL)
  const [view, setView]         = useState<'table' | 'card'>('card')
  const [selected, setSelected] = useState<Lend | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters]   = useState<FilterState>(EMPTY_FILTER)

  function handleSave(updated: Lend) {
    setData(d => d.map(x => x.id === updated.id ? updated : x))
    setSelected(updated)
  }

  const filtered = useMemo(() => data.filter(item => {
    if (filters.status && item.status !== filters.status) return false
    if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) return false
    if (filters.fromDate && item.endDate < filters.fromDate) return false
    if (filters.toDate   && item.endDate > filters.toDate)   return false
    return true
  }), [data, filters])

  const active = isFiltered(filters)

  return (
    <div className="act-wrap">
      <div className="act-topbar">
        <span className="act-title">Activity</span>
        <div className="act-topbar-right">
          {active && (
            <button className="act-filter-clear" onClick={() => setFilters(EMPTY_FILTER)} title="Clear filters">
              <XCircle size={18} />
            </button>
          )}
          <button className={`act-filter-btn${active ? ' act-filter-btn--active' : ''}`} onClick={() => setShowFilter(true)}>
            <SlidersHorizontal size={16} />
            {active && <span className="act-filter-dot" />}
          </button>
          <div className="act-toggle">
            <button className={view === 'card'  ? 'active' : ''} onClick={() => setView('card')}><LayoutGrid size={16} /></button>
            <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}><Table2 size={16} /></button>
          </div>
        </div>
      </div>

      {active && (
        <div className="act-filter-chips">
          {filters.name   && <span className="act-chip">Name: {filters.name}</span>}
          {filters.status && <span className="act-chip">Status: {filters.status}</span>}
          {filters.fromDate && <span className="act-chip">From: {filters.fromDate}</span>}
          {filters.toDate   && <span className="act-chip">To: {filters.toDate}</span>}
          <span className="act-chip act-chip--count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {view === 'card' ? (
        <div className="act-card-grid">
          {filtered.map(item => (
            <div className="act-card" key={item.id} onClick={() => setSelected(item)}>
              <div className="act-card-top">
                <div className="act-card-avatar">{item.name.split(' ').map(w => w[0]).join('').slice(0,2)}</div>
                <div className="act-card-info">
                  <span className="act-card-name">{item.name}</span>
                  <span className="act-card-mobile">{item.mobile}</span>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div className="act-card-bottom">
                <div className="act-card-field">
                  <span className="act-card-lbl">Amount</span>
                  <span className="act-card-val primary">₹{item.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="act-card-field">
                  <span className="act-card-lbl">End Date</span>
                  <span className="act-card-val">{item.endDate}</span>
                </div>
                <div className="act-card-field">
                  <span className="act-card-lbl">Remarks</span>
                  <span className="act-card-val muted">{item.remarks}</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="act-no-result">No records match the filters.</p>}
        </div>
      ) : (
        <div className="act-table-wrap">
          <table className="act-table">
            <thead>
              <tr>
                <th>Name</th><th>Mobile</th><th>Aadhar</th><th>Amount</th>
                <th>End Date</th><th>Remarks</th><th>Ext. Date</th><th>Status</th><th>View</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td className="td-name">{item.name}</td>
                  <td>{item.mobile}</td>
                  <td>{item.aadhar}</td>
                  <td className="td-amount">₹{item.amount.toLocaleString('en-IN')}</td>
                  <td>{item.endDate}</td>
                  <td className="td-remarks">{item.remarks}</td>
                  <td>{item.extendedDate ?? '—'}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <button className="act-view-btn" onClick={() => setSelected(item)}><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="act-no-result">No records match the filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
      {showFilter && <FilterSheet filters={filters} onApply={setFilters} onClose={() => setShowFilter(false)} />}
    </div>
  )
}
