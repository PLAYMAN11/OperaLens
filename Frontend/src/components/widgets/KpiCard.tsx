import { AlertTriangle, DollarSign, Target, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { TrendBadge } from './TrendBadge'
import type { Kpi } from '@/types'

const iconMap = {
  target: { Icon: Target, bg: 'bg-primary/10', fg: 'text-primary' },
  users: { Icon: Users, bg: 'bg-blue-100', fg: 'text-blue-600' },
  alert: { Icon: AlertTriangle, bg: 'bg-amber-100', fg: 'text-amber-600' },
  dollar: { Icon: DollarSign, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const { Icon, bg, fg } = iconMap[kpi.icon]
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          {kpi.label}
        </span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${bg}`}>
          <Icon className={`h-4.5 w-4.5 ${fg}`} />
        </span>
      </div>
      <div className="text-3xl font-bold text-zinc-900">{kpi.value}</div>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        {kpi.trend ? (
          <>
            <TrendBadge {...kpi.trend} />
            <span>vs semana anterior</span>
          </>
        ) : (
          <span>{kpi.caption}</span>
        )}
      </div>
    </Card>
  )
}
