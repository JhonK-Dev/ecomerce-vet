'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  Calendar,
  Clock,
  User,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Edit,
  CalendarDays,
  Stethoscope,
  Filter,
} from 'lucide-react'
import {
  Appointment,
  AppointmentStatus,
  AppointmentPriority,
} from '@/types/veterinary'
import { AppointmentService } from '@/lib/appointments'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getUserRole, ClerkUser } from '@/lib/clerk-auth'
import { UserRole } from '@/types'

export default function AgendaPage() {
  const { user, isLoaded } = useUser()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('hoy')
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editNotes, setEditNotes] = useState('')

  const userRole = getUserRole(user as ClerkUser)

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true)
      const filters: { veterinarianId?: string } = {}

      // Si es veterinario, solo ver sus citas
      if (userRole === UserRole.VETERINARIAN) {
        filters.veterinarianId = user?.id
      }
      // Si es admin, ve todas las citas (sin filtro)

      const appointmentsList = await AppointmentService.getAppointments(filters)
      setAppointments(appointmentsList)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }, [userRole, user?.id])

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
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

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
        case 'manana':
          return appointmentDay.getTime() === tomorrow.getTime()
        case 'semana':
          return appointmentDay >= today && appointmentDay < nextWeek
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

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (apt) =>
          apt.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (apt.pet?.name || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          apt.symptoms?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => {
      // Ordenar por fecha y hora
      const dateA = new Date(`${a.date} ${a.startTime}`)
      const dateB = new Date(`${b.date} ${b.startTime}`)
      return dateA.getTime() - dateB.getTime()
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

  const hoyAppointments = filterAppointments(appointments, 'hoy')
  const mananaAppointments = filterAppointments(appointments, 'manana')
  const semanaAppointments = filterAppointments(appointments, 'semana')
  const todasAppointments = filterAppointments(appointments, 'todas')

  const getAppointmentsByTab = (tab: string) => {
    switch (tab) {
      case 'hoy':
        return hoyAppointments
      case 'manana':
        return mananaAppointments
      case 'semana':
        return semanaAppointments
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
            <Stethoscope className="h-8 w-8 mr-3 text-primary" />
            {userRole === UserRole.ADMIN ? 'Gestión de Citas' : 'Mi Agenda'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {userRole === UserRole.ADMIN
              ? 'Administra todas las citas del sistema'
              : 'Gestiona las citas de tus pacientes'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          {userRole === UserRole.ADMIN && (
            <Button variant="outline">
              <CalendarDays className="h-4 w-4 mr-2" />
              Reportes
            </Button>
          )}
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Buscar por paciente, motivo..."
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
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
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
                  <SelectValue placeholder="Todas las prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
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
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hoy" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Hoy ({hoyAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="manana" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Mañana ({mananaAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="semana" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Esta Semana ({semanaAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="todas" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Todas ({todasAppointments.length})
          </TabsTrigger>
        </TabsList>

        {['hoy', 'manana', 'semana', 'todas'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Cargando citas...</p>
              </div>
            ) : getAppointmentsByTab(tab).length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay citas</h3>
                  <p className="text-muted-foreground">
                    No hay citas programadas para{' '}
                    {tab === 'hoy'
                      ? 'hoy'
                      : tab === 'manana'
                      ? 'mañana'
                      : tab === 'semana'
                      ? 'esta semana'
                      : 'mostrar'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              getAppointmentsByTab(tab).map((appointment) => (
                <Card
                  key={appointment.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusLabel(appointment.status)}
                          </Badge>
                          <Badge
                            className={getPriorityColor(appointment.priority)}
                          >
                            {getPriorityLabel(appointment.priority)}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {format(
                              new Date(appointment.date),
                              'EEEE, d MMMM',
                              { locale: es }
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {appointment.startTime} - {appointment.endTime}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                          {appointment.reason}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>
                              <strong>Paciente:</strong>{' '}
                              {appointment.pet?.name || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>
                              <strong>Propietario:</strong>{' '}
                              {appointment.client?.name || 'N/A'}
                            </span>
                          </div>
                          {userRole === UserRole.ADMIN && (
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-muted-foreground" />
                              <span>
                                <strong>Veterinario:</strong>{' '}
                                {appointment.veterinarian?.name || 'N/A'}
                              </span>
                            </div>
                          )}
                        </div>

                        {appointment.symptoms && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-md">
                            <p className="text-sm">
                              <strong>Síntomas:</strong> {appointment.symptoms}
                            </p>
                          </div>
                        )}

                        {appointment.notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm">
                              <strong>Notas médicas:</strong>{' '}
                              {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 lg:ml-6">
                        {appointment.status === AppointmentStatus.SCHEDULED && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  appointment.id,
                                  AppointmentStatus.CONFIRMED
                                )
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  appointment.id,
                                  AppointmentStatus.CANCELLED
                                )
                              }
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancelar
                            </Button>
                          </div>
                        )}

                        {appointment.status === AppointmentStatus.CONFIRMED && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  appointment.id,
                                  AppointmentStatus.IN_PROGRESS
                                )
                              }
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Iniciar
                            </Button>
                          </div>
                        )}

                        {appointment.status ===
                          AppointmentStatus.IN_PROGRESS && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  appointment.id,
                                  AppointmentStatus.COMPLETED
                                )
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Completar
                            </Button>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(appointment)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Notas
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog para editar notas */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Notas Médicas</DialogTitle>
            <DialogDescription>
              Agrega o edita las notas médicas para la cita de{' '}
              {selectedAppointment?.pet?.name || 'la mascota'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Notas Médicas</Label>
              <Textarea
                id="notes"
                placeholder="Escribe las notas médicas aquí..."
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
              Guardar Notas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
