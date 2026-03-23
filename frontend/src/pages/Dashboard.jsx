import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListTodo,
  Clock,
  CheckCircle2,
  LogOut,
  Plus,
  Filter,
  ChevronLeft,
  Menu,
  Zap,
  User,
} from 'lucide-react'
import useTaskStore from '../store/taskStore'
import useAuthStore from '../store/authStore'
import CreateTaskModal from '../components/CreateTaskModal'

const COLUMNS = [
  { key: 'todo',        label: 'To Do',       color: '#1d4ed8', Icon: ListTodo },
  { key: 'in_progress', label: 'In Progress',  color: '#f59e0b', Icon: Clock },
  { key: 'done',        label: 'Done',         color: '#10b981', Icon: CheckCircle2 },
]

const poppins = "'Poppins', sans-serif"

function TaskCard({ task, onClick }) {
  const statusMap = {
    todo:        { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    in_progress: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    done:        { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  }
  const c = statusMap[task.status]

  return (
    <div
      onClick={onClick}
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        marginBottom: '10px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        fontFamily: poppins,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#1d4ed8'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(29,78,216,0.10)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <p style={{ color: '#111827', fontSize: '13px', fontWeight: '600', margin: '0 0 6px', lineHeight: '1.5', fontFamily: poppins }}>
        {task.title}
      </p>
      {task.description && (
        <p style={{
          color: '#6b7280', fontSize: '12px', margin: '0 0 12px', lineHeight: '1.6',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontFamily: poppins,
        }}>
          {task.description}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '10px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px',
          background: c.bg, color: c.text, border: `1px solid ${c.border}`,
          textTransform: 'capitalize', letterSpacing: '0.04em', fontFamily: poppins,
        }}>
          {task.status.replace('_', ' ')}
        </span>
        {task.assigned_to && (
          <span style={{ color: '#9ca3af', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: poppins }}>
            <User size={11} /> #{task.assigned_to}
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => { fetchTasks() }, [])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
      else setSidebarOpen(true)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filtered = activeFilter === 'all' ? tasks : tasks.filter((t) => t.status === activeFilter)
  const byStatus = (status) => filtered.filter((t) => t.status === status)

  const filterItems = [
    { key: 'all',         label: 'All Tasks',   dot: '#9ca3af', Icon: Filter },
    { key: 'todo',        label: 'To Do',       dot: '#1d4ed8', Icon: ListTodo },
    { key: 'in_progress', label: 'In Progress', dot: '#f59e0b', Icon: Clock },
    { key: 'done',        label: 'Done',        dot: '#10b981', Icon: CheckCircle2 },
  ]

  const SIDEBAR_W = 240

  return (
    <div style={{ minHeight: '100vh', background: '#bfdbfe', display: 'flex', fontFamily: poppins, position: 'relative', overflow: 'hidden' }}>

      {/* Decorative circles */}
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: '#ffffff', opacity: 0.3, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: '#ffffff', opacity: 0.2, pointerEvents: 'none', zIndex: 0 }} />

      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.25)',
            zIndex: 10,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: `${SIDEBAR_W}px`,
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        padding: sidebarOpen ? '28px 16px' : '28px 10px',
        flexShrink: 0,
        position: isMobile ? 'fixed' : 'relative',
        top: isMobile ? 0 : undefined,
        left: isMobile ? (sidebarOpen ? 0 : `-${SIDEBAR_W}px`) : undefined,
        height: isMobile ? '100vh' : undefined,
        zIndex: isMobile ? 20 : 1,
        boxShadow: '2px 0 16px rgba(29,78,216,0.08)',
        transition: 'left 0.28s cubic-bezier(.4,0,.2,1), width 0.28s, padding 0.28s',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>

        {/* Logo + collapse button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                borderRadius: '9px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}>
                <Zap size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#1d4ed8', fontFamily: poppins, lineHeight: 1.2 }}>TaskFlow</div>
                <div style={{ fontSize: '10px', color: '#9ca3af', fontFamily: poppins, marginTop: '1px', fontWeight: '500' }}>Task Management Hub</div>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              borderRadius: '9px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto',
            }}>
              <Zap size={16} color="#fff" />
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              title="Close sidebar"
              style={{
                background: '#f3f4f6', border: '1px solid #e5e7eb',
                borderRadius: '8px', width: '28px', height: '28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
                padding: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
            >
              <ChevronLeft size={15} color="#6b7280" />
            </button>
          )}
        </div>

        {/* Nav */}
        {sidebarOpen && (
          <p style={{ color: '#9ca3af', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', paddingLeft: '10px', fontFamily: poppins }}>
            Menu
          </p>
        )}
        <div
          style={{
            padding: sidebarOpen ? '9px 12px' : '9px',
            borderRadius: '10px', background: '#eff6ff',
            color: '#1d4ed8', fontSize: '13px', fontWeight: '600',
            marginBottom: sidebarOpen ? '2px' : '6px',
            display: 'flex', alignItems: 'center',
            gap: sidebarOpen ? '8px' : '0',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            fontFamily: poppins, border: '1px solid #bfdbfe',
            title: !sidebarOpen ? 'Dashboard' : undefined,
          }}
          title={!sidebarOpen ? 'Dashboard' : ''}
        >
          <LayoutDashboard size={16} />
          {sidebarOpen && 'Dashboard'}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#e5e7eb', margin: '14px 0' }} />

        {/* Filter */}
        {sidebarOpen && (
          <p style={{ color: '#9ca3af', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', paddingLeft: '10px', fontFamily: poppins }}>
            Filter
          </p>
        )}
        {filterItems.map((f) => (
          <div
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            title={!sidebarOpen ? f.label : ''}
            style={{
              padding: sidebarOpen ? '8px 12px' : '8px',
              borderRadius: '10px', cursor: 'pointer', fontSize: '13px',
              fontWeight: activeFilter === f.key ? '600' : '400',
              marginBottom: '2px', transition: 'all 0.15s',
              background: activeFilter === f.key ? '#eff6ff' : 'transparent',
              color: activeFilter === f.key ? '#1d4ed8' : '#6b7280',
              border: activeFilter === f.key ? '1px solid #bfdbfe' : '1px solid transparent',
              fontFamily: poppins, display: 'flex', alignItems: 'center',
              gap: sidebarOpen ? '8px' : '0',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
            }}
          >
            <f.Icon size={15} />
            {sidebarOpen && f.label}
          </div>
        ))}

        {/* Logout */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ height: '1px', background: '#e5e7eb', margin: '16px 0' }} />
          <div
            onClick={() => { logout(); navigate('/login') }}
            title={!sidebarOpen ? 'Logout' : ''}
            style={{
              padding: sidebarOpen ? '9px 12px' : '9px',
              borderRadius: '10px', cursor: 'pointer',
              fontSize: '13px', fontWeight: '500',
              color: '#6b7280', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center',
              gap: sidebarOpen ? '8px' : '0',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              fontFamily: poppins, border: '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#dc2626'
              e.currentTarget.style.background = '#fef2f2'
              e.currentTarget.style.borderColor = '#fecaca'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280'
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <LogOut size={15} />
            {sidebarOpen && 'Logout'}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{
        flex: 1,
        padding: '28px 24px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1,
        marginLeft: isMobile ? 0 : undefined,
        minWidth: 0,
      }}>

        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '28px', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            {/* Toggle button — shown when sidebar is closed */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: '#ffffff', border: '1px solid #e5e7eb',
                  borderRadius: '10px', width: '38px', height: '38px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
                  boxShadow: '0 2px 8px rgba(29,78,216,0.08)', padding: 0,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
              >
                <Menu size={17} color="#1d4ed8" />
              </button>
            )}
            <div>
              <h1 style={{ color: '#111827', fontSize: '20px', fontWeight: '700', margin: '0 0 2px', fontFamily: poppins }}>
                Dashboard
              </h1>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, fontFamily: poppins }}>
                {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#1d4ed8', border: 'none', borderRadius: '10px',
              color: '#ffffff', fontSize: '13px', fontWeight: '700',
              letterSpacing: '0.2px', padding: '10px 18px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 4px 14px rgba(29,78,216,0.35)',
              transition: 'opacity 0.2s, transform 0.2s', fontFamily: poppins,
              flexShrink: 0, whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <Plus size={15} />
            New Task
          </button>
        </div>

        {/* Kanban */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #bfdbfe', borderTopColor: '#1d4ed8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}>
            {COLUMNS.map((col) => (
              <div key={col.key}>
                {/* Column header */}
                <div style={{
                  background: '#ffffff', border: '1px solid #e5e7eb',
                  borderRadius: '12px 12px 0 0', padding: '11px 14px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  borderBottom: `2px solid ${col.color}`,
                }}>
                  <col.Icon size={14} color={col.color} />
                  <span style={{ color: '#111827', fontWeight: '600', fontSize: '13px', fontFamily: poppins, flex: 1 }}>
                    {col.label}
                  </span>
                  <span style={{
                    background: '#f0f9ff', color: '#1d4ed8', fontSize: '11px',
                    fontWeight: '600', padding: '2px 8px', borderRadius: '20px',
                    border: '1px solid #bfdbfe', fontFamily: poppins,
                  }}>
                    {byStatus(col.key).length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{
                  background: '#f8faff', border: '1px solid #e5e7eb',
                  borderTop: 'none', borderRadius: '0 0 12px 12px',
                  padding: '12px', minHeight: '120px',
                }}>
                  {byStatus(col.key).length === 0 ? (
                    <div style={{
                      border: '1px dashed #bfdbfe', borderRadius: '10px',
                      padding: '24px', textAlign: 'center',
                      color: '#9ca3af', fontSize: '12px', fontFamily: poppins,
                    }}>
                      No tasks
                    </div>
                  ) : (
                    byStatus(col.key).map((task) => (
                      <TaskCard key={task.id} task={task} onClick={() => navigate(`/tasks/${task.id}`)} />
                    ))
                  )}
                </div>
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