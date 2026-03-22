import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useTaskStore from '../store/taskStore'
import useAuthStore from '../store/authStore'
import CreateTaskModal from '../components/CreateTaskModal'

const COLUMNS = [
  { key: 'todo',        label: 'To Do',      color: '#6366f1' },
  { key: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { key: 'done',        label: 'Done',        color: '#10b981' },
]

function TaskCard({ task, onClick }) {
  const statusColors = {
    todo:        { bg: 'rgba(99,102,241,0.1)',  text: '#818cf8' },
    in_progress: { bg: 'rgba(245,158,11,0.1)',  text: '#fbbf24' },
    done:        { bg: 'rgba(16,185,129,0.1)',  text: '#34d399' },
  }
  const c = statusColors[task.status]

  return (
    <div
      onClick={onClick}
      style={{
        background: '#111111',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        marginBottom: '10px',
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#7c3aed'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e1e1e'}
    >
      <p style={{
        color: '#e8e8e8', fontSize: '14px',
        fontWeight: '500', marginBottom: '8px',
        lineHeight: '1.4'
      }}>
        {task.title}
      </p>
      {task.description && (
        <p style={{
          color: '#555', fontSize: '12px',
          marginBottom: '10px', lineHeight: '1.5',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
        }}>
          {task.description}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '11px', fontWeight: '600',
          padding: '3px 10px', borderRadius: '20px',
          background: c.bg, color: c.text,
          textTransform: 'capitalize',
          letterSpacing: '0.3px'
        }}>
          {task.status.replace('_', ' ')}
        </span>
        {task.assigned_to && (
          <span style={{ color: '#444', fontSize: '11px' }}>
            User #{task.assigned_to}
          </span>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { tasks, fetchTasks, loading } = useTaskStore()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => { fetchTasks() }, [])

  const filtered = activeFilter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === activeFilter)

  const byStatus = (status) => filtered.filter((t) => t.status === status)

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Sidebar */}
      <aside style={{
        width: '220px', background: '#111111',
        borderRight: '1px solid #1a1a1a',
        display: 'flex', flexDirection: 'column',
        padding: '24px 16px', flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #6c47c9, #8b5cf6)',
              borderRadius: '7px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '13px'
            }}>⚡</div>
            <span style={{ color: '#e8e8e8', fontWeight: '700', fontSize: '16px' }}>TaskFlow</span>
          </div>
        </div>

        {/* Nav */}
        <div style={{ marginBottom: '8px' }}>
          <p style={{ color: '#333', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', paddingLeft: '8px' }}>Menu</p>
          <div style={{
            padding: '8px 12px', borderRadius: '8px',
            background: 'rgba(124,58,237,0.15)',
            color: '#a78bfa', fontSize: '13px', fontWeight: '500',
            marginBottom: '2px'
          }}>
            📋 Dashboard
          </div>
        </div>

        {/* Filter */}
        <div style={{ marginTop: '24px' }}>
          <p style={{ color: '#333', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', paddingLeft: '8px' }}>Filter</p>
          {['all', 'todo', 'in_progress', 'done'].map((f) => (
            <div
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '7px 12px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '13px',
                marginBottom: '2px', transition: 'all 0.15s',
                background: activeFilter === f ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: activeFilter === f ? '#a78bfa' : '#555',
              }}
            >
              {f === 'all' ? 'All Tasks' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          ))}
        </div>

        {/* Logout */}
        <div style={{ marginTop: 'auto' }}>
          <div
            onClick={() => { logout(); navigate('/login') }}
            style={{
              padding: '8px 12px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '13px',
              color: '#444', transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#444'}
          >
            🚪 Logout
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ color: '#e8e8e8', fontSize: '22px', fontWeight: '700', margin: 0 }}>Dashboard</h1>
            <p style={{ color: '#444', fontSize: '13px', marginTop: '4px' }}>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'linear-gradient(135deg, #5b3db5, #7c5cbf)',
              border: 'none', borderRadius: '10px',
              color: '#e8e8e8', fontSize: '13px',
              fontWeight: '600', padding: '10px 18px',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '6px'
            }}
          >
            + New Task
          </button>
        </div>

        {/* Kanban */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
            <div style={{
              width: '28px', height: '28px',
              border: '2px solid #7c3aed',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {COLUMNS.map((col) => (
              <div key={col.key}>
                {/* Column header */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: '8px', marginBottom: '14px',
                  paddingBottom: '12px',
                  borderBottom: `2px solid ${col.color}`
                }}>
                  <span style={{ color: '#e8e8e8', fontWeight: '600', fontSize: '14px' }}>
                    {col.label}
                  </span>
                  <span style={{
                    marginLeft: 'auto',
                    background: '#1a1a1a', color: '#555',
                    fontSize: '11px', fontWeight: '600',
                    padding: '2px 8px', borderRadius: '20px'
                  }}>
                    {byStatus(col.key).length}
                  </span>
                </div>

                {/* Cards */}
                {byStatus(col.key).length === 0 ? (
                  <div style={{
                    border: '1px dashed #1e1e1e',
                    borderRadius: '12px', padding: '24px',
                    textAlign: 'center', color: '#333', fontSize: '12px'
                  }}>
                    No tasks
                  </div>
                ) : (
                  byStatus(col.key).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    />
                  ))
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <CreateTaskModal onClose={() => { setShowModal(false); fetchTasks() }} />
      )}
    </div>
  )
}