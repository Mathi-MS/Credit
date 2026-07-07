import { useRef, useState } from 'react'
import { LogOut, Camera } from 'lucide-react'
import type { User } from './types'
import { images } from './assets/Images/Images'
import './ProfilePage.css'

interface Props {
  user: User
  onLogout: () => void
}

const DUMMY = {
  mobile: '98765 43210',
  aadhaar: '1234 5678 9012',
  gst: '29ABCDE1234F1Z5',
  address: '12, MG Road, Bengaluru, Karnataka – 560001',
}

export default function ProfilePage({ user, onLogout }: Props) {
  const [name, setName] = useState(user.username)
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setAvatar(URL.createObjectURL(file))
  }

  return (
    <div className="prof-page">
      {/* <div className="prof-banner">
        <img src={images.profile} alt="cover" className="prof-banner-img" />
      </div> */}
      <div className="prof-avatar-wrap">
        <div className="prof-avatar-ring" onClick={() => fileRef.current?.click()}>
          <img src={avatar ?? images.profile} alt="profile" className="prof-avatar-img" />
        </div>
        <button className="prof-cam-btn" onClick={() => fileRef.current?.click()} aria-label="Change photo">
          <Camera size={15} />
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImage} />
      </div>

      <div className="prof-fields">
        <label className="prof-label">
          Name
          <input className="prof-input" value={name} onChange={e => setName(e.target.value)} />
        </label>

        <label className="prof-label">
          Mobile
          <input className="prof-input disabled" value={DUMMY.mobile} disabled />
        </label>

        <label className="prof-label">
          Aadhaar
          <input className="prof-input disabled" value={DUMMY.aadhaar} disabled />
        </label>

        <label className="prof-label">
          GST Number
          <input className="prof-input disabled" value={DUMMY.gst} disabled />
        </label>

        <label className="prof-label">
          Address
          <textarea className="prof-input disabled prof-textarea" value={DUMMY.address} disabled />
        </label>
      </div>

      <button className="prof-save-btn">Save Changes</button>

      <button className="prof-logout-btn" onClick={onLogout}>
        <LogOut size={16} /> Logout
      </button>
    </div>
  )
}
