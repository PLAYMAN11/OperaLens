# OperaLens — Frontend

Plataforma SaaS de Inteligencia Operacional impulsada por IA. SPA desktop-first construida con React.

## Stack

- **Build:** Vite + React 19 + TypeScript
- **Routing:** React Router v7
- **Estilos:** Tailwind CSS v4 + tokens CSS de marca (`src/design-system/tokens.css`)
- **Gráficos:** Recharts
- **Estado servidor:** TanStack Query (mocks con latencia simulada)
- **Estado UI:** Zustand
- **Iconos:** Lucide React
- **Tipografía:** Inter (Google Fonts)

## Desarrollo

```bash
npm install
npm run dev
```

La app corre en `http://localhost:5173`.

## Estructura

```
src/
├── layouts/AppShell.tsx       # Sidebar negra + TopBar + Outlet
├── routes/index.tsx           # 8 módulos + sub-rutas de Configuración
├── pages/                     # dashboard, operations, analytics, alerts,
│                              # reports, insights, integrations, settings
├── components/
│   ├── ui/                    # Primitivos: Button, Card, Badge, Table...
│   ├── widgets/               # KpiCard, AiSummaryBanner, Recomendaciones IA...
│   ├── charts/                # Recharts: área, línea, barras, sparkline
│   ├── layout/                # Sidebar, TopBar, CommandPalette, CopilotPanel
│   └── shared/                # PageHeader, EmptyState, StatusDot, loaders
├── data/mocks/                # Datos demo por módulo
├── hooks/                     # Hooks TanStack Query por módulo
├── stores/                    # Zustand: usuario/organización y estado UI
├── types/                     # Tipos de dominio (alineados con el backend)
└── lib/api/client.ts          # Cliente HTTP stub → FastAPI
```

## Integración con el backend

Los tipos en `src/types/analysis.ts` siguen el contrato del backend FastAPI
(`Backend/services/analyzer.py`, `anomalies.py`, `ai/explainer.py`). Los hooks
consumen mocks vía `mockFetch`; cuando la API esté disponible, cambia cada hook
a `apiFetch` en `src/lib/api/client.ts` (URL configurable con `VITE_API_URL`,
por defecto `http://localhost:8000`).

## Referencias visuales

Los mockups que guían el diseño están en `docs/reference/`.

## Atajos

- `Ctrl/Cmd + K` — Command palette (búsqueda global)
- Botón **Asistente IA** en la barra superior — panel de copiloto contextual
