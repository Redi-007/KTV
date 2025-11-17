import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react'

export function AdminRolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Roles & Permissions</h3>
          <p className="text-sm text-muted-foreground">
            Configure user roles and access permissions
          </p>
        </div>
        <Button>
          <Plus className="mr-2" />
          New Role
        </Button>
      </div>

      <Card className="p-8 text-center text-muted-foreground">
        Role and permission management interface coming soon
      </Card>
    </div>
  )
}

export function AdminTemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Board Templates</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage kanban board templates
          </p>
        </div>
        <Button>
          <Plus className="mr-2" />
          New Template
        </Button>
      </div>

      <Card className="p-8 text-center text-muted-foreground">
        Board template management interface coming soon
      </Card>
    </div>
  )
}

export function AdminLabelsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Statuses & Labels</h3>
          <p className="text-sm text-muted-foreground">
            Manage task statuses and label definitions
          </p>
        </div>
        <Button>
          <Plus className="mr-2" />
          New Label
        </Button>
      </div>

      <Card className="p-8 text-center text-muted-foreground">
        Status and label management interface coming soon
      </Card>
    </div>
  )
}

export function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold">Analytics</h3>
        <p className="text-sm text-muted-foreground">
          View system analytics and performance metrics
        </p>
      </div>

      <Card className="p-8 text-center text-muted-foreground">
        Analytics dashboard coming soon
      </Card>
    </div>
  )
}

export function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure system-wide settings and preferences
        </p>
      </div>

      <Card className="p-8 text-center text-muted-foreground">
        Settings interface coming soon
      </Card>
    </div>
  )
}
