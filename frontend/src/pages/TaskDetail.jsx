import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useTaskStore from '../store/taskStore'

const STATUS_OPTIONS = ['todo', 'in_progress', 'done']

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateTask, deleteTask } = useTaskStore()

  const [task, setTask] = useState(null)
  const [notes, setNotes] = useState([])
  const [noteText, setNoteText] = useState('')
  const [noteType, setNoteType] = useState('user')
  const [loading, setLoading] = useState(true)
  const [addingNote, setAddingNote] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { loadTask() }, [id])

  const loadTask = async () => {
    try {
      const [taskRes, notesRes] = await Promise.all([
        api.get(`/tasks/${id}`),
        api.get(`/tasks/${id}/notes/`)
      ])
      setTask(taskRes.data)
      setNotes(notesRes.data)
    } catch {
      setError('Task not found')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (e) => {
    const updated = await updateTask(parseInt(id), { status: e.target.value })
    setTask(updated)
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return
    await deleteTask(parseInt(id))
    navigate('/')
  }

  const handleAddNote = async () => {
    if (!noteText.trim()) return
    setAddingNote(true)
    try {
      const { data } = await api.post(`/tasks/${id}/notes/`, {
        content: noteText,
        note_type: noteType,
      })
      setNotes((n) => [...n, data])
      setNoteText('')
    } catch {
      setError('Failed to add note')
    } finally {
      setAddingNote(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0d0d0d',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          width: '28px', height: '28px',
          border: '2px solid #7c3aed',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0d0d0d',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column',
        gap: '16px', fontFamily: "'DM Sans', sans-serif"
      }}>
        <p style={{ color: '#555' }}>{error || 'Task not found'}</p>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: '1px solid #333',
            color: '#888', padding: '8px 16px',
            borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    )
  }

  const statusColors = {
    todo:        { bg: 'rgba(99,102,241,0.1)',  text: '#818cf8' },
    in_progress: { bg: 'rgba(245,158,11,0.1)',  text: '#fbbf24' },
    done:        { bg: 'rgba(16,185,129,0.1)',  text: '#34d399' },
  }

  const noteTypeColor = {
    user: { bg: 'rgba(124,58,237,0.1)', text: '#a78bfa', border: 'rgba(124,58,237,0.2)' },
    ai:   { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0d0d',
      fontFamily: "'DM Sans', sans-serif", padding: '32px'
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none',
            color: '#555', cursor: 'pointer',
            fontSize: '13px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#e8e8e8'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#555'}
        >
          ← Back to Dashboard
        </button>

        {/* Task card */}
        <div style={{
          background: '#111111',
          border: '1px solid #1e1e1e',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
            <h1 style={{
              color: '#e8e8e8', fontSize: '20px',
              fontWeight: '700', margin: 0, lineHeight: '1.4'
            }}>
              {task.title}
            </h1>
            <button
              onClick={handleDelete}
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444', cursor: 'pointer',
                fontSize: '12px', padding: '6px 12px',
                borderRadius: '8px', flexShrink: 0,
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              Delete
            </button>
          </div>

          {task.description && (
            <p style={{
              color: '#666', fontSize: '14px',
              lineHeight: '1.6', marginBottom: '20px'
            }}>
              {task.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#333', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Status</p>
              <select
                value={task.status}
                onChange={handleStatusChange}
                style={{
                  background: statusColors[task.status].bg,
                  color: statusColors[task.status].text,
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', padding: '6px 12px',
                  fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', outline: 'none',
                  fontFamily: "'DM Sans', sans-serif"
                }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} style={{ background: '#111', color: '#e8e8e8' }}>
                    {s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {task.assigned_to && (
              <div>
                <p style={{ color: '#333', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Assigned to</p>
                <p style={{ color: '#888', fontSize: '13px' }}>User #{task.assigned_to}</p>
              </div>
            )}

            <div>
              <p style={{ color: '#333', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Created by</p>
              <p style={{ color: '#888', fontSize: '13px' }}>User #{task.created_by}</p>
            </div>
          </div>
        </div>

        {/* Notes section */}
        <div style={{
          background: '#111111',
          border: '1px solid #1e1e1e',
          borderRadius: '16px',
          padding: '28px'
        }}>
          <h2 style={{
            color: '#e8e8e8', fontSize: '15px',
            fontWeight: '600', marginBottom: '20px'
          }}>
            Notes
            <span style={{ color: '#333', fontWeight: '400', fontSize: '13px', marginLeft: '8px' }}>
              ({notes.length})
            </span>
          </h2>

          {notes.length === 0 ? (
            <p style={{ color: '#333', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
              No notes yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {notes.map((note) => {
                const c = noteTypeColor[note.note_type] || noteTypeColor.user
                return (
                  <div
                    key={note.id}
                    style={{
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                      borderRadius: '10px',
                      padding: '14px 16px'
                    }}
                  >
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: '700',
                        textTransform: 'uppercase', letterSpacing: '0.6px',
                        color: c.text
                      }}>
                        {note.note_type === 'ai' ? '🤖 AI' : '👤 User'}
                      </span>
                    </div>
                    <p style={{ color: '#ccc', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                      {note.content}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {['user', 'ai'].map((t) => (
                <button
                  key={t}
                  onClick={() => setNoteType(t)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '20px',
                    border: `1px solid ${noteType === t ? 'rgba(124,58,237,0.5)' : '#222'}`,
                    background: noteType === t ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: noteType === t ? '#a78bfa' : '#444',
                    fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                >
                  {t === 'ai' ? '🤖 AI' : '👤 User'}
                </button>
              ))}
            </div>

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write a note..."
              rows={3}
              style={{
                width: '100%', padding: '12px 14px',
                background: '#0d0d0d',
                border: '1px solid #1e1e1e',
                borderRadius: '10px', color: '#e8e8e8',
                fontSize: '13px', resize: 'none',
                outline: 'none', boxSizing: 'border-box',
                lineHeight: '1.5',
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: '12px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = '#1e1e1e'}
            />

            <button
              onClick={handleAddNote}
              disabled={addingNote || !noteText.trim()}
              style={{
                background: 'linear-gradient(135deg, #5b3db5, #7c5cbf)',
                border: 'none', borderRadius: '8px',
                color: '#e8e8e8', fontSize: '13px',
                fontWeight: '600', padding: '10px 20px',
                cursor: addingNote || !noteText.trim() ? 'not-allowed' : 'pointer',
                opacity: addingNote || !noteText.trim() ? 0.5 : 1,
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              {addingNote ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}