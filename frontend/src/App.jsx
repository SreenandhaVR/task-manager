import { useState } from 'react'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(isRegister ? 'Register' : 'Login', { email, password })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* subtle background */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(100,80,200,0.06) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: '400px',
        padding: '48px 40px',
        background: '#111111',
        border: '1px solid #1e1e1e',
        borderRadius: '20px',
        position: 'relative', zIndex: 1
      }}>

        {/* Logo */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '8px', marginBottom: '6px'
          }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #6c47c9, #8b5cf6)',
              borderRadius: '7px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '13px'
            }}>⚡</div>
            <span style={{
              fontSize: '17px', fontWeight: '700',
              fontFamily: "'Syne', sans-serif",
              color: '#e8e8e8', letterSpacing: '-0.3px'
            }}>TaskFlow</span>
          </div>
          <p style={{
            color: '#555', fontSize: '13px', marginTop: '10px'
          }}>
            {isRegister ? 'Create a new account' : 'Sign in to your workspace'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex', flexDirection: 'column', gap: '14px'
        }}>

          <div>
            <label style={{
              display: 'block', fontSize: '12px',
              color: '#444', marginBottom: '7px',
              fontWeight: '500', letterSpacing: '0.3px',
              textTransform: 'uppercase'
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%', padding: '11px 14px',
                background: '#0d0d0d',
                border: '1px solid #1e1e1e',
                borderRadius: '10px', color: '#d0d0d0',
                fontSize: '14px', outline: 'none',
                boxSizing: 'border-box',
                transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3d2c6e'}
              onBlur={(e) => e.target.style.borderColor = '#1e1e1e'}
            />
          </div>

          <div>
            <label style={{
              display: 'block', fontSize: '12px',
              color: '#444', marginBottom: '7px',
              fontWeight: '500', letterSpacing: '0.3px',
              textTransform: 'uppercase'
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '11px 14px',
                background: '#0d0d0d',
                border: '1px solid #1e1e1e',
                borderRadius: '10px', color: '#d0d0d0',
                fontSize: '14px', outline: 'none',
                boxSizing: 'border-box',
                transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3d2c6e'}
              onBlur={(e) => e.target.style.borderColor = '#1e1e1e'}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%', padding: '12px',
              background: 'linear-gradient(135deg, #5b3db5, #7c5cbf)',
              border: 'none', borderRadius: '10px',
              color: '#e8e8e8', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer',
              marginTop: '6px', letterSpacing: '0.2px',
              transition: 'opacity 0.2s, transform 0.15s'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.88'
              e.target.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>

        </form>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '12px', margin: '24px 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#1a1a1a' }} />
          <span style={{ color: '#333', fontSize: '12px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#1a1a1a' }} />
        </div>

        {/* Toggle */}
        <p style={{
          textAlign: 'center',
          fontSize: '13px', color: '#444'
        }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{
              color: '#8b6cf0', cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {isRegister ? 'Sign In' : 'Register'}
          </span>
        </p>

      </div>
    </div>
  )
}
