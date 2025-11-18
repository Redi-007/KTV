import type {
  User,
  Institution,
  Workflow,
  Task,
  ActivityItem,
  Notification,
  DashboardStats,
  TaskHistory,
  TaskStatus,
} from '@/types'
import {
  mockUsers,
  mockInstitutions,
  mockWorkflows,
  mockTasks,
  mockActivities,
  mockNotifications,
  mockDashboardStats,
  mockTaskHistory,
} from '@/lib/mockData'

const API_BASE_URL = import.meta.env.VITE_API_BASE || '/api'

const USE_BACKEND = Boolean(import.meta.env.VITE_API_BASE)

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const url = API_BASE_URL.replace(/\/$/, '') + path
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...opts,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Request failed ${res.status} ${res.statusText} - ${text}`)
  }
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export const api = {
  users: {
    getAll: async (): Promise<User[]> => {
      if (!USE_BACKEND) { await delay(300); return mockUsers }
      return request<User[]>('/users')
    },
    getById: async (id: string): Promise<User | undefined> => {
      if (!USE_BACKEND) { await delay(200); return mockUsers.find(u => u.id === id) }
      return request<User>(`/users/${id}`)
    },
    getCurrent: async (): Promise<User> => {
      if (!USE_BACKEND) { await delay(200); return mockUsers[0] }
      return request<User>('/users/current')
    },
  },

  institutions: {
    getAll: async (): Promise<Institution[]> => {
      if (!USE_BACKEND) { await delay(300); return mockInstitutions }
      return request<Institution[]>('/institutions')
    },
    getById: async (id: string): Promise<Institution | undefined> => {
      if (!USE_BACKEND) { await delay(200); return mockInstitutions.find(i => i.id === id) }
      return request<Institution>(`/institutions/${id}`)
    },
  },

  workflows: {
    getAll: async (): Promise<Workflow[]> => {
      if (!USE_BACKEND) { await delay(300); return mockWorkflows }
      return request<Workflow[]>('/workflows')
    },
    getById: async (id: string): Promise<Workflow | undefined> => {
      if (!USE_BACKEND) { await delay(200); return mockWorkflows.find(w => w.id === id) }
      return request<Workflow>(`/workflows/${id}`)
    },
  },

  tasks: {
    getAll: async (filters?: {
      status?: TaskStatus
      workflowId?: string
      institutionId?: string
      assigneeId?: string
    }): Promise<Task[]> => {
      if (!USE_BACKEND) {
        await delay(400)
        let filtered = [...mockTasks]
        if (filters?.status) filtered = filtered.filter(t => t.status === filters.status)
        if (filters?.workflowId) filtered = filtered.filter(t => t.workflowId === filters.workflowId)
        if (filters?.institutionId) filtered = filtered.filter(t => t.institutionId === filters.institutionId)
        if (filters?.assigneeId) filtered = filtered.filter(t => t.assigneeId === filters.assigneeId)
        return filtered
      }
      const params = new URLSearchParams()
      if (filters?.status) params.set('status', String(filters.status))
      if (filters?.workflowId) params.set('workflowId', filters.workflowId)
      if (filters?.institutionId) params.set('institutionId', filters.institutionId)
      if (filters?.assigneeId) params.set('assigneeId', filters.assigneeId)
      const q = params.toString() ? `?${params.toString()}` : ''
      return request<Task[]>(`/tasks${q}`)
    },

    getById: async (id: string): Promise<Task | undefined> => {
      if (!USE_BACKEND) { await delay(200); return mockTasks.find(t => t.id === id) }
      return request<Task>(`/tasks/${id}`)
    },

    update: async (id: string, updates: Partial<Task>): Promise<Task> => {
      if (!USE_BACKEND) { await delay(300); const task = mockTasks.find(t => t.id === id); if (!task) throw new Error('Task not found'); return { ...task, ...updates, updatedAt: new Date().toISOString() } }
      return request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
    },

    updateStatus: async (id: string, status: TaskStatus): Promise<Task> => {
      if (!USE_BACKEND) { await delay(300); const task = mockTasks.find(t => t.id === id); if (!task) throw new Error('Task not found'); return { ...task, status, updatedAt: new Date().toISOString() } }
      return request<Task>(`/tasks/${id}/move`, { method: 'POST', body: JSON.stringify({ toStepId: status }) })
    },

    getHistory: async (taskId: string): Promise<TaskHistory[]> => {
      if (!USE_BACKEND) { await delay(200); return mockTaskHistory.filter(h => h.taskId === taskId) }
      return request<TaskHistory[]>(`/tasks/${taskId}/history`)
    },
  },

  activities: {
    getRecent: async (limit: number = 10): Promise<ActivityItem[]> => {
      if (!USE_BACKEND) { await delay(300); return mockActivities.slice(0, limit) }
      return request<ActivityItem[]>(`/activities?limit=${limit}`)
    },
  },

  notifications: {
    getAll: async (filters?: {
      type?: Notification['type']
      unreadOnly?: boolean
    }): Promise<Notification[]> => {
      if (!USE_BACKEND) {
        await delay(300)
        let filtered = [...mockNotifications]
        if (filters?.type) filtered = filtered.filter(n => n.type === filters.type)
        if (filters?.unreadOnly) filtered = filtered.filter(n => !n.read)
        return filtered
      }
      const params = new URLSearchParams()
      if (filters?.type) params.set('type', filters.type)
      if (filters?.unreadOnly) params.set('unreadOnly', String(filters.unreadOnly))
      const q = params.toString() ? `?${params.toString()}` : ''
      return request<Notification[]>(`/notifications${q}`)
    },

    markAsRead: async (id: string): Promise<void> => {
      if (!USE_BACKEND) { await delay(200); return }
      await request<void>(`/notifications/${id}/read`, { method: 'POST' })
    },
  },

  dashboard: {
    getStats: async (): Promise<DashboardStats> => {
      if (!USE_BACKEND) { await delay(400); return mockDashboardStats }
      return request<DashboardStats>('/dashboard/stats')
    },
  },

  search: {
    global: async (query: string): Promise<{
      tasks: Task[]
      workflows: Workflow[]
      users: User[]
      institutions: Institution[]
    }> => {
      if (!USE_BACKEND) {
        await delay(400)
        const q = query.toLowerCase()
        return {
          tasks: mockTasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)),
          workflows: mockWorkflows.filter(w => w.name.toLowerCase().includes(q) || w.description?.toLowerCase().includes(q)),
          users: mockUsers.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
          institutions: mockInstitutions.filter(i => i.name.toLowerCase().includes(q) || i.type.toLowerCase().includes(q)),
        }
      }
      return request(`/search?query=${encodeURIComponent(query)}`)
    },
  },
}
