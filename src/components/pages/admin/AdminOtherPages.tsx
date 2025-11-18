import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react'

export function AdminRolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Rolet & Lejet</h3>
          <p className="text-sm text-muted-foreground">
            Konfiguro rolet e përdoruesve dhe lejet e qasjes
          </p>
        </div>
        <Button>
          <Plus className="mr-2" />
          Rol i Ri
        </Button>
      </div>

      <Card className="p-8 text-center text-muted-foreground">
        Ndërfaqja e menaxhimit të roleve dhe lejeve vjen së shpejti
      </Card>
    </div>
  )
}

export function AdminTemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Shabllonet e Tabelave</h3>
          <p className="text-sm text-muted-foreground">
            Krijo dhe menaxho shabllonet e tabelave kanban
          </p>
        </div>
        <Button>
          <Plus className="mr-2" />
          Shabllo e Re
        </Button>
      </div>

      <Card className="p-8 text-center text-muted-foreground">
        Ndërfaqja e menaxhimit të shablloneve të tabelave vjen së shpejti
      </Card>
    </div>
  )
}

export function AdminLabelsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Statuset & Etiketat</h3>
          <p className="text-sm text-muted-foreground">
            Menaxho statuset e detyrave dhe përkufizimet e etiketave
          </p>
        </div>
        <Button>
          <Plus className="mr-2" />
          Etiketë e Re
        </Button>
      </div>

      <Card className="p-8 text-center text-muted-foreground">
        Ndërfaqja e menaxhimit të statuseve dhe etiketave vjen së shpejti
      </Card>
    </div>
  )
}

export function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold">Analitika</h3>
        <p className="text-sm text-muted-foreground">
          Shiko analitikën e sistemit dhe metrikat e performancës
        </p>
      </div>

      <Card className="p-8 text-center text-muted-foreground">
        Paneli i analitikës vjen së shpejti
      </Card>
    </div>
  )
}

export function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold">Cilësimet</h3>
        <p className="text-sm text-muted-foreground">
          Konfiguro cilësimet dhe preferencat në nivel sistemi
        </p>
      </div>

      <Card className="p-8 text-center text-muted-foreground">
        Ndërfaqja e cilësimeve vjen së shpejti
      </Card>
    </div>
  )
}
