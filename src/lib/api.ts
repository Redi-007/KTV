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

const API_BASE_URL = '/api'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const api = {
  users: {
    getAll: async (): Promise<User[]> => {
      await delay(300)
      return mockUsers
    },
    getById: async (id: string): Promise<User | undefined> => {
      await delay(200)
      return mockUsers.find(u => u.id === id)
    },
    getCurrent: async (): Promise<User> => {
      await delay(200)
      return mockUsers[0]
    },
  },

  institutions: {
    getAll: async (): Promise<Institution[]> => {
      await delay(300)
      return mockInstitutions
    },
    getById: async (id: string): Promise<Institution | undefined> => {
      await delay(200)
      return mockInstitutions.find(i => i.id === id)
    },
  },

  workflows: {
    getAll: async (): Promise<Workflow[]> => {
      await delay(300)
      return mockWorkflows
    },
    getById: async (id: string): Promise<Workflow | undefined> => {
      await delay(200)
      return mockWorkflows.find(w => w.id === id)
    },
  },

  tasks: {
    getAll: async (filters?: {
      status?: TaskStatus
      workflowId?: string
      institutionId?: string
      assigneeId?: string
    }): Promise<Task[]> => {
      await delay(400)
      let filtered = [...mockTasks]
      
      if (filters?.status) {
        filtered = filtered.filter(t => t.status === filters.status)
      }
      if (filters?.workflowId) {
        filtered = filtered.filter(t => t.workflowId === filters.workflowId)
      }
      if (filters?.institutionId) {
        filtered = filtered.filter(t => t.institutionId === filters.institutionId)
      }
      if (filters?.assigneeId) {
        filtered = filtered.filter(t => t.assigneeId === filters.assigneeId)
      }
      
      return filtered
    },
    
    getById: async (id: string): Promise<Task | undefined> => {
      await delay(200)
      return mockTasks.find(t => t.id === id)
    },
    
    update: async (id: string, updates: Partial<Task>): Promise<Task> => {
      await delay(300)
      const task = mockTasks.find(t => t.id === id)
      if (!task) throw new Error('Task not found')
      return { ...task, ...updates, updatedAt: new Date().toISOString() }
    },
    
    updateStatus: async (id: string, status: TaskStatus): Promise<Task> => {
      await delay(300)
      const task = mockTasks.find(t => t.id === id)
      if (!task) throw new Error('Task not found')
      return { ...task, status, updatedAt: new Date().toISOString() }
    },
    
    getHistory: async (taskId: string): Promise<TaskHistory[]> => {
      await delay(200)
      return mockTaskHistory.filter(h => h.taskId === taskId)
    },
  },

  activities: {
    getRecent: async (limit: number = 10): Promise<ActivityItem[]> => {
      await delay(300)
      return mockActivities.slice(0, limit)
    },
  },

  notifications: {
    getAll: async (filters?: {
      type?: Notification['type']
      unreadOnly?: boolean
    }): Promise<Notification[]> => {
      await delay(300)
      let filtered = [...mockNotifications]
      
      if (filters?.type) {
        filtered = filtered.filter(n => n.type === filters.type)
      }
      if (filters?.unreadOnly) {
        filtered = filtered.filter(n => !n.read)
      }
      
      return filtered
    },
    
    markAsRead: async (id: string): Promise<void> => {
      await delay(200)
    },
  },

  dashboard: {
    getStats: async (): Promise<DashboardStats> => {
      await delay(400)
      return mockDashboardStats
    },
  },

  search: {
    global: async (query: string): Promise<{
      tasks: Task[]
      workflows: Workflow[]
      users: User[]
      institutions: Institution[]
    }> => {
      await delay(400)
      const q = query.toLowerCase()
      
      return {
        tasks: mockTasks.filter(t => 
          t.title.toLowerCase().includes(q) || 
          t.description?.toLowerCase().includes(q)
        ),
        workflows: mockWorkflows.filter(w => 
          w.name.toLowerCase().includes(q) || 
          w.description?.toLowerCase().includes(q)
        ),
        users: mockUsers.filter(u => 
          u.name.toLowerCase().includes(q) || 
          u.email.toLowerCase().includes(q)
        ),
        institutions: mockInstitutions.filter(i => 
          i.name.toLowerCase().includes(q) || 
          i.type.toLowerCase().includes(q)
        ),
      }
    },
  },
}
