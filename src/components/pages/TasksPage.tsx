import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/lib/api'
import { mockWorkflows, mockInstitutions, mockUsers } from '@/lib/mockData'
import { useApp } from '@/lib/AppContext'
import { format } from 'date-fns'
import { FunnelSimple } from '@phosphor-icons/react'
import type { Task, TaskStatus } from '@/types'

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [workflowFilter, setWorkflowFilter] = useState<string>('all')
  const [institutionFilter, setInstitutionFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const { openTaskDrawer } = useApp()

  useEffect(() => {
    api.tasks.getAll().then(setTasks)
  }, [])

  useEffect(() => {
    let filtered = [...tasks]

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter)
    }
    if (workflowFilter !== 'all') {
      filtered = filtered.filter(t => t.workflowId === workflowFilter)
    }
    if (institutionFilter !== 'all') {
      filtered = filtered.filter(t => t.institutionId === institutionFilter)
    }
    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(t => t.assigneeId === assigneeFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, statusFilter, workflowFilter, institutionFilter, assigneeFilter])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'review': return 'bg-purple-100 text-purple-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return 'To Do'
      case 'in-progress': return 'In Progress'
      case 'review': return 'Review'
      case 'completed': return 'Completed'
      case 'blocked': return 'Blocked'
    }
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
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Workflow" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workflows</SelectItem>
              {mockWorkflows.map(wf => (
                <SelectItem key={wf.id} value={wf.id}>{wf.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Institution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Institutions</SelectItem>
              {mockInstitutions.map(inst => (
                <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {mockUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(statusFilter !== 'all' || workflowFilter !== 'all' || institutionFilter !== 'all' || assigneeFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter('all')
                setWorkflowFilter('all')
                setInstitutionFilter('all')
                setAssigneeFilter('all')
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Workflow</TableHead>
              <TableHead>Step</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map(task => (
              <TableRow
                key={task.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => openTaskDrawer(task)}
              >
                <TableCell className="font-medium">
                  {task.title}
                  {task.labels.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {task.labels.slice(0, 2).map(label => (
                        <Badge key={label.id} variant="outline" className="text-xs">
                          {label.name}
                        </Badge>
                      ))}
                      {task.labels.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{task.labels.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>{task.workflowName}</TableCell>
                <TableCell>{task.currentStepName}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status)}>
                    {getStatusLabel(task.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.assigneeName ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(task.assigneeName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assigneeName}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <span className={isOverdue(task.dueDate) ? 'text-destructive font-medium' : ''}>
                      {format(new Date(task.dueDate), 'PPP')}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No due date</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredTasks.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No tasks found matching the current filters.
          </div>
        )}
      </Card>
    </div>
  )
}
