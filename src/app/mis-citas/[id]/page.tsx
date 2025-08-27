'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Trash2,
} from 'lucide-react'
import { Appointment, AppointmentStatus } from '@/types/veterinary'
import { AppointmentService } from '@/lib/appointments'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

export default function CitaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const appointmentId = params.id as string

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAppointment = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const appointmentData = await AppointmentService.getAppointmentById(
        appointmentId
      )

      if (!appointmentData) {
        setError('Cita no encontrada')
        return
      }

      // Verificar que la cita pertenece al usuario actual
      if (appointmentData.clientId !== user?.id) {
        setError('No tienes permiso para ver esta cita')
        return
      }

      setAppointment(appointmentData)
    } catch (err) {
      setError('Error al cargar la cita')
      console.error('Error loading appointment:', err)
    } finally {
      setLoading(false)
    }
  }, [appointmentId, user?.id])

  useEffect(() => {
    if (isLoaded && user && appointmentId) {
      loadAppointment()
    }
  }, [isLoaded, user, appointmentId, loadAppointment])

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
      [AppointmentStatus.IN_PROGRESS]: <Clock className="h-4 w-4" />,
      [AppointmentStatus.COMPLETED]: <CheckCircle className="h-4 w-4" />,
      [AppointmentStatus.CANCELLED]: <XCircle className="h-4 w-4" />,
      [AppointmentStatus.NO_SHOW]: <AlertCircle className="h-4 w-4" />,
      [AppointmentStatus.RESCHEDULED]: <Calendar className="h-4 w-4" />,
    }
    return icons[status] || <Calendar className="h-4 w-4" />
  }

  const canCancelAppointment = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.date)
    const now = new Date()
    const hoursUntilAppointment =
      (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    return (
      hoursUntilAppointment > 2 &&
      (appointment.status === AppointmentStatus.SCHEDULED ||
        appointment.status === AppointmentStatus.CONFIRMED)
    )
  }

  const handleCancelAppointment = async () => {
    if (!appointment) return

    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      try {
        await AppointmentService.cancelAppointment(
          appointment.id,
          'Cancelada por el cliente'
        )
        router.push('/mis-citas')
      } catch (error) {
        console.error('Error canceling appointment:', error)
        alert('Error al cancelar la cita. Por favor intenta nuevamente.')
      }
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando cita...</p>
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
            Necesitas iniciar sesión para ver esta cita.{' '}
            <Link href="/login" className="underline">
              Iniciar sesión
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Cita no encontrada'}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Detalle de Cita</h1>
          <p className="text-muted-foreground">
            Información completa de tu cita veterinaria
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estado y Fecha */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(appointment.status)}
                  {appointment.service?.name || appointment.reason}
                </CardTitle>
                <Badge className={getStatusColor(appointment.status)}>
                  {getStatusLabel(appointment.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {format(new Date(appointment.date), 'EEEE, d MMMM yyyy', {
                        locale: es,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Fecha de la cita
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {appointment.startTime} - {appointment.endTime}
                    </p>
                    <p className="text-sm text-muted-foreground">Horario</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Veterinario */}
          <Card>
            <CardHeader>
              <CardTitle>Veterinario Asignado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {appointment.veterinarian?.name}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {appointment.veterinarian?.specialties?.join(', ') ||
                      'Veterinario General'}
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>Contacto disponible en clínica</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Clínica Veterinaria EcommerceVet</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de la Mascota */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Mascota</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {appointment.pet?.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Especie:</span>
                      <p className="font-medium">
                        {appointment.pet?.species || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Raza:</span>
                      <p className="font-medium">No especificado</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Edad:</span>
                      <p className="font-medium">No especificado</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Peso:</span>
                      <p className="font-medium">No especificado</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motivo y Síntomas */}
          <Card>
            <CardHeader>
              <CardTitle>Motivo de la Consulta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Motivo:</h4>
                <p className="text-muted-foreground">{appointment.reason}</p>
              </div>

              {appointment.symptoms && (
                <div>
                  <h4 className="font-medium mb-2">Síntomas:</h4>
                  <p className="text-muted-foreground">
                    {appointment.symptoms}
                  </p>
                </div>
              )}

              {appointment.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notas adicionales:</h4>
                  <p className="text-muted-foreground">{appointment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notas del Veterinario (si existen) */}
          {appointment.diagnosis && (
            <Card>
              <CardHeader>
                <CardTitle>Diagnóstico del Veterinario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">{appointment.diagnosis}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canCancelAppointment(appointment) && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancelAppointment}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancelar Cita
                </Button>
              )}

              <Button variant="outline" className="w-full" asChild>
                <Link href="/servicios">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Nueva Cita
                </Link>
              </Button>

              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Descargar Comprobante
              </Button>
            </CardContent>
          </Card>

          {/* Información de Pago */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Costo del servicio:</span>
                  <span className="font-medium">
                    S/. {appointment.totalCost?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estado de pago:</span>
                  <Badge
                    variant={
                      appointment.paymentStatus === 'paid'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {appointment.paymentStatus === 'paid'
                      ? 'Pagado'
                      : 'Pendiente'}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>S/. {appointment.totalCost?.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle>¿Necesitas ayuda?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>(01) 234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>info@ecommercevet.com</span>
              </div>
              <p className="text-muted-foreground">
                Puedes cancelar tu cita hasta 2 horas antes sin costo adicional.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
