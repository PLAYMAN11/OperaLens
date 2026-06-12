import { FileText, LineChart, PlayCircle, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader } from '@/components/ui/card'
import { PageLoader } from '@/components/shared/PageLoader'
import { AiSummaryBanner } from '@/components/widgets/AiSummaryBanner'
import { KpiCard } from '@/components/widgets/KpiCard'
import { AiRecommendationsCard } from '@/components/widgets/AiRecommendationsCard'
import { RealTimeActivityFeed } from '@/components/widgets/RealTimeActivityFeed'
import { RecentAlertsCard } from '@/components/widgets/RecentAlertsCard'
import { QuickActionsBar } from '@/components/widgets/QuickActionsBar'
import { OperationalPerformanceChart } from '@/components/charts/OperationalPerformanceChart'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useUserStore } from '@/stores/userStore'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function DashboardPage() {
  const { data, isLoading } = useDashboardData()
  const nombre = useUserStore((s) => s.nombre)
  const navigate = useNavigate()

  if (isLoading || !data) return <PageLoader />

  const quickActions = [
    { id: 'qa1', label: 'Nuevo reporte', icon: FileText, onClick: () => navigate('/reports') },
    { id: 'qa2', label: 'Cargar datos', icon: Upload, onClick: () => navigate('/integrations') },
    { id: 'qa3', label: 'Simular escenario', icon: PlayCircle, onClick: () => navigate('/analytics') },
    { id: 'qa4', label: 'Ver analítica', icon: LineChart, onClick: () => navigate('/analytics') },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
        {getGreeting()}, {nombre.split(' ')[0]} 👋
      </h1>

      <AiSummaryBanner>
        {data.summary.highlights.map((part, i) =>
          part.bold ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>,
        )}
      </AiSummaryBanner>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Rendimiento + Actividad */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Rendimiento Operacional"
            subtitle="Métricas de eficiencia en tiempo real de las últimas 24 horas"
            actions={
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Eficiencia
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Procesos
                </span>
              </div>
            }
          />
          <OperationalPerformanceChart data={data.performance} />
        </Card>
        <RealTimeActivityFeed events={data.activity} />
      </div>

      {/* Recomendaciones IA + Alertas */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AiRecommendationsCard recommendations={data.recommendations} />
        </div>
        <RecentAlertsCard alerts={data.alerts} />
      </div>

      <QuickActionsBar actions={quickActions} />
    </div>
  )
}
