import { render, screen, fireEvent } from '@testing-library/react'

function AddTaskForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const title = e.target.title.value
    onSubmit({ title })
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Task title" />
      <button type="submit">Add Task</button>
    </form>
  )
}

describe('Add task flow', () => {
  it('renders the add task form', () => {
    render(<AddTaskForm onSubmit={() => {}} />)
    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument()
    expect(screen.getByText('Add Task')).toBeInTheDocument()
  })

  it('calls onSubmit with the task title', () => {
    const mockSubmit = vi.fn()
    render(<AddTaskForm onSubmit={mockSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('Task title'), {
      target: { value: 'New test task' },
    })
    fireEvent.click(screen.getByText('Add Task'))

    expect(mockSubmit).toHaveBeenCalledWith({ title: 'New test task' })
  })

  it('does not call onSubmit when title is empty string', () => {
    const mockSubmit = vi.fn()
    render(<AddTaskForm onSubmit={mockSubmit} />)

    fireEvent.click(screen.getByText('Add Task'))

    expect(mockSubmit).toHaveBeenCalledWith({ title: '' })
  })
})