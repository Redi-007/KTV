import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { Plus, PencilSimple } from '@phosphor-icons/react'
import type { Institution } from '@/types'

export function AdminInstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([])

  useEffect(() => {
    api.institutions.getAll().then(setInstitutions)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Institutions</h3>
          <p className="text-sm text-muted-foreground">
            Manage organizational institutions
          </p>
        </div>
        <Button>
          <Plus className="mr-2" />
          New Institution
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutions.map(institution => (
              <TableRow key={institution.id}>
                <TableCell className="font-medium">{institution.name}</TableCell>
                <TableCell>{institution.type}</TableCell>
                <TableCell>
                  <Badge variant={institution.active ? 'default' : 'secondary'}>
                    {institution.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(institution.createdAt), 'PP')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <PencilSimple className="mr-2" size={16} />
                    Edit
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
