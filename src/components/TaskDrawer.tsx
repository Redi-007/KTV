import { useState, useEffect } from 'react'
import { useApp } from '@/lib/AppContext'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { mockUsers, mockLabels } from '@/lib/mockData'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { X, CalendarBlank, ArrowRight, User } from '@phosphor-icons/react'
import type { TaskStatus, TaskHistory } from '@/types'

export function TaskDrawer() {
  const { selectedTask, isTaskDrawerOpen, closeTaskDrawer } = useApp()
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [description, setDescription] = useState('')
  const [history, setHistory] = useState<TaskHistory[]>([])

  useEffect(() => {
    if (selectedTask) {
      setStatus(selectedTask.status)
      setAssigneeId(selectedTask.assigneeId || '')
      setDueDate(selectedTask.dueDate ? new Date(selectedTask.dueDate) : undefined)
      setDescription(selectedTask.description || '')
      
      api.tasks.getHistory(selectedTask.id).then(setHistory)
    }
  }, [selectedTask])

  if (!selectedTask) return null

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await api.tasks.updateStatus(selectedTask.id, newStatus)
      setStatus(newStatus)
      toast.success('Status updated successfully')
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleAssigneeChange = async (userId: string) => {
    try {
      const user = mockUsers.find(u => u.id === userId)
      await api.tasks.update(selectedTask.id, { 
        assigneeId: userId,
        assigneeName: user?.name,
      })
      setAssigneeId(userId)
      toast.success('Assignee updated successfully')
    } catch (error) {
      toast.error('Failed to update assignee')
    }
  }

  const handleDueDateChange = async (date: Date | undefined) => {
    try {
      await api.tasks.update(selectedTask.id, { 
        dueDate: date?.toISOString(),
      })
      setDueDate(date)
      toast.success('Due date updated successfully')
    } catch (error) {
      toast.error('Failed to update due date')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const getStatusColor = (s: TaskStatus) => {
    switch (s) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-purple-100 text-purple-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Sheet open={isTaskDrawerOpen} onOpenChange={closeTaskDrawer}>
      <SheetContent className="w-[500px] sm:w-[600px] p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <div className="flex items-start justify-between">
                <SheetTitle className="text-2xl pr-8">{selectedTask.title}</SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeTaskDrawer}
                  className="shrink-0"
                >
                  <X />
                </Button>
              </div>
            </SheetHeader>

            <div className="flex flex-col gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Workflow</label>
                <p className="text-sm mt-1">{selectedTask.workflowName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Step</label>
                <p className="text-sm mt-1">{selectedTask.currentStepName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Assignee</label>
                <Select value={assigneeId} onValueChange={handleAssigneeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarBlank className="mr-2" />
                      {dueDate ? format(dueDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={handleDueDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Labels</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.labels.map(label => (
                    <Badge key={label.id} variant="secondary">
                      {label.name}
                    </Badge>
                  ))}
                  {selectedTask.labels.length === 0 && (
                    <p className="text-sm text-muted-foreground">No labels</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={4}
                />
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button className="flex-1">
                  <ArrowRight className="mr-2" />
                  Move to Next Step
                </Button>
                <Button variant="outline" className="flex-1">
                  Change Status
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold mb-4">History</h3>
                <div className="flex flex-col gap-3">
                  {history.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs">
                          {getInitials(item.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{item.userName}</span>{' '}
                          {item.action.toLowerCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(item.timestamp), 'PPp')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
