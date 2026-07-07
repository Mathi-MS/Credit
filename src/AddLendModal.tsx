import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import './AddLendModal.css'

interface Props { onClose: () => void }

type Step = 'mobile' | 'otp' | 'score' | 'form'

const DUMMY_DATA = {
  name: 'Ravi Kumar',
  aadhar: '1234 5678 9012',
  endDate: '2025-12-31',
  amount: '50000',
  phone: '',
  score: 72,
  totalLend: 8,
  returned: 5,
  pending: 2,
  completed: 1,
}

function Speedometer({ score }: { score: number }) {
  const pct = score / 100
  const angle = -135 + pct * 270
  const color = score < 40 ? '#ef4444' : score < 70 ? '#f59e0b' : '#22c55e'
  return (
    <div className="speedo-wrap">
      <svg viewBox="0 0 200 120" className="speedo-svg">
        <path d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="hsl(var(--border))" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M20 110 A80 80 0 0 1 180 110"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${pct * 251.2} 251.2`}
        />
        <line
          x1="100" y1="110"
          x2={100 + 60 * Math.cos(((angle - 90) * Math.PI) / 180)}
          y2={110 + 60 * Math.sin(((angle - 90) * Math.PI) / 180)}
          stroke={color} strokeWidth="3" strokeLinecap="round"
        />
        <circle cx="100" cy="110" r="6" fill={color} />
      </svg>
      <div className="speedo-score" style={{ color }}>{score}</div>
      <div className="speedo-label">Credit Score</div>
    </div>
  )
}

export default function AddLendModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>('mobile')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpErr, setOtpErr] = useState('')
  const [form, setForm] = useState({ name: DUMMY_DATA.name, aadhar: DUMMY_DATA.aadhar, endDate: DUMMY_DATA.endDate, amount: DUMMY_DATA.amount })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [mobileErr, setMobileErr] = useState('')

  function submitMobile() {
    if (!/^[6-9]\d{9}$/.test(mobile)) { setMobileErr('Enter a valid 10-digit mobile number'); return }
    setMobileErr('')
    setStep('otp')
  }

  function submitOtp() {
    if (otp === '1234') { setOtpErr(''); setStep('score') }
    else setOtpErr('Invalid OTP. Use 1234')
  }

  function proceedToForm() { setStep('form') }

  function validate() {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    else if (!/^[a-zA-Z ]{2,}$/.test(form.name.trim())) e.name = 'Enter a valid name'
    if (!/^\d{4} \d{4} \d{4}$/.test(form.aadhar)) e.aadhar = 'Format: 1234 5678 9012'
    if (!form.endDate) e.endDate = 'End date is required'
    else if (new Date(form.endDate) <= new Date()) e.endDate = 'End date must be in the future'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Enter a valid amount'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleAadhar(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 12)
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
    setForm(f => ({ ...f, aadhar: formatted }))
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        {step === 'mobile' && (
          <div className="modal-step">
            <h3 className="modal-title">Enter Mobile Number</h3>
            <input
              className={`modal-input${mobileErr ? ' modal-input--error' : ''}`}
              type="tel"
              maxLength={10}
              placeholder="10-digit mobile"
              value={mobile}
              onChange={e => { setMobile(e.target.value.replace(/\D/g, '')); setMobileErr('') }}
            />
            {mobileErr && <p className="modal-err">{mobileErr}</p>}
            <button className="modal-btn" onClick={submitMobile}>
              Send OTP
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="modal-step">
            <h3 className="modal-title">Enter OTP</h3>
            <p className="modal-sub">Sent to +91 {mobile}</p>
            <input
              className="modal-input"
              type="text"
              maxLength={4}
              placeholder="4-digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            />
            {otpErr && <p className="modal-err">{otpErr}</p>}
            <button className="modal-btn" onClick={submitOtp} disabled={otp.length !== 4}>
              Verify OTP
            </button>
          </div>
        )}

        {step === 'score' && (
          <div className="modal-step">
            <Speedometer score={DUMMY_DATA.score} />
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-val">{DUMMY_DATA.totalLend}</span>
                <span className="stat-lbl">Total Lend</span>
              </div>
              <div className="stat-card">
                <span className="stat-val green">{DUMMY_DATA.returned}</span>
                <span className="stat-lbl">Returned</span>
              </div>
              <div className="stat-card">
                <span className="stat-val amber">{DUMMY_DATA.pending}</span>
                <span className="stat-lbl">Pending</span>
              </div>
              <div className="stat-card">
                <span className="stat-val blue">{DUMMY_DATA.completed}</span>
                <span className="stat-lbl">Completed</span>
              </div>
            </div>
            <div className="score-actions">
              <button className="modal-btn modal-btn--danger" onClick={onClose}>Cancel</button>
              <button className="modal-btn" onClick={proceedToForm}>Lend</button>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="modal-step">
            <div className="form-success-icon"></div>
            <h3 className="modal-title">Lend Details</h3>
            <div className="form-fields">
              <div className="form-field">
                <label className="form-label">Name</label>
                <input
                  className={`modal-input${errors.name ? ' modal-input--error' : ''}`}
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })) }}
                />
                {errors.name && <p className="modal-err">{errors.name}</p>}
              </div>
              <div className="form-field">
                <label className="form-label">Aadhar</label>
                <input
                  className={`modal-input${errors.aadhar ? ' modal-input--error' : ''}`}
                  value={form.aadhar}
                  maxLength={14}
                  placeholder="1234 5678 9012"
                  onChange={e => { handleAadhar(e.target.value); setErrors(er => ({ ...er, aadhar: '' })) }}
                />
                {errors.aadhar && <p className="modal-err">{errors.aadhar}</p>}
              </div>
              <div className="form-field">
                <label className="form-label">End Date</label>
                <input
                  className={`modal-input${errors.endDate ? ' modal-input--error' : ''}`}
                  type="date"
                  value={form.endDate}
                  onChange={e => { setForm(f => ({ ...f, endDate: e.target.value })); setErrors(er => ({ ...er, endDate: '' })) }}
                />
                {errors.endDate && <p className="modal-err">{errors.endDate}</p>}
              </div>
              <div className="form-field">
                <label className="form-label">Amount</label>
                <input
                  className={`modal-input${errors.amount ? ' modal-input--error' : ''}`}
                  type="number"
                  value={form.amount}
                  onChange={e => { setForm(f => ({ ...f, amount: e.target.value })); setErrors(er => ({ ...er, amount: '' })) }}
                />
                {errors.amount && <p className="modal-err">{errors.amount}</p>}
              </div>
              <div className="form-field">
                <label className="form-label">Phone</label>
                <input className="modal-input modal-input--disabled" value={mobile} disabled />
              </div>
            </div>
            <button className="modal-btn" onClick={() => { if (validate()) onClose() }}>Confirm Lend</button>
          </div>
        )}
      </div>
    </div>
  )
}
