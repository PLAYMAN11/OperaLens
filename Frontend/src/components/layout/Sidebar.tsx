import { NavLink } from 'react-router-dom'
import {
  Activity,
  Bell,
  FileText,
  LayoutDashboard,
  LineChart,
  Plug,
  Settings,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard },
  { to: '/operations', label: 'Operaciones', icon: Activity },
  { to: '/analytics', label: 'Analítica', icon: LineChart },
  { to: '/alerts', label: 'Alertas', icon: Bell },
  { to: '/reports', label: 'Reportes', icon: FileText },
  { to: '/insights', label: 'Insights IA', icon: Sparkles },
  { to: '/integrations', label: 'Integraciones', icon: Plug },
  { to: '/settings', label: 'Configuración', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-65 shrink-0 flex-col bg-black">
      {/* Logo */}
      <div className="px-6 pt-7 pb-8">
        <h1 className="text-xl font-extrabold tracking-tight text-white">OperaLens</h1>
        <p className="mt-0.5 text-[11px] text-zinc-500">Inteligencia Operacional</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white',
              )
            }
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex items-center gap-2 px-6 py-5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <p className="text-[11px] text-zinc-600">v2.4.1 • © 2026 OperaLens</p>
      </div>
    </aside>
  )
}
