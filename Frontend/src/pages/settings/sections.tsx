import { useState } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Plus, ShieldCheck } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Avatar } from '@/components/ui/avatar'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { auditLog, orgUsers, roles } from '@/data/mocks/settings'
import type { OrgUser } from '@/types'

const estadoUsuario: Record<OrgUser['estado'], { label: string; variant: 'success' | 'info' | 'neutral' }> = {
  activo: { label: 'Activo', variant: 'success' },
  invitado: { label: 'Invitado', variant: 'info' },
  suspendido: { label: 'Suspendido', variant: 'neutral' },
}

function UsersSection() {
  return (
    <Card className="p-0">
      <CardHeader
        className="px-6 pt-6"
        title="Usuarios"
        subtitle="Miembros de la organización y su acceso"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" /> Invitar usuario
          </Button>
        }
      />
      <Table>
        <THead>
          <Tr>
            <Th>Usuario</Th>
            <Th>Rol</Th>
            <Th>Estado</Th>
            <Th>Último acceso</Th>
          </Tr>
        </THead>
        <TBody>
          {orgUsers.map((user) => (
            <Tr key={user.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar
                    initials={user.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    className="h-8 w-8 text-xs"
                  />
                  <div>
                    <p className="font-semibold text-zinc-900">{user.nombre}</p>
                    <p className="text-xs text-zinc-400">{user.email}</p>
                  </div>
                </div>
              </Td>
              <Td>{user.rol}</Td>
              <Td>
                <Badge variant={estadoUsuario[user.estado].variant}>
                  {estadoUsuario[user.estado].label}
                </Badge>
              </Td>
              <Td className="text-zinc-400">{user.ultimoAcceso}</Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </Card>
  )
}

function RolesSection() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {roles.map((rol) => (
        <Card key={rol.id}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">{rol.nombre}</h3>
              <p className="text-xs text-zinc-400">{rol.usuarios} usuario(s)</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {rol.permisos.map((permiso) => (
              <Badge key={permiso} variant="neutral">
                {permiso}
              </Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

function OrganizationSection() {
  return (
    <Card>
      <CardHeader title="Organización" subtitle="Datos generales de la cuenta" />
      <div className="max-w-md space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
            Nombre de la organización
          </label>
          <Input defaultValue="Manufactura Norte S.A." />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Industria</label>
          <Input defaultValue="Manufactura — PyME" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Zona horaria</label>
          <Input defaultValue="América/Ciudad de México (UTC-6)" />
        </div>
        <Button>Guardar cambios</Button>
      </div>
    </Card>
  )
}

function ToggleListSection({
  title,
  subtitle,
  items,
}: {
  title: string
  subtitle: string
  items: { id: string; label: string; description: string; defaultOn: boolean }[]
}) {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((i) => [i.id, i.defaultOn])),
  )
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} />
      <div className="divide-y divide-zinc-50">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-semibold text-zinc-900">{item.label}</p>
              <p className="text-xs text-zinc-500">{item.description}</p>
            </div>
            <Switch
              checked={state[item.id]}
              onChange={(v) => setState((s) => ({ ...s, [item.id]: v }))}
              label={item.label}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}

function NotificationsSection() {
  return (
    <ToggleListSection
      title="Preferencias de Notificaciones"
      subtitle="Controla qué eventos generan alertas"
      items={[
        { id: 'n1', label: 'Incidentes críticos', description: 'Notificación inmediata por severidad alta', defaultOn: true },
        { id: 'n2', label: 'Recomendaciones IA', description: 'Nuevos insights del motor de inteligencia', defaultOn: true },
        { id: 'n3', label: 'Reportes programados', description: 'Confirmación de cada ejecución automática', defaultOn: false },
        { id: 'n4', label: 'Errores de integración', description: 'Fallos de sincronización con sistemas externos', defaultOn: true },
        { id: 'n5', label: 'Resumen diario', description: 'Digest matutino con el estado de la operación', defaultOn: true },
      ]}
    />
  )
}

function AiSection() {
  return (
    <div className="space-y-6">
      <ToggleListSection
        title="Configuración de IA"
        subtitle="Comportamiento del motor de inteligencia operacional"
        items={[
          { id: 'ai1', label: 'Detección automática de anomalías', description: 'Análisis estadístico continuo (IQR + z-score)', defaultOn: true },
          { id: 'ai2', label: 'Explicaciones en lenguaje natural', description: 'Resúmenes generados por el modelo local (Ollama + Mistral)', defaultOn: true },
          { id: 'ai3', label: 'Predicciones de rendimiento', description: 'Forecast de eficiencia, costos y productividad', defaultOn: true },
          { id: 'ai4', label: 'Recomendaciones proactivas', description: 'Sugerencias de optimización sin solicitud explícita', defaultOn: false },
        ]}
      />
      <Card>
        <CardHeader title="Umbrales de Detección" subtitle="Sensibilidad del detector de anomalías" />
        <div className="grid max-w-md gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
              Desviación de consumo para alertar (%)
            </label>
            <Input type="number" defaultValue={20} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-500">
              Días sin rotación para stock inmovilizado
            </label>
            <Input type="number" defaultValue={30} />
          </div>
          <Button className="w-fit">Guardar umbrales</Button>
        </div>
      </Card>
    </div>
  )
}

function SecuritySection() {
  return (
    <ToggleListSection
      title="Seguridad"
      subtitle="Políticas de acceso y autenticación"
      items={[
        { id: 's1', label: 'Autenticación de dos factores (2FA)', description: 'Obligatoria para todos los miembros', defaultOn: true },
        { id: 's2', label: 'Sesión única (SSO)', description: 'Inicio de sesión con proveedor corporativo', defaultOn: false },
        { id: 's3', label: 'Expiración de sesión', description: 'Cerrar sesiones inactivas tras 8 horas', defaultOn: true },
        { id: 's4', label: 'Restricción por IP', description: 'Solo permitir acceso desde redes autorizadas', defaultOn: false },
      ]}
    />
  )
}

function DataSection() {
  return (
    <ToggleListSection
      title="Gobernanza de Datos"
      subtitle="Retención, privacidad y manejo de la información"
      items={[
        { id: 'd1', label: 'Retención de movimientos históricos', description: 'Conservar 24 meses de datos operativos', defaultOn: true },
        { id: 'd2', label: 'Anonimización de datos personales', description: 'Enmascarar información sensible en reportes', defaultOn: true },
        { id: 'd3', label: 'Exportación libre de datasets', description: 'Permitir a analistas exportar datos crudos', defaultOn: false },
        { id: 'd4', label: 'Respaldo automático diario', description: 'Copia de seguridad de la base de análisis', defaultOn: true },
      ]}
    />
  )
}

function AuditSection() {
  return (
    <Card className="p-0">
      <CardHeader
        className="px-6 pt-6"
        title="Auditoría y Registros"
        subtitle="Trazabilidad de acciones en la plataforma"
      />
      <Table>
        <THead>
          <Tr>
            <Th>Usuario</Th>
            <Th>Acción</Th>
            <Th>Recurso</Th>
            <Th>Fecha</Th>
          </Tr>
        </THead>
        <TBody>
          {auditLog.map((entry) => (
            <Tr key={entry.id}>
              <Td className="font-semibold text-zinc-900">{entry.usuario}</Td>
              <Td>{entry.accion}</Td>
              <Td className="text-zinc-500">{entry.recurso}</Td>
              <Td className="text-zinc-400">{entry.fecha}</Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </Card>
  )
}

export const settingsRoutes: RouteObject[] = [
  { path: 'users', element: <UsersSection /> },
  { path: 'roles', element: <RolesSection /> },
  { path: 'organization', element: <OrganizationSection /> },
  { path: 'notifications', element: <NotificationsSection /> },
  { path: 'ai', element: <AiSection /> },
  { path: 'security', element: <SecuritySection /> },
  { path: 'data', element: <DataSection /> },
  { path: 'audit', element: <AuditSection /> },
]
