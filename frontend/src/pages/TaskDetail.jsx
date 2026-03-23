import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Trash2,
  Bot,
  User,
  Plus,
  Loader2,
} from 'lucide-react'
import api from '../api/axios'
import useTaskStore from '../store/taskStore'

const STATUS_OPTIONS = ['todo', 'in_progress', 'done']

const poppins = "'Poppins', sans-serif"

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

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#bfdbfe',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '28px', height: '28px',
          border: '3px solid #bfdbfe',
          borderTopColor: '#1d4ed8',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  /* ── Error ── */
  if (error || !task) {
    return (
      <div style={{
        minHeight: '100vh', background: '#bfdbfe',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column',
        gap: '16px', fontFamily: poppins,
      }}>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>{error || 'Task not found'}</p>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#ffffff', border: '1px solid #e5e7eb',
            color: '#1d4ed8', padding: '8px 18px',
            borderRadius: '10px', cursor: 'pointer',
            fontSize: '13px', fontWeight: '600',
            fontFamily: poppins,
          }}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  /* ── Status badge colours ── */
  const statusMap = {
    todo:        { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    in_progress: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    done:        { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  }

  /* ── Note type colours ── */
  const noteTypeColor = {
    user: { bg: '#eff6ff',  text: '#1d4ed8', border: '#bfdbfe' },
    ai:   { bg: '#f5f3ff',  text: '#6d28d9', border: '#ddd6fe' },
  }

  const sc = statusMap[task.status]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#bfdbfe',
      fontFamily: poppins,
      padding: '36px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Decorative circles — match dashboard */}
      <div style={{
        position: 'fixed', top: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: '#ffffff', opacity: 0.3, pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-60px', left: '-60px',
        width: '250px', height: '250px', borderRadius: '50%',
        background: '#ffffff', opacity: 0.2, pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent', border: 'none',
            color: '#6b7280', cursor: 'pointer',
            fontSize: '13px', fontWeight: '500',
            marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: 0, fontFamily: poppins,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>

        {/* Task card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '16px',
          boxShadow: '0 4px 24px rgba(29,78,216,0.08)',
        }}>

          {/* Title + delete */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: '16px', marginBottom: '16px',
          }}>
            <h1 style={{
              color: '#111827', fontSize: '20px',
              fontWeight: '700', margin: 0, lineHeight: '1.4',
              fontFamily: poppins,
            }}>
              {task.title}
            </h1>
            <button
              onClick={handleDelete}
              style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                color: '#dc2626', cursor: 'pointer',
                fontSize: '12px', fontWeight: '600',
                padding: '7px 14px', borderRadius: '8px',
                flexShrink: 0, fontFamily: poppins,
                display: 'flex', alignItems: 'center', gap: '5px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>

          {/* Description */}
          {task.description && (
            <p style={{
              color: '#6b7280', fontSize: '14px',
              lineHeight: '1.7', marginBottom: '20px',
              fontFamily: poppins,
            }}>
              {task.description}
            </p>
          )}

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>

            {/* Status */}
            <div>
              <p style={{
                color: '#9ca3af', fontSize: '10px', fontWeight: '600',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '6px', fontFamily: poppins,
              }}>Status</p>
              <select
                value={task.status}
                onChange={handleStatusChange}
                style={{
                  background: sc.bg,
                  color: sc.text,
                  border: `1px solid ${sc.border}`,
                  borderRadius: '8px', padding: '6px 12px',
                  fontSize: '12px', fontWeight: '600',
                  cursor: 'pointer', outline: 'none',
                  fontFamily: poppins,
                  appearance: 'none',
                }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} style={{ background: '#fff', color: '#111827' }}>
                    {s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned to */}
            {task.assigned_to && (
              <div>
                <p style={{
                  color: '#9ca3af', fontSize: '10px', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: '6px', fontFamily: poppins,
                }}>Assigned to</p>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  color: '#6b7280', fontSize: '13px', fontFamily: poppins,
                }}>
                  <User size={13} color="#9ca3af" />
                  User #{task.assigned_to}
                </span>
              </div>
            )}

            {/* Created by */}
            <div>
              <p style={{
                color: '#9ca3af', fontSize: '10px', fontWeight: '600',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '6px', fontFamily: poppins,
              }}>Created by</p>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                color: '#6b7280', fontSize: '13px', fontFamily: poppins,
              }}>
                <User size={13} color="#9ca3af" />
                User #{task.created_by}
              </span>
            </div>

          </div>
        </div>

        {/* Notes card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 4px 24px rgba(29,78,216,0.08)',
        }}>

          {/* Notes header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <h2 style={{
              color: '#111827', fontSize: '15px',
              fontWeight: '700', margin: 0, fontFamily: poppins,
            }}>Notes</h2>
            <span style={{
              background: '#f0f9ff', color: '#1d4ed8',
              fontSize: '11px', fontWeight: '600',
              padding: '2px 8px', borderRadius: '20px',
              border: '1px solid #bfdbfe', fontFamily: poppins,
            }}>
              {notes.length}
            </span>
          </div>

          {/* Notes list */}
          {notes.length === 0 ? (
            <p style={{
              color: '#9ca3af', fontSize: '13px',
              textAlign: 'center', padding: '24px 0',
              fontFamily: poppins,
            }}>
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
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      marginBottom: '8px',
                    }}>
                      {note.note_type === 'ai'
                        ? <Bot size={13} color={c.text} />
                        : <User size={13} color={c.text} />
                      }
                      <span style={{
                        fontSize: '10px', fontWeight: '700',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        color: c.text, fontFamily: poppins,
                      }}>
                        {note.note_type === 'ai' ? 'AI' : 'User'}
                      </span>
                    </div>
                    <p style={{
                      color: '#374151', fontSize: '13px',
                      lineHeight: '1.6', margin: 0, fontFamily: poppins,
                    }}>
                      {note.content}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add note section */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>

            {/* Note type toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {['user', 'ai'].map((t) => (
                <button
                  key={t}
                  onClick={() => setNoteType(t)}
                  style={{
                    padding: '5px 14px', borderRadius: '20px',
                    border: noteType === t ? '1px solid #bfdbfe' : '1px solid #e5e7eb',
                    background: noteType === t ? '#eff6ff' : 'transparent',
                    color: noteType === t ? '#1d4ed8' : '#9ca3af',
                    fontSize: '12px', fontWeight: noteType === t ? '600' : '400',
                    cursor: 'pointer', fontFamily: poppins,
                    display: 'flex', alignItems: 'center', gap: '5px',
                    transition: 'all 0.15s',
                  }}
                >
                  {t === 'ai' ? <Bot size={12} /> : <User size={12} />}
                  {t === 'ai' ? 'AI' : 'User'}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write a note..."
              rows={3}
              style={{
                width: '100%', padding: '12px 14px',
                background: '#f0f9ff',
                border: '1px solid #bfdbfe',
                borderRadius: '10px', color: '#111827',
                fontSize: '13px', resize: 'none',
                outline: 'none', boxSizing: 'border-box',
                lineHeight: '1.5', fontFamily: poppins,
                marginBottom: '12px',
                transition: 'border 0.2s, background 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1d4ed8'
                e.target.style.background = '#ffffff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#bfdbfe'
                e.target.style.background = '#f0f9ff'
              }}
            />

            {/* Add note button */}
            <button
              onClick={handleAddNote}
              disabled={addingNote || !noteText.trim()}
              style={{
                background: '#1d4ed8', border: 'none',
                borderRadius: '10px', color: '#ffffff',
                fontSize: '13px', fontWeight: '700',
                letterSpacing: '0.2px', padding: '10px 20px',
                cursor: addingNote || !noteText.trim() ? 'not-allowed' : 'pointer',
                opacity: addingNote || !noteText.trim() ? 0.5 : 1,
                fontFamily: poppins,
                display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: addingNote || !noteText.trim() ? 'none' : '0 4px 14px rgba(29,78,216,0.30)',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!addingNote && noteText.trim()) {
                  e.currentTarget.style.opacity = '0.88'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = addingNote || !noteText.trim() ? '0.5' : '1'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {addingNote
                ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Adding...</>
                : <><Plus size={14} /> Add Note</>
              }
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}