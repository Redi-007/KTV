import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import type { DashboardStats, ActivityItem } from '@/types'
import { ListChecks, Warning, CheckCircle } from '@phosphor-icons/react'

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    api.dashboard.getStats().then(setStats)
    api.activities.getRecent(10).then(setActivities)
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Detyrat e Mia
            </CardTitle>
            <ListChecks className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats?.myTasks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Detyrime aktive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Detyra të Vonuara
            </CardTitle>
            <Warning className="text-destructive" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-destructive">
              {stats?.overdueTasks || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Kërkojnë vëmendje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Përfunduar Këtë Javë
            </CardTitle>
            <CheckCircle className="text-accent" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-accent">
              {stats?.completedThisWeek || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Detyra të përfunduara</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detyrat sipas Statusit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {stats?.tasksByStatus && Object.entries(stats.tasksByStatus).map(([status, count]) => {
                const total = Object.values(stats.tasksByStatus).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? (count / total) * 100 : 0
                
                const statusColors: Record<string, string> = {
                  'todo': 'bg-gray-500',
                  'in-progress': 'bg-blue-500',
                  'review': 'bg-purple-500',
                  'completed': 'bg-green-500',
                  'blocked': 'bg-red-500',
                }
                
                const statusLabels: Record<string, string> = {
                  'todo': 'Për t\'u Bërë',
                  'in-progress': 'Në Proces',
                  'review': 'Rishikim',
                  'completed': 'E Përfunduar',
                  'blocked': 'E Bllokuar',
                }
                
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{statusLabels[status]}</span>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${statusColors[status]} transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktiviteti i Fundit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-muted">
                      {getInitials(activity.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.userName}</span>{' '}
                      {activity.message}
                      {activity.taskTitle && (
                        <>
                          {' për '}
                          <span className="font-medium text-primary">{activity.taskTitle}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.timestamp), 'PPp')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
