export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  institutionId: string
  institutionName: string
  role: UserRole
}

export type UserRole = 'admin' | 'manager' | 'member' | 'viewer'

export interface Institution {
  id: string
  name: string
  type: string
  active: boolean
  createdAt: string
}

export interface Workflow {
  id: string
  name: string
  description?: string
  steps: WorkflowStep[]
  status: 'active' | 'inactive' | 'archived'
  createdAt: string
}

export interface WorkflowStep {
  id: string
  name: string
  order: number
  allowedStatuses: string[]
}

export interface Task {
  id: string
  title: string
  description?: string
  workflowId: string
  workflowName: string
  currentStepId: string
  currentStepName: string
  status: TaskStatus
  assigneeId?: string
  assigneeName?: string
  assigneeAvatar?: string
  creatorId: string
  institutionId: string
  dueDate?: string
  labels: Label[]
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed' | 'blocked'

export interface Label {
  id: string
  name: string
  color: string
}

export interface ActivityItem {
  id: string
  type: 'task_created' | 'task_updated' | 'task_assigned' | 'status_changed' | 'comment_added'
  message: string
  taskId?: string
  taskTitle?: string
  userId: string
  userName: string
  timestamp: string
}

export interface Notification {
  id: string
  type: 'mention' | 'assignment' | 'deadline' | 'status_change'
  message: string
  taskId?: string
  taskTitle?: string
  read: boolean
  createdAt: string
}

export interface DashboardStats {
  myTasks: number
  overdueTasks: number
  completedThisWeek: number
  tasksByStatus: Record<TaskStatus, number>
}

export interface TaskHistory {
  id: string
  taskId: string
  action: string
  userId: string
  userName: string
  timestamp: string
  changes?: Record<string, { old: string; new: string }>
}
