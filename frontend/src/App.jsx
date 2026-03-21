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
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif"
    }}>

      <div style={{
        position: 'fixed', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(17,17,24,0.9)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '40px',
        backdropFilter: 'blur(12px)',
        position: 'relative', zIndex: 1
      }}>

        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            gap: '10px', marginBottom: '8px'
          }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #7c3aed, #9d5cf6)',
              borderRadius: '8px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '16px'
            }}>⚡</div>
            <span style={{
              fontSize: '20px', fontWeight: '700',
              fontFamily: "'Syne', sans-serif", color: '#f0f0f5'
            }}>TaskFlow</span>
          </div>
          <p style={{ color: '#8b8b9a', fontSize: '14px' }}>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          display: 'flex', flexDirection: 'column', gap: '16px'
        }}>

          <div>
            <label style={{
              display: 'block', fontSize: '13px',
              color: '#8b8b9a', marginBottom: '8px', fontWeight: '500'
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', color: '#f0f0f5',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.border = '1px solid rgba(124,58,237,0.6)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
            />
          </div>

          <div>
            <label style={{
              display: 'block', fontSize: '13px',
              color: '#8b8b9a', marginBottom: '8px', fontWeight: '500'
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', color: '#f0f0f5',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.border = '1px solid rgba(124,58,237,0.6)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%', padding: '13px',
              background: 'linear-gradient(135deg, #7c3aed, #9d5cf6)',
              border: 'none', borderRadius: '10px',
              color: '#fff', fontSize: '15px', fontWeight: '600',
              cursor: 'pointer', marginTop: '8px',
              boxShadow: '0 0 20px rgba(124,58,237,0.3)'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>

        </form>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontSize: '14px', color: '#8b8b9a'
        }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: '#9d5cf6', cursor: 'pointer', fontWeight: '500' }}
          >
            {isRegister ? 'Sign In' : 'Register'}
          </span>
        </p>

      </div>
    </div>
  )
}