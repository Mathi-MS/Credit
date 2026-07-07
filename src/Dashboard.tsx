import { HandCoins, CheckCircle2, Clock3, CalendarX2, CalendarClock, AlertCircle } from 'lucide-react'
import './Dashboard.css'

const today = new Date()
today.setHours(0, 0, 0, 0)

function addDays(n: number) {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function daysFrom(dateStr: string) {
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - today.getTime()) / 86400000)
}

const LENDS = [
  { id: 1,  name: 'Ravi Kumar',   mobile: '9876543210', amount: 50000, endDate: addDays(0),  returned: false },
  { id: 2,  name: 'Priya Devi',   mobile: '9123456780', amount: 20000, endDate: addDays(0),  returned: false },
  { id: 3,  name: 'Suresh Babu',  mobile: '9988776655', amount: 15000, endDate: addDays(0),  returned: false },
  { id: 4,  name: 'Meena S',      mobile: '9001122334', amount: 30000, endDate: addDays(3),  returned: false },
  { id: 5,  name: 'Arjun R',      mobile: '9445566778', amount: 12000, endDate: addDays(5),  returned: false },
  { id: 6,  name: 'Kavitha M',    mobile: '9334455667', amount: 8000,  endDate: addDays(6),  returned: false },
  { id: 7,  name: 'Dinesh P',     mobile: '9556677889', amount: 45000, endDate: addDays(-10), returned: false },
  { id: 8,  name: 'Lakshmi V',    mobile: '9667788990', amount: 22000, endDate: addDays(-20), returned: false },
  { id: 9,  name: 'Vijay T',      mobile: '9778899001', amount: 18000, endDate: addDays(-5),  returned: true  },
  { id: 10, name: 'Anitha K',     mobile: '9889900112', amount: 9000,  endDate: addDays(-30), returned: false },
]

interface Lend { id: number; name: string; mobile: string; amount: number; endDate: string; returned: boolean }

function avatar(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function LendRow({ item }: { item: Lend }) {
  return (
    <div className="lend-row">
      <div className="lend-avatar">{avatar(item.name)}</div>
      <div className="lend-info">
        <span className="lend-name">{item.name}</span>
        <span className="lend-mobile">{item.mobile}</span>
      </div>
      <span className="lend-amount">₹{item.amount.toLocaleString('en-IN')}</span>
    </div>
  )
}

interface SectionProps {
  title: string
  subtitle: string
  items: Lend[]
  accent: string
  icon: React.ReactNode
}

function Section({ title, subtitle, items, accent, icon }: SectionProps) {
  return (
    <div className="db-section-card" style={{ '--sec-accent': accent } as React.CSSProperties}>
      <div className="db-section-head">
        <div className="db-sec-icon">{icon}</div>
        <div className="db-sec-text">
          <span className="db-sec-title">{title}</span>
          <span className="db-sec-sub">{subtitle}</span>
        </div>
        <span className="db-sec-badge">{items.length}</span>
      </div>
      {items.length === 0
        ? <p className="db-empty">No records found</p>
        : <div className="lend-scroll">{items.map(i => <LendRow key={i.id} item={i} />)}</div>
      }
    </div>
  )
}

export default function Dashboard() {
  const total    = LENDS.length
  const received = LENDS.filter(l => l.returned).length
  const pending  = total - received

  const todayEnded   = LENDS.filter(l => !l.returned && daysFrom(l.endDate) === 0)
  const dueThisWeek  = LENDS.filter(l => !l.returned && daysFrom(l.endDate) > 0 && daysFrom(l.endDate) <= 7)
  const notReturned  = LENDS.filter(l => !l.returned && daysFrom(l.endDate) < 0)

  return (
    <div className="db-wrap">

      <div className="db-greeting">
        <span className="db-greeting-title">Overview</span>
        <span className="db-greeting-date">{today.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
      </div>

      <div className="db-stats">
        <div className="db-stat total">
          <div className="db-stat-icon"><HandCoins size={18} /></div>
          <span className="db-stat-val">{total}</span>
          <span className="db-stat-lbl">Total Lend</span>
        </div>
        <div className="db-stat received">
          <div className="db-stat-icon"><CheckCircle2 size={18} /></div>
          <span className="db-stat-val">{received}</span>
          <span className="db-stat-lbl">Received</span>
        </div>
        <div className="db-stat pending">
          <div className="db-stat-icon"><Clock3 size={18} /></div>
          <span className="db-stat-val">{pending}</span>
          <span className="db-stat-lbl">Pending</span>
        </div>
      </div>

      <Section
        title="Today Ended"
        subtitle="Due date is today"
        items={todayEnded}
        accent="#ef4444"
        icon={<CalendarX2 size={16} color="#ef4444" />}
      />
      <Section
        title="Due This Week"
        subtitle="Ending in 1–7 days"
        items={dueThisWeek}
        accent="#f59e0b"
        icon={<CalendarClock size={16} color="#f59e0b" />}
      />
      <Section
        title="Not Returned"
        subtitle="Past due date"
        items={notReturned}
        accent="#6366f1"
        icon={<AlertCircle size={16} color="#6366f1" />}
      />
    </div>
  )
}
