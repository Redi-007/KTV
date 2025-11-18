import type {
  User,
  Institution,
  Workflow,
  Label,
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
  mockLabels,
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

  labels: {
    getAll: async (): Promise<Label[]> => {
      if (!USE_BACKEND) { await delay(200); return mockLabels }
      return request<Label[]>('/labels')
    },
    getById: async (id: string): Promise<Label | undefined> => {
      if (!USE_BACKEND) { await delay(100); return mockLabels.find(l => l.id === id) }
      return request<Label>(`/labels/${id}`)
    }
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

    delete: async (id: string): Promise<void> => {
      if (!USE_BACKEND) { await delay(200); const idx = mockTasks.findIndex(t => t.id === id); if (idx >= 0) mockTasks.splice(idx, 1); return }
      await request<void>(`/tasks/${id}`, { method: 'DELETE' })
    },

    move: async (id: string, toStepId: string | number, assignToUserId?: string | number): Promise<Task> => {
      if (!USE_BACKEND) { await delay(300); const task = mockTasks.find(t => t.id === id); if (!task) throw new Error('Task not found'); task.currentStepId = String(toStepId); if (assignToUserId) { task.assigneeId = String(assignToUserId) }; return task }
      const body: any = { toStepId: Number(toStepId) }
      if (assignToUserId) body.assignToUserId = Number(assignToUserId)
      const res = await request<Task>(`/tasks/${id}/move`, { method: 'POST', body: JSON.stringify(body) })
      return res
    },

    updateStatus: async (id: string, status: TaskStatus): Promise<Task> => {
      if (!USE_BACKEND) { await delay(300); const task = mockTasks.find(t => t.id === id); if (!task) throw new Error('Task not found'); return { ...task, status, updatedAt: new Date().toISOString() } }
      return request<Task>(`/tasks/${id}/move`, { method: 'POST', body: JSON.stringify({ toStepId: status }) })
    },

    getHistory: async (taskId: string): Promise<TaskHistory[]> => {
      if (!USE_BACKEND) { await delay(200); return mockTaskHistory.filter(h => h.taskId === taskId) }
      return request<TaskHistory[]>(`/tasks/${taskId}/history`)
    },
    create: async (data: {
      title: string
      description?: string
      priority?: number
      dueDate?: string | null
      workflowId: string
      currentStepId?: string | null
      assignedToUserId?: string | null
      assignedToUserIds?: string[]
      labelIds?: string[]
    }): Promise<Task> => {
      if (!USE_BACKEND) {
        await delay(300)
        const nextId = String(Math.max(...mockTasks.map(t => Number(t.id))) + 1)
        const wf = mockWorkflows.find(w => w.id === data.workflowId)
        const assignee = mockUsers.find(u => u.id === data.assignedToUserId)
        const labels = (data.labelIds || []).map(id => ({ id, name: `Label ${id}`, color: 'gray' }))
        const newTask: Task = {
          id: nextId,
          title: data.title,
          description: data.description,
          workflowId: data.workflowId,
          workflowName: wf?.name || 'Unknown',
          currentStepId: data.currentStepId || (wf?.steps?.[0]?.id ?? ''),
          currentStepName: wf?.steps?.find(s => s.id === data.currentStepId)?.name || wf?.steps?.[0]?.name || '',
          status: 'todo',
          assigneeId: data.assignedToUserId || undefined,
          assigneeName: assignee?.name,
          assigneeAvatar: undefined,
          creatorId: mockUsers[0].id,
          institutionId: mockInstitutions[0].id,
          dueDate: data.dueDate || undefined,
          labels,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        mockTasks.unshift(newTask)
        return newTask
      }

      const body: any = {
        title: data.title,
        description: data.description,
        priority: data.priority ?? 0,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        workflowId: Number(data.workflowId),
        currentStepId: data.currentStepId ? Number(data.currentStepId) : null,
        // For backward compatibility include single assignedToUserId (first of array or provided value)
        assignedToUserId: data.assignedToUserId ? Number(data.assignedToUserId) : (data.assignedToUserIds && data.assignedToUserIds.length ? Number(data.assignedToUserIds[0]) : null),
        assignedToUserIds: data.assignedToUserIds ? data.assignedToUserIds.map(id => Number(id)) : undefined,
        labelIds: (data.labelIds || []).map(id => Number(id)),
      }

      const res = await request<any>('/tasks', { method: 'POST', body: JSON.stringify(body) })

      // Map server TaskDto -> frontend Task shape (convert numeric ids to strings)
      const mapLabel = (l: any) => ({ id: String(l.id), name: l.name, color: l.color })
      const mapped: Task = {
        id: String(res.id),
        title: res.title,
        description: res.description,
        workflowId: String(res.workflowId),
        workflowName: res.workflowName ?? '',
        currentStepId: res.currentStepId != null ? String(res.currentStepId) : '',
        currentStepName: res.currentStepName ?? '',
        status: (res.status as Task['status']) || 'todo',
        assigneeId: res.assignedToUserId != null ? String(res.assignedToUserId) : undefined,
        assigneeName: res.assignedToUserName,
        assigneeAvatar: undefined,
        creatorId: res.creatorId != null ? String(res.creatorId) : '0',
        institutionId: res.institutionId != null ? String(res.institutionId) : '0',
        dueDate: res.dueDate ?? undefined,
        labels: (res.labels || []).map(mapLabel),
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      }

      return mapped
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
