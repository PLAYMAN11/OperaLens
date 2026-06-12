import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/layouts/AppShell'
import DashboardPage from '@/pages/dashboard'
import OperationsPage from '@/pages/operations'
import AnalyticsPage from '@/pages/analytics'
import AlertsPage from '@/pages/alerts'
import ReportsPage from '@/pages/reports'
import InsightsPage from '@/pages/insights'
import IntegrationsPage from '@/pages/integrations'
import SettingsPage from '@/pages/settings'
import { settingsRoutes } from '@/pages/settings/sections'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'operations', element: <OperationsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'insights', element: <InsightsPage /> },
      { path: 'integrations', element: <IntegrationsPage /> },
      {
        path: 'settings',
        element: <SettingsPage />,
        children: [
          { index: true, element: <Navigate to="users" replace /> },
          ...settingsRoutes,
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
