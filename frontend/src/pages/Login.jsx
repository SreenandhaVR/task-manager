import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const setToken = useAuthStore((s) => s.setToken)
  const navigate = useNavigate()

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: '#f0f9ff',
    border: '1px solid #bfdbfe',
    borderRadius: '10px',
    color: '#111827',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Poppins', sans-serif",
    transition: 'border 0.2s, background 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#6b7280',
    marginBottom: '6px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontFamily: "'Poppins', sans-serif",
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        await api.post('/auth/register', { email, password })
        setIsRegister(false)
        setError('')
        setEmail('')
        setPassword('')
        alert('Account created! Please sign in now.')
        return
      }

      const res = await api.post(
        '/auth/login',
        `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      )

      setToken(res.data.access_token)
      navigate('/')

    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(', '))
      } else {
        setError(detail || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#bfdbfe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Poppins', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Decorative circle — top right */}
      <div style={{
        position: 'fixed',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: '#ffffff',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />

      {/* Decorative circle — bottom left */}
      <div style={{
        position: 'fixed',
        bottom: '-60px',
        left: '-60px',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: '#ffffff',
        opacity: 0.2,
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(29,78,216,0.10)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#ffffff',
            flexShrink: 0,
          }}>✦</div>
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: '800',
              color: '#1d4ed8',
              fontFamily: "'Poppins', sans-serif",
              lineHeight: 1.2,
            }}>TaskFlow</div>
            <div style={{
              fontSize: '11px',
              color: '#6b7280',
              fontFamily: "'Poppins', sans-serif",
              marginTop: '2px',
            }}>App Admin Dashboard</div>
          </div>
        </div>

        {/* Welcome heading */}
        <h2 style={{
          margin: '0 0 6px',
          fontSize: '22px',
          fontWeight: '700',
          color: '#111827',
          fontFamily: "'Poppins', sans-serif",
        }}>
          {isRegister ? 'Create account 🚀' : 'Welcome back 👋'}
        </h2>
        <p style={{
          margin: '0 0 20px',
          fontSize: '13px',
          color: '#6b7280',
          fontFamily: "'Poppins', sans-serif",
        }}>
          {isRegister
            ? 'Fill in the details to get started'
            : 'Sign in to your TaskFlow workspace'}
        </p>

        {/* Divider */}
        <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '24px' }} />

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '10px 14px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#dc2626',
            fontWeight: '500',
            fontFamily: "'Poppins', sans-serif",
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#1d4ed8'
                e.target.style.background = '#ffffff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#bfdbfe'
                e.target.style.background = '#f0f9ff'
              }}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#1d4ed8'
                e.target.style.background = '#ffffff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#bfdbfe'
                e.target.style.background = '#f0f9ff'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: '#1d4ed8',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '0.2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(29,78,216,0.35)',
              transition: 'opacity 0.2s, transform 0.2s',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.opacity = '0.88'
                e.target.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.opacity = '1'
                e.target.style.transform = 'translateY(0)'
              }
            }}
          >
            {loading
              ? (isRegister ? 'Creating account...' : 'Signing in...')
              : (isRegister ? 'Create Account' : 'Sign In')}
          </button>

        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '22px 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          <span style={{ color: '#9ca3af', fontSize: '12px', fontFamily: "'Poppins', sans-serif" }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </div>

        {/* Toggle */}
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#6b7280',
          margin: 0,
          fontFamily: "'Poppins', sans-serif",
        }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
              setEmail('')
              setPassword('')
            }}
            style={{
              color: '#1d4ed8',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            {isRegister ? 'Sign In' : 'Register'}
          </span>
        </p>

        {/* Security badge */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '20px',
            padding: '6px 14px',
          }}>
            <span style={{ fontSize: '12px' }}>🔒</span>
            <span style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#1d4ed8',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '0.02em',
            }}>Secured by TaskFlow</span>
          </div>
        </div>

      </div>
    </div>
  )
}