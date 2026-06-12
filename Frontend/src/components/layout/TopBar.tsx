import { useState } from 'react'
import { Bell, Building2, ChevronDown, HelpCircle, Search, Sparkles } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { StatusDot } from '@/components/shared/StatusDot'
import { useUiStore } from '@/stores/uiStore'
import { useUserStore } from '@/stores/userStore'
import { recentAlerts } from '@/data/mocks/dashboard'
import { cn } from '@/lib/utils'

export function TopBar() {
  const { setCommandPaletteOpen, setCopilotOpen, copilotOpen } = useUiStore()
  const { nombre, rol, iniciales, organizaciones, orgActiva, setOrgActiva } = useUserStore()
  const [notifOpen, setNotifOpen] = useState(false)
  const [orgOpen, setOrgOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 flex h-18 items-center gap-4 border-b border-zinc-100 bg-white/80 px-6 backdrop-blur-md">
      {/* Buscador global */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex h-11 w-full max-w-xl items-center gap-3 rounded-full bg-zinc-100 px-4 text-sm text-zinc-400 transition-colors hover:bg-zinc-200/70"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Buscar operaciones, métricas, alertas...</span>
        <kbd className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
          Ctrl K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Selector de organización */}
        <div className="relative">
          <button
            onClick={() => setOrgOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
          >
            <Building2 className="h-4 w-4 text-zinc-400" />
            <span className="hidden xl:inline">{orgActiva.nombre}</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>
          {orgOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-soft ring-1 ring-zinc-100">
              {organizaciones.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    setOrgActiva(org)
                    setOrgOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm',
                    org.id === orgActiva.id
                      ? 'bg-primary/10 font-semibold text-primary'
                      : 'text-zinc-600 hover:bg-zinc-50',
                  )}
                >
                  <Building2 className="h-4 w-4 shrink-0" />
                  {org.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Asistente IA */}
        <button
          onClick={() => setCopilotOpen(!copilotOpen)}
          className={cn(
            'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
            copilotOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/15',
          )}
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden lg:inline">Asistente IA</span>
        </button>

        {/* Ayuda */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          aria-label="Ayuda"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Notificaciones */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-2 shadow-soft ring-1 ring-zinc-100">
              <p className="px-3 py-2 text-xs font-bold tracking-wide text-zinc-400 uppercase">
                Notificaciones
              </p>
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-zinc-50">
                  <StatusDot status={alert.status} className="mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{alert.message}</p>
                    <p className="text-xs text-zinc-400">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Perfil */}
        <div className="ml-2 flex items-center gap-3">
          <Avatar initials={iniciales} />
          <div className="hidden lg:block">
            <p className="text-sm leading-tight font-bold text-zinc-900">{nombre}</p>
            <p className="text-xs text-zinc-400">{rol}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
