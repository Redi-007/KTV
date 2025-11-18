import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/lib/api'
import { Plus, PencilSimple } from '@phosphor-icons/react'
import type { User } from '@/types'

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    api.users.getAll().then(setUsers)
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Përdoruesit</h3>
          <p className="text-sm text-muted-foreground">
            Menaxho përdoruesit e sistemit dhe lejet
          </p>
        </div>
        <Button>
          <Plus className="mr-2" />
          Përdorues i Ri
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Përdoruesi</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Institucioni</TableHead>
              <TableHead>Roli</TableHead>
              <TableHead className="text-right">Veprimet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.institutionName}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <PencilSimple className="mr-2" size={16} />
                    Ndrysho
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
