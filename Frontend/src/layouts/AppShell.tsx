import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { CopilotPanel } from '@/components/layout/CopilotPanel'

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      <CommandPalette />
      <CopilotPanel />
    </div>
  )
}
