import { useQuery } from '@tanstack/react-query'
import { mockFetch } from '@/lib/api/client'
import {
  activityEvents,
  aiSummary,
  dashboardKpis,
  dashboardRecommendations,
  performanceData,
  recentAlerts,
} from '@/data/mocks/dashboard'

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () =>
      mockFetch({
        kpis: dashboardKpis,
        performance: performanceData,
        activity: activityEvents,
        recommendations: dashboardRecommendations,
        alerts: recentAlerts,
        summary: aiSummary,
      }),
  })
}
