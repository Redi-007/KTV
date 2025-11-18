import { useState, useEffect } from 'react'
import { useApp } from '@/lib/AppContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import type { User, Label, Workflow } from '@/types'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { X, CalendarBlank, ArrowRight, User as UserIcon } from '@phosphor-icons/react'
import type { TaskStatus, TaskHistory } from '@/types'

export function TaskDrawer() {
  const { selectedTask, isTaskDrawerOpen, closeTaskDrawer, isCreateMode, openTaskDrawer } = useApp()
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [assigneeIds, setAssigneeIds] = useState<string[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [createLabelIds, setCreateLabelIds] = useState<string[]>([])
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [moveSearch, setMoveSearch] = useState('')
  const [moveSelectedUser, setMoveSelectedUser] = useState<string | null>(null)
  const [availableSteps, setAvailableSteps] = useState<Array<{ id: string; name: string }>>([])
  const [moveSelectedStep, setMoveSelectedStep] = useState<string | null>(null)
  const [history, setHistory] = useState<TaskHistory[]>([])

  useEffect(() => {
    // Load users/labels/workflows once
    ;(async () => {
      try { const u = await api.users.getAll(); setUsers(u) } catch (e) { /* ignore */ }
      try { const l = await api.labels.getAll(); setLabels(l) } catch (e) { /* ignore */ }
      try { const wf = await api.workflows.getAll(); setWorkflows(wf) } catch (e) { /* ignore */ }
    })()

    if (selectedTask) {
      setStatus(selectedTask.status)
      setAssigneeIds(selectedTask.assigneeId ? [selectedTask.assigneeId] : [])
      setDueDate(selectedTask.dueDate ? new Date(selectedTask.dueDate) : undefined)
      setDescription(selectedTask.description || '')
      setTitle(selectedTask.title || '')
      api.tasks.getHistory(selectedTask!.id).then(setHistory)
      // load workflow steps for move dialog (try backend then fallback to mock)
      ;(async () => {
        try {
          const wf = await api.workflows.getById(String(selectedTask.workflowId))
          if (wf?.steps) setAvailableSteps(wf.steps.map(s => ({ id: String(s.id), name: s.name })))
        } catch {
          const wf = workflows.find(w => w.id === String(selectedTask.workflowId))
          if (wf) setAvailableSteps(wf.steps.map(s => ({ id: String(s.id), name: s.name })))
        }
      })()
      return
    }

    // If create mode, reset fields
    if (isCreateMode) {
      setStatus('todo')
      setAssigneeIds([])
      setDueDate(undefined)
      setDescription('')
      setTitle('')
      setCreateLabelIds([])
      setHistory([])
    }
  }, [selectedTask, isCreateMode])

  if (!selectedTask && !isCreateMode) return null

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await api.tasks.updateStatus(selectedTask!.id, newStatus)
      setStatus(newStatus)
      toast.success('Statusi u përditësua me sukses')
    } catch (error) {
      toast.error('Dështoi përditësimi i statusit')
    }
  }

  const handleAssigneeChange = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!isCreateMode) {
        await api.tasks.update(selectedTask!.id, {
          assigneeId: userId,
          assigneeName: user?.name,
        })
        setAssigneeIds([userId])
        toast.success('Përgjegjësi u përditësua me sukses')
      }
    } catch (error) {
      toast.error('Dështoi përditësimi i përgjegjësit')
    }
  }

  const handleDueDateChange = async (date: Date | undefined) => {
    try {
      await api.tasks.update(selectedTask!.id, { 
        dueDate: date?.toISOString(),
      })
      setDueDate(date)
      toast.success('Data e afatit u përditësua me sukses')
    } catch (error) {
      toast.error('Dështoi përditësimi i datës së afatit')
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
    <Dialog open={isTaskDrawerOpen} onOpenChange={(o) => { if (!o) closeTaskDrawer() }}>
      <DialogContent
        className="p-0 w-full sm:max-w-3xl"
        onPointerDownOutside={(e: any) => e.preventDefault()}
        onEscapeKeyDown={(e: any) => e.preventDefault()}
      >
        <ScrollArea className="h-full">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-start justify-between">
                <DialogTitle className="text-2xl pr-8">{selectedTask?.title ?? (isCreateMode ? 'Krijo Detyrë' : '')}</DialogTitle>
                <div className="shrink-0">
                  <Button variant="ghost" size="icon" onClick={closeTaskDrawer}><X /></Button>
                </div>
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-6">
              {isCreateMode && (
                <div className="p-4 flex flex-col gap-3">
                  <h3 className="text-lg font-semibold">Krijo Detyrë</h3>
                  <div>
                    <label className="text-sm font-medium">Titulli</label>
                    <Input value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} placeholder="Titulli i detyrës" />
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rrjedha e Punës</label>
                <p className="text-sm mt-1">{selectedTask?.workflowName ?? 'Zgjidh më vonë'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Hapi Aktual</label>
                <p className="text-sm mt-1">{selectedTask?.currentStepName ?? '—'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Statusi</label>
                <Select value={status} onValueChange={(v) => { if (!isCreateMode) handleStatusChange(v as TaskStatus); else setStatus(v as TaskStatus) }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Për t'u Bërë</SelectItem>
                    <SelectItem value="in-progress">Në Proces</SelectItem>
                    <SelectItem value="review">Rishikim</SelectItem>
                    <SelectItem value="completed">E Përfunduar</SelectItem>
                    <SelectItem value="blocked">E Bllokuar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Përgjegjësi</label>
                <div>
                  <label className="sr-only">Përgjegjësit</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <UserIcon className="mr-2" />
                        {assigneeIds.length > 0 ? `${assigneeIds.length} zgjedhur` : 'Zgjidh përgjegjësit'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[260px]">
                      <div className="flex flex-col gap-2">
                        {users.map(user => (
                          <label key={user.id} className="flex items-center gap-2">
                            <Checkbox
                              checked={assigneeIds.includes(user.id)}
                              onCheckedChange={(checked) => {
                                const c = Boolean(checked)
                                setAssigneeIds(prev => c ? Array.from(new Set([...prev, user.id])) : prev.filter(id => id !== user.id))
                              }}
                            />
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Show selected names below */}
                  <div className="mt-2 flex flex-wrap gap-2">
                      {assigneeIds.length > 0 ? (
                      assigneeIds.map(id => {
                        const u = users.find(x => x.id === id)
                        return (
                          <Badge key={id} variant="outline" className="flex items-center gap-2">
                            <Avatar className="h-4 w-4"><AvatarFallback className="text-xs">{getInitials(u?.name || '')}</AvatarFallback></Avatar>
                            <span className="text-xs">{u?.name}</span>
                          </Badge>
                        )
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">Nuk ka përgjegjës të zgjedhur</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Data e Afatit</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarBlank className="mr-2" />
                      {dueDate ? format(dueDate, 'PPpp') : 'Zgjidh datën'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(d) => { if (isCreateMode) setDueDate(d); else handleDueDateChange(d) }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Etiketat</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask?.labels?.map(label => (
                        <Badge key={label.id} variant="secondary">{label.name}</Badge>
                      ))}
                      <Button variant="ghost" size="sm">Shto/Modifiko</Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[260px]">
                    <div className="flex flex-col gap-2">
                      {labels.map(lbl => (
                        <label key={lbl.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={isCreateMode ? createLabelIds.includes(lbl.id) : selectedTask?.labels?.some(l => l.id === lbl.id)}
                            onCheckedChange={async (c) => {
                              const checked = Boolean(c)
                              if (isCreateMode) {
                                setCreateLabelIds(prev => checked ? Array.from(new Set([...prev, lbl.id])) : prev.filter(x => x !== lbl.id))
                              } else if (selectedTask) {
                                const present = selectedTask.labels?.some(l => l.id === lbl.id)
                                  const newLabelIds = present
                                  ? selectedTask!.labels.filter(l => l.id !== lbl.id).map(x => String(x.id))
                                  : [...(selectedTask!.labels || []).map(x => String(x.id)), String(lbl.id)]
                                try {
                                  await api.tasks.update(selectedTask!.id, { labelIds: newLabelIds } as any)
                                  toast.success('Etiketat u përditësuan')
                                  const refreshed = await api.tasks.getById(selectedTask!.id)
                                  if (refreshed) openTaskDrawer(refreshed)
                                } catch {
                                  toast.error('Dështoi përditësimi i etiketave')
                                }
                              }
                            }}
                          />
                          <span>{lbl.name}</span>
                        </label>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Përshkrimi</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Shto një përshkrim..."
                  rows={4}
                />
              </div>

              <Separator />

              <div className="flex gap-2">
                {!isCreateMode && (
                  <>
                    <Button className="flex-1" onClick={() => setShowMoveDialog(true)}>
                      <ArrowRight className="mr-2" />
                      Kalo në Hapin Tjetër
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={async () => {
                      // Save changes made in the modal
                      try {
                        const updates: any = {
                          title,
                          description,
                          dueDate: dueDate ? dueDate.toISOString() : null,
                          labelIds: selectedTask?.labels?.map(l => Number(l.id)) || undefined,
                          assignedToUserId: assigneeIds.length ? Number(assigneeIds[0]) : undefined,
                          assignedToUserIds: assigneeIds.length ? assigneeIds.map(id => Number(id)) : undefined,
                        }
                        await api.tasks.update(selectedTask!.id, updates)
                        // refresh and re-open
                        const refreshed = await api.tasks.getById(selectedTask!.id)
                        if (refreshed) openTaskDrawer(refreshed)
                        toast.success('Detyra u ruajt')
                      } catch (err) { console.error(err); toast.error('Dështoi ruajtja') }
                    }}>
                      Ruaj
                    </Button>
                  </>
                )}
                        {isCreateMode && (
                          <div className="flex gap-2 w-full">
                            <Button className="flex-1" onClick={async () => {
                              if (!title) { toast.error('Titulli është i detyrueshëm'); return }
                              try {
                                const created = await api.tasks.create({
                                  title: title,
                                  description: description || undefined,
                                  workflowId: selectedTask?.workflowId || workflows[0]?.id || '1',
                                  assignedToUserIds: assigneeIds.length ? assigneeIds : undefined,
                                  dueDate: dueDate ? dueDate.toISOString() : undefined,
                                  labelIds: createLabelIds.length ? createLabelIds : undefined,
                                })
                                try { window.dispatchEvent(new CustomEvent('task:created', { detail: created })) } catch {}
                                openTaskDrawer(created)
                                toast.success('Detyra u krijua')
                              } catch (err) {
                                console.error(err)
                                toast.error('Dështoi krijimi')
                              }
                            }}>Krijo</Button>
                            {/* No cancel: modal should only be closable via the X */}
                          </div>
                        )}
              </div>

              {/* Delete action for existing tasks */}
              {!isCreateMode && (
                <div className="pt-2">
                  <Button variant="destructive" onClick={async () => {
                    if (!confirm('A jeni i sigurt që dëshironi ta fshini këtë detyrë?')) return
                    try {
                      await api.tasks.delete(selectedTask!.id)
                      window.dispatchEvent(new CustomEvent('task:deleted', { detail: { id: selectedTask!.id } }))
                      closeTaskDrawer()
                      toast.success('Detyra u fshi')
                    } catch (err) { toast.error('Dështoi fshirja') }
                  }}>Fshi Detyrën</Button>
                </div>
              )}

              {/* Move dialog */}
              {showMoveDialog && (
                <Dialog open={showMoveDialog} onOpenChange={(o) => setShowMoveDialog(o)}>
                  <DialogContent className="p-4 max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Kalo Detyrën - Zgjidh Hap dhe Përdorues</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <label className="text-sm font-medium">Hapi i ardhshëm</label>
                      <div className="mt-2 flex flex-col gap-2">
                        {availableSteps.map(s => (
                          <label key={s.id} className="flex items-center gap-2">
                            <input type="radio" name="moveStep" checked={moveSelectedStep === s.id} onChange={() => setMoveSelectedStep(s.id)} />
                            <span>{s.name}</span>
                          </label>
                        ))}
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-medium">Zgjidh Përdorues (kërko)</label>
                        <input className="w-full p-2 border rounded mt-2" placeholder="Kërko emrin" value={moveSearch} onChange={(e) => setMoveSearch(e.target.value)} />
                        <div className="mt-2 max-h-40 overflow-auto border rounded p-2">
                          {users.filter(u => u.name.toLowerCase().includes(moveSearch.toLowerCase())).map(u => (
                            <div key={u.id} className="flex items-center gap-2 py-1">
                              <input type="radio" name="moveUser" checked={moveSelectedUser === u.id} onChange={() => setMoveSelectedUser(u.id)} />
                              <div className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{getInitials(u.name)}</AvatarFallback></Avatar><span>{u.name}</span></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowMoveDialog(false)}>Anullo</Button>
                        <Button onClick={async () => {
                          if (!moveSelectedStep) { toast.error('Zgjidhni hapin e ardhshëm'); return }
                          if (!moveSelectedUser) { toast.error('Zgjidhni përdoruesin'); return }
                          try {
                            await api.tasks.move(selectedTask!.id, moveSelectedStep, moveSelectedUser)
                            const refreshed = await api.tasks.getById(selectedTask!.id)
                            if (refreshed) openTaskDrawer(refreshed)
                            setShowMoveDialog(false)
                            toast.success('Detyra u kalua')
                          } catch (err) { console.error(err); toast.error('Dështoi kalimi') }
                        }}>Konfirmo</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <Separator />

              <div>
                <h3 className="text-sm font-semibold mb-4">Historiku</h3>
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
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
