import { NavLink, Outlet } from 'react-router-dom'
import {
  Bot,
  Building2,
  Database,
  KeyRound,
  ScrollText,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'

const sections = [
  { to: 'users', label: 'Usuarios', icon: Users },
  { to: 'roles', label: 'Roles y Permisos', icon: UserCog },
  { to: 'organization', label: 'Organización', icon: Building2 },
  { to: 'notifications', label: 'Notificaciones', icon: ScrollText },
  { to: 'ai', label: 'Configuración de IA', icon: Bot },
  { to: 'security', label: 'Seguridad', icon: KeyRound },
  { to: 'data', label: 'Gobernanza de Datos', icon: Database },
  { to: 'audit', label: 'Auditoría', icon: ShieldCheck },
]

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Administración de la plataforma, usuarios y gobernanza"
      />
      <div className="flex gap-8">
        {/* Sidebar interna */}
        <nav className="w-56 shrink-0 space-y-1">
          {sections.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-zinc-500 hover:bg-white hover:text-zinc-800',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Contenido de la sección */}
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
