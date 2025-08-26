# 📋 ESTRUCTURA COMPLETA DEL SISTEMA DE CITAS

## 📁 Estructura de Archivos

```
src/app/
├── mis-citas/                    # 👤 CLIENTE
│   ├── page.tsx                 # Lista de citas del cliente
│   ├── [id]/
│   │   └── page.tsx            # Detalle de cita específica
│   └── layout.tsx              # Layout con navegación de cliente
│
├── agenda/                      # 🩺 VETERINARIO  
│   ├── page.tsx                # Agenda del veterinario
│   ├── [id]/
│   │   └── page.tsx           # Detalle de cita para veterinario
│   └── layout.tsx             # Layout con herramientas de veterinario
│
└── admin/
    └── citas/                  # 🛡️ ADMIN
        ├── page.tsx           # Gestión completa de citas
        └── [id]/
            └── page.tsx       # Administración de cita específica

src/components/appointments/
├── client/                     # Componentes para CLIENTES
│   ├── client-appointments-list.tsx
│   ├── client-appointment-card.tsx
│   ├── cancel-appointment-dialog.tsx
│   └── reschedule-appointment-dialog.tsx
│
├── veterinarian/              # Componentes para VETERINARIOS
│   ├── vet-agenda-calendar.tsx
│   ├── vet-appointment-card.tsx
│   ├── appointment-notes-dialog.tsx
│   └── patient-info-card.tsx
│
├── admin/                     # Componentes para ADMIN
│   ├── admin-appointments-table.tsx
│   ├── appointments-stats.tsx
│   └── bulk-actions.tsx
│
└── shared/                    # Componentes COMPARTIDOS
    ├── appointment-status-badge.tsx
    ├── appointment-filters.tsx
    └── appointment-detail-view.tsx
```

## 🎨 Vistas por Rol

### 👤 CLIENTE - `/mis-citas`
```
┌─────────────────────────────────────┐
│ 📅 Mis Citas                       │
├─────────────────────────────────────┤
│ [Próximas] [Pasadas] [Canceladas]   │
├─────────────────────────────────────┤
│ 🔍 Buscar por servicio...           │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 📅 15 Dic 2024 - 10:00 AM      │ │
│ │ 🩺 Dr. María González           │ │
│ │ │ Consulta General              │ │
│ │ │ 🐕 Max (Golden Retriever)     │ │
│ │ │ [Ver] [Cancelar] [Reprogramar]│ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📅 20 Dic 2024 - 3:00 PM       │ │
│ │ 🩺 Dr. Carlos Ruiz              │ │
│ │ │ Vacunación                    │ │
│ │ │ 🐱 Luna (Persa)               │ │
│ │ │ [Ver] [Cancelar] [Reprogramar]│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 🩺 VETERINARIO - `/agenda`
```
┌─────────────────────────────────────┐
│ 🩺 Mi Agenda - Dr. María González   │
├─────────────────────────────────────┤
│ [Hoy] [Esta Semana] [Este Mes]      │
├─────────────────────────────────────┤
│ 📊 Resumen: 8 citas hoy             │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ ⏰ 10:00 - 10:30 AM             │ │
│ │ 👤 Juan Pérez                   │ │
│ │ │ 🐕 Max - Consulta General     │ │
│ │ │ 📞 +51 999 666 555           │ │
│ │ │ [Confirmar] [Notas] [Completar]│ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ⏰ 11:00 - 11:45 AM             │ │
│ │ 👤 Ana García                   │ │
│ │ │ 🐱 Luna - Vacunación          │ │
│ │ │ 📞 +51 999 777 888           │ │
│ │ │ [Confirmar] [Notas] [Completar]│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 🛡️ ADMIN - `/admin/citas`
```
┌─────────────────────────────────────┐
│ 🛡️ Gestión de Citas - Admin        │
├─────────────────────────────────────┤
│ 📊 [Estadísticas] [Reportes]        │
├─────────────────────────────────────┤
│ 🔍 Filtros: [Veterinario] [Estado]  │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Tabla con TODAS las citas       │ │
│ │ - Cliente | Veterinario | Fecha │ │
│ │ - Estado | Servicio | Acciones  │ │
│ │ - Paginación y filtros avanzados│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 🔐 Control de Acceso

### Middleware de Rutas
```typescript
// src/middleware.ts - Agregar protección
'/mis-citas': requiere USER autenticado
'/agenda': requiere VETERINARIAN role  
'/admin/citas': requiere ADMIN role
```

### Verificación en Componentes
```typescript
// Cada vista verifica el rol apropiado
const { user } = useUser()
const userRole = getUserRole(user)

if (userRole !== 'expected_role') {
  return <AccessDenied />
}
```