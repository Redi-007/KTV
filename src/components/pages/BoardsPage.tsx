import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import { mockWorkflows, mockUsers, mockLabels } from '@/lib/mockData'
import { useApp } from '@/lib/AppContext'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { FunnelSimple, CalendarBlank } from '@phosphor-icons/react'
import type { Task, TaskStatus } from '@/types'

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'Për t\'u Bërë' },
  { id: 'in-progress', label: 'Në Proces' },
  { id: 'review', label: 'Rishikim' },
  { id: 'completed', label: 'E Përfunduar' },
  { id: 'blocked', label: 'E Bllokuar' },
]

export function BoardsPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [workflowFilter, setWorkflowFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [labelFilter, setLabelFilter] = useState<string>('all')
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const { openTaskDrawer } = useApp()

  useEffect(() => {
    api.tasks.getAll().then(setTasks)
  }, [])

  const getFilteredTasks = () => {
    let filtered = [...tasks]

    if (workflowFilter !== 'all') {
      filtered = filtered.filter(t => t.workflowId === workflowFilter)
    }
    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(t => t.assigneeId === assigneeFilter)
    }
    if (labelFilter !== 'all') {
      filtered = filtered.filter(t => t.labels.some(l => l.id === labelFilter))
    }

    return filtered
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return getFilteredTasks().filter(t => t.status === status)
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (status: TaskStatus) => {
    if (!draggedTask) return

    if (draggedTask.status === status) {
      setDraggedTask(null)
      return
    }

    try {
      await api.tasks.updateStatus(draggedTask.id, status)
      setTasks(tasks.map(t => 
        t.id === draggedTask.id ? { ...t, status } : t
      ))
      toast.success('Detyra u zhvendos me sukses')
    } catch (error) {
      toast.error('Dështoi zhvendosja e detyrës')
    }

    setDraggedTask(null)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FunnelSimple className="text-muted-foreground" />
            <span className="text-sm font-medium">Filtrat:</span>
          </div>

          <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Rrjedha e Punës" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Të Gjitha Rrjedhat</SelectItem>
              {mockWorkflows.map(wf => (
                <SelectItem key={wf.id} value={wf.id}>{wf.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Përgjegjësi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Të Gjithë Përgjegjësit</SelectItem>
              {mockUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={labelFilter} onValueChange={setLabelFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Etiketa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Të Gjitha Etiketat</SelectItem>
              {mockLabels.map(label => (
                <SelectItem key={label.id} value={label.id}>{label.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(column => {
          const columnTasks = getTasksByStatus(column.id)
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                  {column.label}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>

              <div className="flex flex-col gap-3 bg-muted/30 rounded-lg p-3 min-h-[500px]">
                {columnTasks.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Vendos detyrat këtu
                  </div>
                )}
                {columnTasks.map(task => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onClick={() => openTaskDrawer(task)}
                    className="p-3 cursor-move hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-sm mb-2">{task.title}</h4>

                    {task.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {task.labels.map(label => (
                          <Badge
                            key={label.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {label.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {task.assigneeName ? (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(task.assigneeName)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div />
                      )}

                      {task.dueDate && (
                        <div className={`flex items-center gap-1 text-xs ${isOverdue(task.dueDate) ? 'text-destructive' : 'text-muted-foreground'}`}>
                          <CalendarBlank size={14} />
                          <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
