import { useState, useRef, useEffect } from 'react'
import { X, FileText, Share2, Download } from 'lucide-react'
import './AddLendModal.css'

interface Props { onClose: () => void }

type Step = 'mobile' | 'otp' | 'score' | 'form' | 'invoice'

const DUMMY_DATA = {
  name: 'Ravi Kumar',
  aadhar: '1234 5678 9012',
  endDate: '2025-12-31',
  amount: '50000',
  score: 72,
  totalLend: 8,
  returned: 5,
  pending: 2,
  completed: 1,
}

const SHOP = { name: 'Asian Paints Villupuram', address: 'Villupuram, 605602' }

function Speedometer({ score }: { score: number }) {
  const pct = score / 100
  const angle = -135 + pct * 270
  const color = score < 40 ? '#ef4444' : score < 70 ? '#f59e0b' : '#22c55e'
  return (
    <div className="speedo-wrap">
      <svg viewBox="0 0 200 120" className="speedo-svg">
        <path d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="hsl(var(--border))" strokeWidth="14" strokeLinecap="round" />
        <path d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${pct * 251.2} 251.2`} />
        <line x1="100" y1="110"
          x2={100 + 60 * Math.cos(((angle - 90) * Math.PI) / 180)}
          y2={110 + 60 * Math.sin(((angle - 90) * Math.PI) / 180)}
          stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="110" r="6" fill={color} />
      </svg>
      <div className="speedo-score" style={{ color }}>{score}</div>
      <div className="speedo-label">Credit Score</div>
    </div>
  )
}

function buildInvoiceHtml(name: string, mobile: string, aadhar: string, amount: string, endDate: string, remarks: string, invoiceNo: string, date: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Lend Invoice</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;padding:32px;max-width:520px;margin:auto;color:#111;font-size:13px}
    .shop-name{font-size:20px;font-weight:800;margin-bottom:2px}
    .shop-addr{font-size:11px;color:#888;margin-bottom:10px}
    .title-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:3px}
    .title{font-size:15px;font-weight:700;letter-spacing:.06em}
    .inv-no{font-size:12px;color:#888}
    .inv-date{font-size:11px;color:#888;margin-bottom:2px}
    hr{border:none;border-top:1px solid #ddd;margin:12px 0}
    .sec{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#aaa;margin-bottom:8px}
    .row{display:flex;justify-content:space-between;margin-bottom:7px}
    .lbl{color:#888}.val{font-weight:600;text-align:right}
    ol{padding-left:16px;line-height:1.8;color:#666;font-size:11px}
  </style></head><body>
  <div class="shop-name">${SHOP.name}</div>
  <div class="shop-addr">${SHOP.address}</div>
  <div class="title-row"><span class="title">LEND AGREEMENT</span><span class="inv-no">#${invoiceNo}</span></div>
  <div class="inv-date">Date: ${date}</div>
  <hr/>
  <div class="sec">Borrower Details</div>
  ${[['Name',name],['Mobile',mobile],['Aadhar',aadhar],['Lend Amount',`₹${Number(amount).toLocaleString('en-IN')}`],['End Date',endDate],['Remarks',remarks||'—']]
    .map(([l,v])=>`<div class="row"><span class="lbl">${l}</span><span class="val">${v}</span></div>`).join('')}
  <hr/>
  <div class="sec">Terms &amp; Conditions</div>
  <ol>
    <li>The borrower agrees to repay the full amount by the end date.</li>
    <li>Late repayment may attract additional charges as per agreement.</li>
    <li>This document serves as a legal lend agreement between both parties.</li>
    <li>Any disputes shall be resolved as per applicable local laws.</li>
  </ol>
  </body></html>`
}

export default function AddLendModal({ onClose }: Props) {
  const [step, setStep]       = useState<Step>('mobile')
  const [mobile, setMobile]   = useState('')
  const [otp, setOtp]         = useState('')
  const [otpErr, setOtpErr]   = useState('')
  const [mobileErr, setMobileErr] = useState('')
  const [form, setForm]       = useState({
    name: DUMMY_DATA.name, aadhar: DUMMY_DATA.aadhar,
    endDate: DUMMY_DATA.endDate, amount: DUMMY_DATA.amount, remarks: '',
  })
  const [errors, setErrors]   = useState<Partial<typeof form>>({})
  const [confirmed, setConfirmed] = useState(false)
  const [confirmErr, setConfirmErr] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const invoiceNo = useRef(`LND${Date.now().toString().slice(-6)}`).current
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  useEffect(() => {
    if (step !== 'invoice') return
    const html = buildInvoiceHtml(form.name, mobile, form.aadhar, form.amount, form.endDate, form.remarks, invoiceNo, today)
    const iframe = iframeRef.current
    if (!iframe) return
    iframe.srcdoc = html
  }, [step])

  function submitMobile() {
    if (!/^[6-9]\d{9}$/.test(mobile)) { setMobileErr('Enter a valid 10-digit mobile number'); return }
    setMobileErr(''); setStep('otp')
  }

  function submitOtp() {
    if (otp === '1234') { setOtpErr(''); setStep('score') }
    else setOtpErr('Invalid OTP. Use 1234')
  }

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

  function handleSubmit() {
    const valid = validate()
    if (!confirmed) { setConfirmErr(true); if (!valid) return; return }
    if (!valid) return
    setStep('invoice')
  }

  function handleShare() {
    const text =
      `*Lend Agreement - #${invoiceNo}*\n` +
      `Shop: ${SHOP.name}, ${SHOP.address}\n` +
      `Date: ${today}\n\n` +
      `*Borrower Details*\n` +
      `Name: ${form.name}\n` +
      `Mobile: ${mobile}\n` +
      `Aadhar: ${form.aadhar}\n` +
      `Amount: ₹${Number(form.amount).toLocaleString('en-IN')}\n` +
      `End Date: ${form.endDate}\n` +
      `Remarks: ${form.remarks || '—'}\n\n` +
      `_Terms: Borrower agrees to repay by end date. Late repayment may attract charges._`
    window.open(`https://wa.me/${mobile}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        {step === 'mobile' && (
          <div className="modal-step">
            <h3 className="modal-title">Enter Mobile Number</h3>
            <input className={`modal-input${mobileErr ? ' modal-input--error' : ''}`}
              type="tel" maxLength={10} placeholder="10-digit mobile"
              value={mobile}
              onChange={e => { setMobile(e.target.value.replace(/\D/g, '')); setMobileErr('') }} />
            {mobileErr && <p className="modal-err">{mobileErr}</p>}
            <button className="modal-btn" onClick={submitMobile}>Send OTP</button>
          </div>
        )}

        {step === 'otp' && (
          <div className="modal-step">
            <h3 className="modal-title">Enter OTP</h3>
            <p className="modal-sub">Sent to +91 {mobile}</p>
            <input className="modal-input" type="text" maxLength={4} placeholder="4-digit OTP"
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
            {otpErr && <p className="modal-err">{otpErr}</p>}
            <button className="modal-btn" onClick={submitOtp} disabled={otp.length !== 4}>Verify OTP</button>
          </div>
        )}

        {step === 'score' && (
          <div className="modal-step">
            <Speedometer score={DUMMY_DATA.score} />
            <div className="stats-grid">
              <div className="stat-card"><span className="stat-val">{DUMMY_DATA.totalLend}</span><span className="stat-lbl">Total Lend</span></div>
              <div className="stat-card"><span className="stat-val green">{DUMMY_DATA.returned}</span><span className="stat-lbl">Returned</span></div>
              <div className="stat-card"><span className="stat-val amber">{DUMMY_DATA.pending}</span><span className="stat-lbl">Pending</span></div>
              <div className="stat-card"><span className="stat-val blue">{DUMMY_DATA.completed}</span><span className="stat-lbl">Completed</span></div>
            </div>
            <div className="score-actions">
              <button className="modal-btn modal-btn--danger" onClick={onClose}>Cancel</button>
              <button className="modal-btn" onClick={() => setStep('form')}>Lend</button>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="modal-step">
            <h3 className="modal-title">Lend Details</h3>
            <div className="form-fields">
              {([
                { key: 'name',    label: 'Name',     type: 'text'   },
                { key: 'aadhar',  label: 'Aadhar',   type: 'text', maxLength: 14, placeholder: '1234 5678 9012',
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => { handleAadhar(e.target.value); setErrors(er => ({ ...er, aadhar: '' })) } },
                { key: 'endDate', label: 'End Date', type: 'date'   },
                { key: 'amount',  label: 'Amount',   type: 'number' },
                { key: 'remarks', label: 'Remarks',  type: 'text', placeholder: 'Optional remarks' },
              ] as any[]).map(({ key, label, type, maxLength, placeholder, onChange }) => (
                <div className="form-field" key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    className={`modal-input${errors[key as keyof typeof errors] ? ' modal-input--error' : ''}`}
                    type={type} maxLength={maxLength} placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={onChange ?? ((e: React.ChangeEvent<HTMLInputElement>) => {
                      setForm(f => ({ ...f, [key]: e.target.value }))
                      setErrors(er => ({ ...er, [key]: '' }))
                    })}
                  />
                  {errors[key as keyof typeof errors] && <p className="modal-err">{errors[key as keyof typeof errors]}</p>}
                </div>
              ))}
              <div className="form-field">
                <label className="form-label">Phone</label>
                <input className="modal-input modal-input--disabled" value={mobile} disabled />
              </div>
            </div>

            {/* confirmation checkbox */}
            <label className={`modal-confirm-check${confirmErr && !confirmed ? ' modal-confirm-check--err' : ''}`}>
              <input type="checkbox" checked={confirmed}
                onChange={e => { setConfirmed(e.target.checked); setConfirmErr(false) }} />
              <span>I confirm that all the details are correct and agree to the lend terms.</span>
            </label>
            {confirmErr && !confirmed && <p className="modal-err">Please confirm before submitting.</p>}

            <button className="modal-btn" onClick={handleSubmit}>Submit &amp; Generate Invoice</button>
          </div>
        )}

        {step === 'invoice' && (
          <div className="modal-step">
            <div className="inv-preview-header">
              <FileText size={20} color="hsl(var(--primary))" />
              <span className="inv-preview-title">Lend Invoice</span>
            </div>

            <iframe ref={iframeRef} className="inv-iframe" title="Invoice" />

            <div className="inv-actions">
              <button className="modal-btn modal-btn--outline" onClick={onClose}>
                <X size={16} /> Close
              </button>
              <button className="modal-btn inv-download-btn" onClick={() => {
                const html = buildInvoiceHtml(form.name, mobile, form.aadhar, form.amount, form.endDate, form.remarks, invoiceNo, today)
                const win = window.open('', '_blank')
                if (!win) return
                win.document.write(html)
                win.document.close()
                win.print()
              }}>
                <Download size={16} /> Download
              </button>
              <button className="modal-btn inv-share-btn" onClick={handleShare}>
                <Share2 size={16} /> WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
