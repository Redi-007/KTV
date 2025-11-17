import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface LayoutProps {
  children: ReactNode
  title: string
  currentPage: string
  onNavigate: (page: string) => void
}

export function Layout({ children, title, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <TopBar title={title} />
      <main className="ml-64 pt-16">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
