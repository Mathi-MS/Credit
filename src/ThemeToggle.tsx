import './ThemeToggle.css'

interface Props {
  dark: boolean
  onToggle: () => void
}

export default function ThemeToggle({ dark, onToggle }: Props) {
  return (
    <button className={`theme-toggle ${dark ? 'dark' : ''}`} onClick={onToggle} aria-label="Toggle theme">
      <span className="toggle-track">
        <span className="toggle-stars">
          <span /><span /><span />
        </span>
        <span className="toggle-thumb">
          {/* Sun rays */}
          <svg className="sun-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" fill="currentColor"/>
            {[0,45,90,135,180,225,270,315].map(deg => (
              <line key={deg}
                x1="12" y1="2" x2="12" y2="5"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                transform={`rotate(${deg} 12 12)`}
              />
            ))}
          </svg>
          {/* Moon */}
          <svg className="moon-icon" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
          </svg>
        </span>
      </span>
    </button>
  )
}
