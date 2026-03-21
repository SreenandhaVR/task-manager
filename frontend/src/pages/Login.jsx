import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)
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
  return <div style={{ color: 'white' }}>Login Page</div>
}