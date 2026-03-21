import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'
const [isRegister, setIsRegister] = useState(false)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)
const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    if (isRegister) {
      await api.post('/auth/register', { email, password })
    }

    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)

    const res = await api.post('/auth/login', form)
    setToken(res.data.access_token)
    navigate('/')

  } catch (err) {
    setError(err.response?.data?.detail || 'Something went wrong')
  } finally {
    setLoading(false)
  }
}

export default function Login() {
{error && (
  <div style={{
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '8px',
    padding: '10px 14px',
    marginBottom: '16px',
    fontSize: '13px',
    color: '#ef4444',
    fontWeight: '500'
  }}>
    {error}
  </div>
)}
const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  background: '#0d0d0d',
  border: '1px solid #1e1e1e',
  borderRadius: '10px',
  color: '#d0d0d0',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'DM Sans', sans-serif"
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#444',
  marginBottom: '7px',
  fontWeight: '500',
  letterSpacing: '0.3px',
  textTransform: 'uppercase'
}
return (
  <div style={{
    minHeight: '100vh',
    background: '#0d0d0d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif"
  }}>

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

      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '10px', marginBottom: '10px'
        }}>
          <div style={{
            width: '30px', height: '30px',
            background: 'linear-gradient(135deg, #6c47c9, #8b5cf6)',
            borderRadius: '8px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '14px'
          }}>⚡</div>
          <span style={{
            fontSize: '18px', fontWeight: '700',
            fontFamily: "'Syne', sans-serif",
            color: '#e8e8e8', letterSpacing: '-0.3px'
          }}>TaskFlow</span>
        </div>
        <p style={{ color: '#555', fontSize: '13px' }}>
          {isRegister ? 'Create a new account' : 'Sign in to your workspace'}
        </p>
      </div>

    </div>
  </div>
)