import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User, Task } from '@/types'
import { api } from '@/lib/api'

interface AppContextType {
  currentUser: User | null
  selectedTask: Task | null
  setSelectedTask: (task: Task | null) => void
  isTaskDrawerOpen: boolean
  openTaskDrawer: (task: Task) => void
  closeTaskDrawer: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false)

  useEffect(() => {
    api.users.getCurrent().then(setCurrentUser)
  }, [])

  const openTaskDrawer = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDrawerOpen(true)
  }

  const closeTaskDrawer = () => {
    setIsTaskDrawerOpen(false)
    setTimeout(() => setSelectedTask(null), 300)
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        selectedTask,
        setSelectedTask,
        isTaskDrawerOpen,
        openTaskDrawer,
        closeTaskDrawer,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
