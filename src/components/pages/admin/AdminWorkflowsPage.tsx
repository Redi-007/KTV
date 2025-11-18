import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/lib/api'
import { format } from 'date-fns'
import { Plus, PencilSimple } from '@phosphor-icons/react'
import type { Workflow } from '@/types'

export function AdminWorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])

  useEffect(() => {
    api.workflows.getAll().then(setWorkflows)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Rrjedhat e Punës</h3>
          <p className="text-sm text-muted-foreground">
            Menaxho përkufizimet e rrjedhave të punës dhe hapat e proceseve
          </p>
        </div>
        <Button>
          <Plus className="mr-2" />
          Rrjedhë e Re
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Emri</TableHead>
              <TableHead>Përshkrimi</TableHead>
              <TableHead>Hapat</TableHead>
              <TableHead>Statusi</TableHead>
              <TableHead>Krijuar më</TableHead>
              <TableHead className="text-right">Veprimet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map(workflow => (
              <TableRow key={workflow.id}>
                <TableCell className="font-medium">{workflow.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {workflow.description || '—'}
                </TableCell>
                <TableCell>{workflow.steps.length}</TableCell>
                <TableCell>
                  <Badge
                    variant={workflow.status === 'active' ? 'default' : 'secondary'}
                  >
                    {workflow.status === 'active' ? 'Aktiv' : 'Joaktiv'}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(workflow.createdAt), 'PP')}</TableCell>
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
