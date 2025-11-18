import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { useApp } from '@/lib/AppContext'
import { format } from 'date-fns'
import { Bell, At, ListChecks, Clock, CheckCircle } from '@phosphor-icons/react'
import type { Notification } from '@/types'

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const { openTaskDrawer } = useApp()

  useEffect(() => {
    api.notifications.getAll().then(setNotifications)
  }, [])

  const handleMarkAsRead = async (id: string) => {
    await api.notifications.markAsRead(id)
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id)
    }
    if (notification.taskId) {
      const task = await api.tasks.getById(notification.taskId)
      if (task) {
        openTaskDrawer(task)
      }
    }
  }

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'mentions':
        return notifications.filter(n => n.type === 'mention')
      case 'tasks':
        return notifications.filter(n => n.type === 'assignment')
      case 'deadlines':
        return notifications.filter(n => n.type === 'deadline')
      default:
        return notifications
    }
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'mention': return <At className="text-accent" />
      case 'assignment': return <ListChecks className="text-primary" />
      case 'deadline': return <Clock className="text-destructive" />
      case 'status_change': return <CheckCircle className="text-muted-foreground" />
    }
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={24} />
          <h3 className="text-lg font-semibold">Njoftimet</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => {
            notifications.forEach(n => {
              if (!n.read) handleMarkAsRead(n.id)
            })
          }}
        >
          Shëno të gjitha si të lexuara
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Të Gjitha</TabsTrigger>
          <TabsTrigger value="mentions">Përmendje</TabsTrigger>
          <TabsTrigger value="tasks">Detyrat e Mia</TabsTrigger>
          <TabsTrigger value="deadlines">Afatet</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="flex flex-col gap-3">
            {filteredNotifications.length === 0 && (
              <Card className="p-8 text-center text-muted-foreground">
                Nuk ka njoftime për të shfaqur
              </Card>
            )}
            {filteredNotifications.map(notification => (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                  !notification.read ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notification.message}</p>
                    {notification.taskTitle && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Detyra: {notification.taskTitle}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(notification.createdAt), 'PPp')}
                    </p>
                  </div>
                  {!notification.read && (
                    <Badge variant="default" className="shrink-0 h-6">E Re</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
