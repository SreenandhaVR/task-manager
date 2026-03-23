import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'

function AddTaskForm({ onSubmit }) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ title })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
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

  it('calls onSubmit with empty title when nothing typed', () => {
    const mockSubmit = vi.fn()
    render(<AddTaskForm onSubmit={mockSubmit} />)

    fireEvent.click(screen.getByText('Add Task'))

    expect(mockSubmit).toHaveBeenCalledWith({ title: '' })
  })
})