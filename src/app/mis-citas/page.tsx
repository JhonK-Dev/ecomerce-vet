'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import {
  Calendar,
  Clock,
  User,
  Search,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Trash2,
} from 'lucide-react'
import { Appointment, AppointmentStatus } from '@/types/veterinary'
import { AppointmentService } from '@/lib/appointments'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

export default function MisCitasPage() {
  const { user, isLoaded } = useUser()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('proximas')

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true)
      // Obtener citas del usuario actual
      const userAppointments = await AppointmentService.getAppointments({
        clientId: user?.id,
      })
      setAppointments(userAppointments)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

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

  const getStatusIcon = (status: AppointmentStatus) => {
    const icons = {
      [AppointmentStatus.SCHEDULED]: <Calendar className="h-4 w-4" />,
      [AppointmentStatus.CONFIRMED]: <CheckCircle className="h-4 w-4" />,
      [AppointmentStatus.IN_PROGRESS]: <RefreshCw className="h-4 w-4" />,
      [AppointmentStatus.COMPLETED]: <CheckCircle className="h-4 w-4" />,
      [AppointmentStatus.CANCELLED]: <XCircle className="h-4 w-4" />,
      [AppointmentStatus.NO_SHOW]: <AlertCircle className="h-4 w-4" />,
      [AppointmentStatus.RESCHEDULED]: <Calendar className="h-4 w-4" />,
    }
    return icons[status] || <Calendar className="h-4 w-4" />
  }

  const filterAppointments = (appointments: Appointment[], filter: string) => {
    const now = new Date()
    const filtered = appointments.filter((apt) => {
      const appointmentDate = new Date(apt.date)

      switch (filter) {
        case 'proximas':
          return (
            appointmentDate >= now && apt.status !== AppointmentStatus.CANCELLED
          )
        case 'pasadas':
          return (
            appointmentDate < now || apt.status === AppointmentStatus.COMPLETED
          )
        case 'canceladas':
          return apt.status === AppointmentStatus.CANCELLED
        default:
          return true
      }
    })

    if (searchQuery) {
      return filtered.filter(
        (apt) =>
          apt.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.veterinarian?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          apt.service?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const canCancelAppointment = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.date)
    const now = new Date()
    const hoursUntilAppointment =
      (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    return (
      (hoursUntilAppointment > 2 &&
        appointment.status === AppointmentStatus.SCHEDULED) ||
      appointment.status === AppointmentStatus.CONFIRMED
    )
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      try {
        await AppointmentService.cancelAppointment(
          appointmentId,
          'Cancelada por el cliente'
        )
        loadAppointments() // Recargar la lista
      } catch (error) {
        console.error('Error canceling appointment:', error)
        alert('Error al cancelar la cita. Por favor intenta nuevamente.')
      }
    }
  }

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Necesitas iniciar sesión para ver tus citas.{' '}
            <Link href="/login" className="underline">
              Iniciar sesión
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const proximasCitas = filterAppointments(appointments, 'proximas')
  const pasadasCitas = filterAppointments(appointments, 'pasadas')
  const canceladasCitas = filterAppointments(appointments, 'canceladas')

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mis Citas</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus citas veterinarias
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/servicios">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por servicio, veterinario o motivo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proximas" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Próximas ({proximasCitas.length})
          </TabsTrigger>
          <TabsTrigger value="pasadas" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Pasadas ({pasadasCitas.length})
          </TabsTrigger>
          <TabsTrigger value="canceladas" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Canceladas ({canceladasCitas.length})
          </TabsTrigger>
        </TabsList>

        {/* Próximas Citas */}
        <TabsContent value="proximas" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Cargando citas...</p>
            </div>
          ) : proximasCitas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No tienes citas próximas
                </h3>
                <p className="text-muted-foreground mb-4">
                  ¡Agenda una cita con nuestros veterinarios especializados!
                </p>
                <Button asChild>
                  <Link href="/servicios">
                    <Plus className="h-4 w-4 mr-2" />
                    Agendar Cita
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            proximasCitas.map((appointment) => (
              <Card
                key={appointment.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">
                            {getStatusLabel(appointment.status)}
                          </span>
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(
                            new Date(appointment.date),
                            'EEEE, d MMMM yyyy',
                            { locale: es }
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-2">
                        {appointment.service?.name || appointment.reason}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.veterinarian?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Mascota:</span>
                          <span>{appointment.pet?.name}</span>
                        </div>
                      </div>

                      {appointment.symptoms && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-md">
                          <p className="text-sm">
                            <strong>Síntomas:</strong> {appointment.symptoms}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/mis-citas/${appointment.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalle
                        </Link>
                      </Button>

                      {canCancelAppointment(appointment) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleCancelAppointment(appointment.id)
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Citas Pasadas */}
        <TabsContent value="pasadas" className="space-y-4">
          {pasadasCitas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No tienes citas pasadas
                </h3>
                <p className="text-muted-foreground">
                  Aquí aparecerán tus citas completadas
                </p>
              </CardContent>
            </Card>
          ) : (
            pasadasCitas.map((appointment) => (
              <Card key={appointment.id} className="opacity-75">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">
                            {getStatusLabel(appointment.status)}
                          </span>
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(
                            new Date(appointment.date),
                            'EEEE, d MMMM yyyy',
                            { locale: es }
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-2">
                        {appointment.service?.name || appointment.reason}
                      </h3>

                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.veterinarian?.name}</span>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/mis-citas/${appointment.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalle
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Citas Canceladas */}
        <TabsContent value="canceladas" className="space-y-4">
          {canceladasCitas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No tienes citas canceladas
                </h3>
                <p className="text-muted-foreground">
                  Aquí aparecerán las citas que hayas cancelado
                </p>
              </CardContent>
            </Card>
          ) : (
            canceladasCitas.map((appointment) => (
              <Card key={appointment.id} className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1">
                            {getStatusLabel(appointment.status)}
                          </span>
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(
                            new Date(appointment.date),
                            'EEEE, d MMMM yyyy',
                            { locale: es }
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-2">
                        {appointment.service?.name || appointment.reason}
                      </h3>

                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.veterinarian?.name}</span>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/mis-citas/${appointment.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalle
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
