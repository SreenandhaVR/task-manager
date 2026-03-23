import { useState } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import useTaskStore from '../store/taskStore'

const poppins = "'Poppins', sans-serif"

export default function CreateTaskModal({ onClose }) {
  const createTask = useTaskStore((s) => s.createTask)
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    assigned_to: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    if (!form.title.trim()) return setError('Title is required')
    setLoading(true)
    try {
      await createTask({
        title: form.title,
        description: form.description,
        status: form.status,
        assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
      })
      onClose()
    } catch (e) {
      setError('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

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
    fontFamily: poppins,
    transition: 'border 0.2s, background 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#6b7280',
    marginBottom: '6px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: poppins,
  }

  const focusIn  = (e) => { e.target.style.borderColor = '#1d4ed8'; e.target.style.background = '#ffffff' }
  const focusOut = (e) => { e.target.style.borderColor = '#bfdbfe'; e.target.style.background = '#f0f9ff' }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(30,58,138,0.18)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 50,
      fontFamily: poppins,
      padding: '16px',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '20px',
        padding: '32px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 8px 32px rgba(29,78,216,0.14)',
        position: 'relative',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '6px',
        }}>
          <h2 style={{
            color: '#111827', fontSize: '18px',
            fontWeight: '700', margin: 0, fontFamily: poppins,
          }}>
            Create new task
          </h2>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6', border: '1px solid #e5e7eb',
              borderRadius: '8px', width: '30px', height: '30px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0, transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
          >
            <X size={15} color="#6b7280" />
          </button>
        </div>

        <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 20px', fontFamily: poppins }}>
          Fill in the details below to add a new task.
        </p>

        {/* Divider */}
        <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '20px' }} />

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '10px', padding: '10px 14px',
            marginBottom: '16px', fontSize: '12px',
            color: '#dc2626', fontWeight: '500', fontFamily: poppins,
          }}>
            {error}
          </div>
        )}

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          <div>
            <label style={labelStyle}>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handle}
              placeholder="Task title"
              style={inputStyle}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              placeholder="Optional description"
              rows={3}
              style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handle}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={focusIn}
              onBlur={focusOut}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Assign to User ID</label>
            <input
              name="assigned_to"
              value={form.assigned_to}
              onChange={handle}
              placeholder="User ID (optional)"
              type="number"
              style={inputStyle}
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>

        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '10px', color: '#6b7280',
              fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', fontFamily: poppins,
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f9fafb'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            style={{
              flex: 1, padding: '12px',
              background: '#1d4ed8',
              border: 'none', borderRadius: '10px',
              color: '#ffffff', fontSize: '13px',
              fontWeight: '700', letterSpacing: '0.2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: poppins,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '6px',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(29,78,216,0.30)',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.opacity = '0.88'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = loading ? '0.7' : '1'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {loading
              ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Creating...</>
              : <><Plus size={14} /> Create Task</>
            }
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </button>
        </div>

      </div>
    </div>
  )
}