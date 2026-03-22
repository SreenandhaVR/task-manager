import { create } from 'zustand'
import api from '../api/axios'

const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (filters = {}) => {
    set({ loading: true, error: null })
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.assigned_to) params.append('assigned_to', filters.assigned_to)
      const { data } = await api.get(`/tasks/?${params.toString()}`)
      set({ tasks: data, loading: false })
    } catch (e) {
      set({ error: 'Failed to fetch tasks', loading: false })
    }
  },

  createTask: async (payload) => {
    const { data } = await api.post('/tasks/', payload)
    set((s) => ({ tasks: [...s.tasks, data] }))
    return data
  },

  updateTask: async (id, payload) => {
    const { data } = await api.put(`/tasks/${id}`, payload)
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? data : t)),
    }))
    return data
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`)
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
  },
}))

export default useTaskStore