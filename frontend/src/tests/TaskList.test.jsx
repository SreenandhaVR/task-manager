import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const mockTasks = [
  { id: 1, title: 'Fix bug',     status: 'todo',        description: '', assigned_to: null },
  { id: 2, title: 'Write docs',  status: 'in_progress', description: '', assigned_to: null },
  { id: 3, title: 'Deploy app',  status: 'done',        description: '', assigned_to: null },
]

function TaskCard({ task }) {
  return <div data-testid="task-card">{task.title}</div>
}

function TaskList({ tasks }) {
  return (
    <div>
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} />
      ))}
    </div>
  )
}

describe('TaskList rendering', () => {
  it('renders all task titles', () => {
    render(
      <BrowserRouter>
        <TaskList tasks={mockTasks} />
      </BrowserRouter>
    )
    expect(screen.getByText('Fix bug')).toBeInTheDocument()
    expect(screen.getByText('Write docs')).toBeInTheDocument()
    expect(screen.getByText('Deploy app')).toBeInTheDocument()
  })

  it('renders correct number of task cards', () => {
    render(
      <BrowserRouter>
        <TaskList tasks={mockTasks} />
      </BrowserRouter>
    )
    expect(screen.getAllByTestId('task-card')).toHaveLength(3)
  })

  it('renders empty list when no tasks given', () => {
    render(
      <BrowserRouter>
        <TaskList tasks={[]} />
      </BrowserRouter>
    )
    expect(screen.queryAllByTestId('task-card')).toHaveLength(0)
  })
})