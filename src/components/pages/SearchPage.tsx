import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { useApp } from '@/lib/AppContext'
import { MagnifyingGlass } from '@phosphor-icons/react'
import type { Task, Workflow, User, Institution } from '@/types'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{
    tasks: Task[]
    workflows: Workflow[]
    users: User[]
    institutions: Institution[]
  }>({
    tasks: [],
    workflows: [],
    users: [],
    institutions: [],
  })
  const { openTaskDrawer } = useApp()

  useEffect(() => {
    if (query.length > 2) {
      const timeoutId = setTimeout(() => {
        api.search.global(query).then(setResults)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setResults({ tasks: [], workflows: [], users: [], institutions: [] })
    }
  }, [query])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const totalResults = results.tasks.length + results.workflows.length + results.users.length + results.institutions.length

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <MagnifyingGlass size={20} className="text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for tasks, workflows, users, or institutions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 shadow-none"
          />
        </div>
      </Card>

      {query.length > 0 && query.length <= 2 && (
        <Card className="p-8 text-center text-muted-foreground">
          Type at least 3 characters to search
        </Card>
      )}

      {query.length > 2 && totalResults === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          No results found for "{query}"
        </Card>
      )}

      {query.length > 2 && totalResults > 0 && (
        <Tabs defaultValue="tasks">
          <TabsList>
            <TabsTrigger value="tasks">
              Tasks ({results.tasks.length})
            </TabsTrigger>
            <TabsTrigger value="workflows">
              Workflows ({results.workflows.length})
            </TabsTrigger>
            <TabsTrigger value="users">
              Users ({results.users.length})
            </TabsTrigger>
            <TabsTrigger value="institutions">
              Institutions ({results.institutions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-6">
            <div className="flex flex-col gap-3">
              {results.tasks.map(task => (
                <Card
                  key={task.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => openTaskDrawer(task)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {task.workflowName}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.currentStepName}
                        </Badge>
                      </div>
                    </div>
                    {task.assigneeName && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(task.assigneeName)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="mt-6">
            <div className="flex flex-col gap-3">
              {results.workflows.map(workflow => (
                <Card key={workflow.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{workflow.name}</h4>
                      {workflow.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {workflow.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {workflow.steps.length} steps
                        </Badge>
                        <Badge
                          variant={workflow.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {workflow.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="flex flex-col gap-3">
              {results.users.map(user => (
                <Card key={user.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {user.institutionName}
                        </Badge>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="institutions" className="mt-6">
            <div className="flex flex-col gap-3">
              {results.institutions.map(institution => (
                <Card key={institution.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{institution.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{institution.type}</p>
                    </div>
                    <Badge variant={institution.active ? 'default' : 'secondary'}>
                      {institution.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
