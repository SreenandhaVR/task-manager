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
  return <div style={{ color: 'white' }}>Login Page</div>
}