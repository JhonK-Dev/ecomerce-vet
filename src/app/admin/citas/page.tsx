'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Calendar,
  Clock,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Shield,
  Filter,
  Download,
  BarChart3,
  TrendingUp,
  UserCheck,
  Activity,
} from 'lucide-react'
import {
  Appointment,
  AppointmentStatus,
  AppointmentPriority,
} from '@/types/veterinary'
import { AppointmentService } from '@/lib/appointments'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AdminCitasPage() {
  const { user, isLoaded } = useUser()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [veterinarianFilter, setVeterinarianFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('todas')
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showStatsDialog, setShowStatsDialog] = useState(false)
  const [editNotes, setEditNotes] = useState('')

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true)
      // Admin ve todas las citas
      const appointmentsList = await AppointmentService.getAppointments({})
      setAppointments(appointmentsList)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && user) {
      loadAppointments()
    }
  }, [isLoaded, user, loadAppointments])

  const getStatusColor = (status: AppointmentStatus) => {
    const colors = {
      [AppointmentStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
      [AppointmentStatus.CONFIRMED]: 'bg-green-100 text-green-800',
      [AppointmentStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
      [AppointmentStatus.COMPLETED]: 'bg-emerald-100 text-emerald-800',
      [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-800',
      [AppointmentStatus.NO_SHOW]: 'bg-gray-100 text-gray-800',
      [AppointmentStatus.RESCHEDULED]: 'bg-purple-100 text-purple-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: AppointmentStatus) => {
    const labels = {
      [AppointmentStatus.SCHEDULED]: 'Programada',
      [AppointmentStatus.CONFIRMED]: 'Confirmada',
      [AppointmentStatus.IN_PROGRESS]: 'En Progreso',
      [AppointmentStatus.COMPLETED]: 'Completada',
      [AppointmentStatus.CANCELLED]: 'Cancelada',
      [AppointmentStatus.NO_SHOW]: 'No Asistió',
      [AppointmentStatus.RESCHEDULED]: 'Reprogramada',
    }
    return labels[status] || status
  }

  const getPriorityColor = (priority: AppointmentPriority) => {
    const colors = {
      [AppointmentPriority.LOW]: 'bg-gray-100 text-gray-800',
      [AppointmentPriority.NORMAL]: 'bg-blue-100 text-blue-800',
      [AppointmentPriority.HIGH]: 'bg-orange-100 text-orange-800',
      [AppointmentPriority.EMERGENCY]: 'bg-red-100 text-red-800',
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityLabel = (priority: AppointmentPriority) => {
    const labels = {
      [AppointmentPriority.LOW]: 'Baja',
      [AppointmentPriority.NORMAL]: 'Normal',
      [AppointmentPriority.HIGH]: 'Alta',
      [AppointmentPriority.EMERGENCY]: 'Emergencia',
    }
    return labels[priority] || priority
  }

  const filterAppointments = (appointments: Appointment[], filter: string) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - 7)
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    let filtered = appointments.filter((apt) => {
      const appointmentDate = new Date(apt.date)
      const appointmentDay = new Date(
        appointmentDate.getFullYear(),
        appointmentDate.getMonth(),
        appointmentDate.getDate()
      )

      switch (filter) {
        case 'hoy':
          return appointmentDay.getTime() === today.getTime()
        case 'pendientes':
          return (
            apt.status === AppointmentStatus.SCHEDULED ||
            apt.status === AppointmentStatus.CONFIRMED
          )
        case 'completadas':
          return apt.status === AppointmentStatus.COMPLETED
        case 'canceladas':
          return (
            apt.status === AppointmentStatus.CANCELLED ||
            apt.status === AppointmentStatus.NO_SHOW
          )
        case 'todas':
          return true
        default:
          return true
      }
    })

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    // Filtrar por prioridad
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.priority === priorityFilter)
    }

    // Filtrar por veterinario
    if (veterinarianFilter !== 'all') {
      filtered = filtered.filter(
        (apt) => apt.veterinarianId === veterinarianFilter
      )
    }

    // Filtrar por fecha
    if (dateFilter !== 'all') {
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter((apt) => {
            const aptDate = new Date(apt.date)
            return aptDate.toDateString() === today.toDateString()
          })
          break
        case 'week':
          filtered = filtered.filter((apt) => {
            const aptDate = new Date(apt.date)
            return aptDate >= thisWeek
          })
          break
        case 'month':
          filtered = filtered.filter((apt) => {
            const aptDate = new Date(apt.date)
            return aptDate >= thisMonth
          })
          break
      }
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (apt) =>
          apt.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (apt.pet?.name || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (apt.client?.name || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (apt.veterinarian?.name || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          apt.symptoms?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => {
      // Ordenar por fecha y hora
      const dateA = new Date(`${a.date} ${a.startTime}`)
      const dateB = new Date(`${b.date} ${b.startTime}`)
      return dateB.getTime() - dateA.getTime() // Más recientes primero
    })
  }

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: AppointmentStatus
  ) => {
    try {
      await AppointmentService.updateAppointmentStatus(appointmentId, newStatus)
      loadAppointments()
    } catch (error) {
      console.error('Error updating appointment status:', error)
      alert('Error al actualizar el estado de la cita')
    }
  }

  const handleAddNotes = async (appointmentId: string, notes: string) => {
    try {
      // Usar updateAppointmentStatus para actualizar las notas
      const appointment = appointments.find((apt) => apt.id === appointmentId)
      if (appointment) {
        await AppointmentService.updateAppointmentStatus(
          appointmentId,
          appointment.status,
          notes
        )
      }
      setShowEditDialog(false)
      setEditNotes('')
      setSelectedAppointment(null)
      loadAppointments()
    } catch (error) {
      console.error('Error adding notes:', error)
      alert('Error al agregar notas')
    }
  }

  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setEditNotes(appointment.notes || '')
    setShowEditDialog(true)
  }

  const getStats = () => {
    const total = appointments.length
    const completed = appointments.filter(
      (apt) => apt.status === AppointmentStatus.COMPLETED
    ).length
    const pending = appointments.filter(
      (apt) =>
        apt.status === AppointmentStatus.SCHEDULED ||
        apt.status === AppointmentStatus.CONFIRMED
    ).length
    const cancelled = appointments.filter(
      (apt) => apt.status === AppointmentStatus.CANCELLED
    ).length
    const today = appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      const todayDate = new Date()
      return aptDate.toDateString() === todayDate.toDateString()
    }).length

    return { total, completed, pending, cancelled, today }
  }

  const stats = getStats()

  const hoyAppointments = filterAppointments(appointments, 'hoy')
  const pendientesAppointments = filterAppointments(appointments, 'pendientes')
  const completadasAppointments = filterAppointments(
    appointments,
    'completadas'
  )
  const canceladasAppointments = filterAppointments(appointments, 'canceladas')
  const todasAppointments = filterAppointments(appointments, 'todas')

  const getAppointmentsByTab = (tab: string) => {
    switch (tab) {
      case 'hoy':
        return hoyAppointments
      case 'pendientes':
        return pendientesAppointments
      case 'completadas':
        return completadasAppointments
      case 'canceladas':
        return canceladasAppointments
      case 'todas':
        return todasAppointments
      default:
        return []
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" />
            Panel de Administración - Citas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona todas las citas del sistema veterinario
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" onClick={() => setShowStatsDialog(true)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Estadísticas
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Citas
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Hoy</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Pendientes
                </p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Completadas
                </p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Canceladas
                </p>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value={AppointmentStatus.SCHEDULED}>
                    Programada
                  </SelectItem>
                  <SelectItem value={AppointmentStatus.CONFIRMED}>
                    Confirmada
                  </SelectItem>
                  <SelectItem value={AppointmentStatus.IN_PROGRESS}>
                    En Progreso
                  </SelectItem>
                  <SelectItem value={AppointmentStatus.COMPLETED}>
                    Completada
                  </SelectItem>
                  <SelectItem value={AppointmentStatus.CANCELLED}>
                    Cancelada
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value={AppointmentPriority.EMERGENCY}>
                    Emergencia
                  </SelectItem>
                  <SelectItem value={AppointmentPriority.HIGH}>Alta</SelectItem>
                  <SelectItem value={AppointmentPriority.NORMAL}>
                    Normal
                  </SelectItem>
                  <SelectItem value={AppointmentPriority.LOW}>Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="veterinarian">Veterinario</Label>
              <Select
                value={veterinarianFilter}
                onValueChange={setVeterinarianFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Veterinario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">Dr. García</SelectItem>
                  <SelectItem value="2">Dra. Martínez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Período</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="todas" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Todas ({todasAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="hoy" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Hoy ({hoyAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="pendientes" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendientes ({pendientesAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completadas" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completadas ({completadasAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="canceladas" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Canceladas ({canceladasAppointments.length})
          </TabsTrigger>
        </TabsList>

        {['todas', 'hoy', 'pendientes', 'completadas', 'canceladas'].map(
          (tab) => (
            <TabsContent key={tab} value={tab}>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">
                    Cargando citas...
                  </p>
                </div>
              ) : getAppointmentsByTab(tab).length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay citas</h3>
                    <p className="text-muted-foreground">
                      No se encontraron citas para los filtros seleccionados
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Hora</TableHead>
                          <TableHead>Paciente</TableHead>
                          <TableHead>Propietario</TableHead>
                          <TableHead>Veterinario</TableHead>
                          <TableHead>Motivo</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Prioridad</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getAppointmentsByTab(tab).map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              {format(
                                new Date(appointment.date),
                                'dd/MM/yyyy',
                                { locale: es }
                              )}
                            </TableCell>
                            <TableCell>
                              {appointment.startTime} - {appointment.endTime}
                            </TableCell>
                            <TableCell>
                              {appointment.pet?.name || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {appointment.client?.name || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {appointment.veterinarian?.name || 'N/A'}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {appointment.reason}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusColor(appointment.status)}
                              >
                                {getStatusLabel(appointment.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getPriorityColor(
                                  appointment.priority
                                )}
                              >
                                {getPriorityLabel(appointment.priority)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(appointment)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {appointment.status ===
                                  AppointmentStatus.SCHEDULED && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleStatusChange(
                                        appointment.id,
                                        AppointmentStatus.CONFIRMED
                                      )
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )
        )}
      </Tabs>

      {/* Dialog para editar notas */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gestionar Cita</DialogTitle>
            <DialogDescription>
              Administra la cita de{' '}
              {selectedAppointment?.pet?.name || 'la mascota'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Estado de la Cita</Label>
              <Select
                value={selectedAppointment?.status || ''}
                onValueChange={(status) =>
                  selectedAppointment &&
                  handleStatusChange(
                    selectedAppointment.id,
                    status as AppointmentStatus
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AppointmentStatus.SCHEDULED}>
                    Programada
                  </SelectItem>
                  <SelectItem value={AppointmentStatus.CONFIRMED}>
                    Confirmada
                  </SelectItem>
                  <SelectItem value={AppointmentStatus.IN_PROGRESS}>
                    En Progreso
                  </SelectItem>
                  <SelectItem value={AppointmentStatus.COMPLETED}>
                    Completada
                  </SelectItem>
                  <SelectItem value={AppointmentStatus.CANCELLED}>
                    Cancelada
                  </SelectItem>
                  <SelectItem value={AppointmentStatus.NO_SHOW}>
                    No Asistió
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notas Administrativas</Label>
              <Textarea
                id="notes"
                placeholder="Agregar notas administrativas..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() =>
                selectedAppointment &&
                handleAddNotes(selectedAppointment.id, editNotes)
              }
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Estadísticas */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Estadísticas del Sistema</DialogTitle>
            <DialogDescription>
              Resumen de actividad de citas veterinarias
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Resumen General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total de citas:</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completadas:</span>
                    <span className="font-semibold text-green-600">
                      {stats.completed}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pendientes:</span>
                    <span className="font-semibold text-yellow-600">
                      {stats.pending}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Canceladas:</span>
                    <span className="font-semibold text-red-600">
                      {stats.cancelled}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Tasa de Éxito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tasa de finalización:</span>
                    <span className="font-semibold">
                      {stats.total > 0
                        ? Math.round((stats.completed / stats.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa de cancelación:</span>
                    <span className="font-semibold">
                      {stats.total > 0
                        ? Math.round((stats.cancelled / stats.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowStatsDialog(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
