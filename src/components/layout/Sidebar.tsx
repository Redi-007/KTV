import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  SquaresFour,
  ListChecks,
  Kanban,
  Calendar,
  Bell,
  MagnifyingGlass,
  GearSix,
  Users,
  ChartBar,
  Tag,
  Buildings,
  FlowArrow,
  ShieldCheck,
  CaretDown,
  SquaresFour as TemplateIcon,
} from '@phosphor-icons/react'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [adminExpanded, setAdminExpanded] = useState(false)

  const mainItems = [
    { id: 'dashboard', label: 'Paneli Kryesor', icon: SquaresFour },
    { id: 'tasks', label: 'Detyrat', icon: ListChecks },
    { id: 'boards', label: 'Tabelat', icon: Kanban },
    { id: 'calendar', label: 'Kalendari', icon: Calendar },
    { id: 'notifications', label: 'Njoftimet', icon: Bell },
    { id: 'search', label: 'Kërko', icon: MagnifyingGlass },
  ]

  const adminItems = [
    { id: 'admin-workflows', label: 'Rrjedhat e Punës', icon: FlowArrow },
    { id: 'admin-institutions', label: 'Institucionet', icon: Buildings },
    { id: 'admin-roles', label: 'Rolet & Lejet', icon: ShieldCheck },
    { id: 'admin-templates', label: 'Shabllonet e Tabelave', icon: TemplateIcon },
    { id: 'admin-labels', label: 'Statuset & Etiketat', icon: Tag },
    { id: 'admin-users', label: 'Përdoruesit', icon: Users },
    { id: 'admin-analytics', label: 'Analitika', icon: ChartBar },
    { id: 'admin-settings', label: 'Cilësimet', icon: GearSix },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-[var(--sidebar-background)] flex flex-col">
      <div className="p-6 border-b border-[var(--sidebar-border)]">
        <h1 className="text-xl font-semibold text-foreground">Menaxher Punimesh</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-1">
          {mainItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-[var(--sidebar-foreground)] hover:bg-muted'
                )}
              >
                <Icon className="shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}

          <div className="mt-6">
            <button
              onClick={() => setAdminExpanded(!adminExpanded)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted w-full transition-colors"
            >
              <span className="flex-1 text-left">Administrimi</span>
              <CaretDown
                className={cn(
                  'transition-transform shrink-0',
                  adminExpanded && 'rotate-180'
                )}
              />
            </button>

            {adminExpanded && (
              <div className="mt-1 flex flex-col gap-1 pl-2">
                {adminItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPage === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-[var(--sidebar-foreground)] hover:bg-muted'
                      )}
                    >
                      <Icon className="shrink-0" size={18} />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  )
}
