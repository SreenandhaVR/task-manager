import { useState } from 'react'
import useTaskStore from '../store/taskStore'

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
    padding: '10px 14px',
    background: '#0d0d0d',
    border: '1px solid #1e1e1e',
    borderRadius: '8px',
    color: '#e8e8e8',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#444',
    marginBottom: '6px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 50,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        background: '#111111',
        border: '1px solid #1e1e1e',
        borderRadius: '16px',
        padding: '28px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ color: '#e8e8e8', fontSize: '16px', fontWeight: '700', margin: 0 }}>
            Create New Task
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              color: '#555', cursor: 'pointer',
              fontSize: '20px', lineHeight: 1,
              padding: '0 4px'
            }}
          >×</button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px', padding: '10px 14px',
            marginBottom: '16px', fontSize: '13px',
            color: '#ef4444'
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
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = '#1e1e1e'}
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
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = '#1e1e1e'}
            />
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handle}
              style={{ ...inputStyle, cursor: 'pointer' }}
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
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = '#1e1e1e'}
            />
          </div>

        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '11px',
              background: '#1a1a1a',
              border: '1px solid #222',
              borderRadius: '8px', color: '#666',
              fontSize: '13px', fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            style={{
              flex: 1, padding: '11px',
              background: 'linear-gradient(135deg, #5b3db5, #7c5cbf)',
              border: 'none', borderRadius: '8px',
              color: '#e8e8e8', fontSize: '13px',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>

      </div>
    </div>
  )
}
