import { useState } from 'react'
import { AppProvider } from '@/lib/AppContext'
import { Layout } from '@/components/layout/Layout'
import { TaskDrawer } from '@/components/TaskDrawer'
import { DashboardPage } from '@/components/pages/DashboardPage'
import { TasksPage } from '@/components/pages/TasksPage'
import { BoardsPage } from '@/components/pages/BoardsPage'
import { CalendarPage } from '@/components/pages/CalendarPage'
import { NotificationsPage } from '@/components/pages/NotificationsPage'
import { SearchPage } from '@/components/pages/SearchPage'
import { AdminWorkflowsPage } from '@/components/pages/admin/AdminWorkflowsPage'
import { AdminInstitutionsPage } from '@/components/pages/admin/AdminInstitutionsPage'
import { AdminUsersPage } from '@/components/pages/admin/AdminUsersPage'
import {
  AdminRolesPage,
  AdminTemplatesPage,
  AdminLabelsPage,
  AdminAnalyticsPage,
  AdminSettingsPage,
} from '@/components/pages/admin/AdminOtherPages'
import { Toaster } from '@/components/ui/sonner'

type Page =
  | 'dashboard'
  | 'tasks'
  | 'boards'
  | 'calendar'
  | 'notifications'
  | 'search'
  | 'admin-workflows'
  | 'admin-institutions'
  | 'admin-roles'
  | 'admin-templates'
  | 'admin-labels'
  | 'admin-users'
  | 'admin-analytics'
  | 'admin-settings'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const getPageTitle = (): string => {
    switch (currentPage) {
      case 'dashboard': return 'Paneli Kryesor'
      case 'tasks': return 'Detyrat'
      case 'boards': return 'Tabelat Kanban'
      case 'calendar': return 'Kalendari'
      case 'notifications': return 'Njoftimet'
      case 'search': return 'Kërko'
      case 'admin-workflows': return 'Administrimi: Rrjedhat e Punës'
      case 'admin-institutions': return 'Administrimi: Institucionet'
      case 'admin-roles': return 'Administrimi: Rolet & Lejet'
      case 'admin-templates': return 'Administrimi: Shabllonet e Tabelave'
      case 'admin-labels': return 'Administrimi: Statuset & Etiketat'
      case 'admin-users': return 'Administrimi: Përdoruesit'
      case 'admin-analytics': return 'Administrimi: Analitika'
      case 'admin-settings': return 'Administrimi: Cilësimet'
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />
      case 'tasks': return <TasksPage />
      case 'boards': return <BoardsPage />
      case 'calendar': return <CalendarPage />
      case 'notifications': return <NotificationsPage />
      case 'search': return <SearchPage />
      case 'admin-workflows': return <AdminWorkflowsPage />
      case 'admin-institutions': return <AdminInstitutionsPage />
      case 'admin-roles': return <AdminRolesPage />
      case 'admin-templates': return <AdminTemplatesPage />
      case 'admin-labels': return <AdminLabelsPage />
      case 'admin-users': return <AdminUsersPage />
      case 'admin-analytics': return <AdminAnalyticsPage />
      case 'admin-settings': return <AdminSettingsPage />
    }
  }

  return (
    <AppProvider>
      <Layout
        title={getPageTitle()}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page as Page)}
      >
        {renderPage()}
      </Layout>
      <TaskDrawer />
      <Toaster />
    </AppProvider>
  )
}

export default App
