import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, TrendingUp, ShieldCheck, Wallet } from 'lucide-react'
import { authenticate } from './auth'
import type { User } from './types'
import './LoginPage.css'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

interface Props {
  onLogin: (user: User) => void
}

export default function LoginPage({ onLogin }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    setAuthError('')
    const user = authenticate(data.username, data.password)
    if (!user) {
      setAuthError('Invalid username or password')
      return
    }
    onLogin(user)
    navigate('/dashboard')
  }

  return (
    <div className="login-wrapper">

      {/* TOP HERO */}
      <div className="login-hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-logo">
            <Wallet size={28} />
          </div>
          <h1 className="hero-title">Credit</h1>
          <p className="hero-sub">Smart credit. Simple tracking.</p>
          <div className="hero-pills">
            <span><TrendingUp size={13} /> Track Expenses</span>
            <span><ShieldCheck size={13} /> Secure & Private</span>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 390 60" preserveAspectRatio="none">
            <path d="M0,30 C80,60 160,0 240,30 C310,55 360,10 390,30 L390,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      {/* BOTTOM FORM */}
      <div className="login-card">
        <h2 className="card-title">Welcome back 👋</h2>
        <p className="card-sub">Sign in to continue</p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">

          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              {...register('username')}
            />
            {errors.username && <span className="field-error">{errors.username.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register('password')}
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          {authError && <p className="auth-error">{authError}</p>}

          <a href="#" className="forgot">Forgot password?</a>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            Sign In
          </button>
        </form>

        <p className="signup-text">
          Don't have an account? <a href="#">Sign up</a>
        </p>
      </div>

    </div>
  )
}
