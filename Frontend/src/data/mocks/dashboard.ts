import type {
  ActivityEvent,
  AlertSummaryItem,
  Kpi,
  PerformancePoint,
  Recommendation,
} from '@/types'

export const dashboardKpis: Kpi[] = [
  {
    id: 'eficiencia',
    label: 'Eficiencia Operacional',
    value: '94.8%',
    icon: 'target',
    trend: { direction: 'up', value: '+5.2%', positive: true },
  },
  {
    id: 'procesos',
    label: 'Procesos Activos',
    value: '1,247',
    icon: 'users',
    trend: { direction: 'up', value: '+18.3%', positive: true },
  },
  {
    id: 'incidentes',
    label: 'Tasa de Incidentes',
    value: '0.12%',
    icon: 'alert',
    trend: { direction: 'down', value: '-2.1%', positive: true },
  },
  {
    id: 'costos',
    label: 'Optimización de Costos',
    value: '$42.8K',
    icon: 'dollar',
    caption: 'Este mes',
  },
]

export const performanceData: PerformancePoint[] = [
  { time: '00:00', eficiencia: 87, procesos: 142 },
  { time: '04:00', eficiencia: 89, procesos: 156 },
  { time: '08:00', eficiencia: 91, procesos: 171 },
  { time: '12:00', eficiencia: 95, procesos: 187 },
  { time: '16:00', eficiencia: 93, procesos: 178 },
  { time: '20:00', eficiencia: 90, procesos: 164 },
]

export const activityEvents: ActivityEvent[] = [
  {
    id: 'a1',
    title: 'Optimización de Procesos',
    source: 'Asistente IA',
    time: 'hace 2 min',
    status: 'success',
  },
  {
    id: 'a2',
    title: 'Alerta de Incidente: Carga Alta del Servidor',
    source: 'Sistema',
    time: 'hace 15 min',
    status: 'info',
  },
  {
    id: 'a3',
    title: 'Reporte Generado: Analítica Semanal',
    source: 'Programación Automática',
    time: 'hace 1 hora',
    status: 'success',
  },
  {
    id: 'a4',
    title: 'Sincronización de Integración: Salesforce',
    source: 'Sistema',
    time: 'hace 2 horas',
    status: 'warning',
  },
  {
    id: 'a5',
    title: 'Análisis de Costos Completado',
    source: 'Asistente IA',
    time: 'hace 3 horas',
    status: 'success',
  },
]

export const dashboardRecommendations: Recommendation[] = [
  {
    id: 'r1',
    title: 'Optimizar Operaciones de Almacén',
    description:
      'Se detectó una reducción del 23% en eficiencia durante turnos nocturnos. Se recomienda ajustar la asignación de personal.',
    priority: 'alta',
    impact: '+12% eficiencia',
    isNew: true,
  },
  {
    id: 'r2',
    title: 'Reducir Costos de Infraestructura Cloud',
    description:
      'Se identificaron recursos subutilizados en la región US-East. La migración podría ahorrar $4.2K/mes.',
    priority: 'media',
    impact: '-15% costos',
    isNew: true,
  },
  {
    id: 'r3',
    title: 'Automatizar Procesamiento de Facturas',
    description:
      'El procesamiento manual toma 45 min en promedio. La automatización con IA podría reducirlo a 3 min por factura.',
    priority: 'media',
    impact: '+87% velocidad',
    isNew: true,
  },
]

export const recentAlerts: AlertSummaryItem[] = [
  {
    id: 'al1',
    message: 'Tiempo de respuesta del servidor excede el umbral',
    time: 'hace 5 min',
    status: 'warning',
  },
  {
    id: 'al2',
    message: 'Mantenimiento programado en 2 horas',
    time: 'hace 12 min',
    status: 'info',
  },
  {
    id: 'al3',
    message: 'Todos los sistemas operando con normalidad',
    time: 'hace 1 hora',
    status: 'success',
  },
]

export const aiSummary = {
  highlights: [
    { text: 'Tus operaciones están rindiendo ' },
    { text: '12% por encima del objetivo', bold: true },
    { text: ' hoy. La eficiencia operacional ha mejorado de forma sostenida en las últimas 6 horas, alcanzando ' },
    { text: '95% en su punto máximo', bold: true },
    { text: '. Cero incidentes críticos detectados. Las iniciativas de optimización de costos han ahorrado ' },
    { text: '$8.4K esta semana', bold: true },
    { text: '.' },
  ],
}
