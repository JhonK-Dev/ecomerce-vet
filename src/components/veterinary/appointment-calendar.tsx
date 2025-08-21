'use client'

import { useState, useEffect, useCallback } from 'react'
import Calendar from 'react-calendar'

import 'react-calendar/dist/Calendar.css'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react'
import {
  Appointment,
  AppointmentStatus,
  Veterinarian,
  VeterinaryService,
} from '@/types/veterinary'
import { AppointmentService } from '@/lib/appointments'
import { VeterinarianService } from '@/lib/veterinarians'
import { VeterinaryServiceService } from '@/lib/veterinary-services'
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns'
import { es } from 'date-fns/locale'

interface AppointmentCalendarProps {
  veterinarianId?: string
  onAppointmentSelect?: (appointment: Appointment) => void
  onDateSelect?: (date: Date) => void
  showCreateButton?: boolean
  className?: string
}

export function AppointmentCalendar({
  veterinarianId,
  onAppointmentSelect,
  onDateSelect,
  showCreateButton = true,
  className,
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([])
  const [services, setServices] = useState<VeterinaryService[]>([])
  const [selectedVeterinarian, setSelectedVeterinarian] = useState<string>(
    veterinarianId || 'all'
  )
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const startDate =
        viewMode === 'month'
          ? startOfWeek(selectedDate, { weekStartsOn: 1 })
          : viewMode === 'week'
          ? startOfWeek(selectedDate, { weekStartsOn: 1 })
          : selectedDate
      const endDate =
        viewMode === 'month'
          ? endOfWeek(addDays(selectedDate, 30), { weekStartsOn: 1 })
          : viewMode === 'week'
          ? endOfWeek(selectedDate, { weekStartsOn: 1 })
          : selectedDate
      let appointmentsData: Appointment[]
      if (selectedVeterinarian === 'all') {
        appointmentsData = await AppointmentService.getAppointments({
          dateFrom: startDate,
          dateTo: endDate,
        })
      } else {
        appointmentsData = await AppointmentService.getAppointments({
          veterinarianId: selectedVeterinarian,
          dateFrom: startDate,
          dateTo: endDate,
        })
      }
      setAppointments(appointmentsData)
    } catch (err) {
      setError('Error al cargar las citas')
      console.error('Error loading appointments:', err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedDate, selectedVeterinarian, viewMode])

  useEffect(() => {
    loadAppointments()
  }, [selectedDate, selectedVeterinarian, loadAppointments])

  const loadInitialData = async () => {
    try {
      const [vetsData, servicesData] = await Promise.all([
        VeterinarianService.getAllVeterinarians(),
        VeterinaryServiceService.getAllServices(),
      ])

      setVeterinarians(vetsData)
      setServices(servicesData)
    } catch (err) {
      setError('Error al cargar datos iniciales')
      console.error('Error loading initial data:', err)
    }
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appointment) =>
      isSameDay(new Date(appointment.date), date)
    )
  }

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

  const handleDateSelect = (value: Date | Date[]) => {
    const date = Array.isArray(value) ? value[0] : value
    if (date instanceof Date) {
      setSelectedDate(date)
      onDateSelect?.(date)
    }
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    onAppointmentSelect?.(appointment)
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
    })

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Headers */}
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="p-2 text-center font-medium border-b"
          >
            <div className="text-sm text-muted-foreground">
              {format(day, 'EEE', { locale: es })}
            </div>
            <div className="text-lg">{format(day, 'd')}</div>
          </div>
        ))}

        {/* Time slots */}
        {Array.from({ length: 12 }, (_, hour) => hour + 8).map((hour) => (
          <div key={hour} className="contents">
            {weekDays.map((day) => {
              const dayAppointments = getAppointmentsForDate(day).filter(
                (apt) => new Date(apt.date).getHours() === hour
              )

              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="min-h-[60px] p-1 border-r border-b"
                >
                  {hour === 8 && (
                    <div className="text-xs text-muted-foreground mb-1">
                      {hour}:00
                    </div>
                  )}
                  {dayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      onClick={() => handleAppointmentClick(appointment)}
                      className="text-xs p-1 mb-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: getStatusColor(
                          appointment.status
                        ).includes('blue')
                          ? '#dbeafe'
                          : getStatusColor(appointment.status).includes('green')
                          ? '#dcfce7'
                          : getStatusColor(appointment.status).includes(
                              'yellow'
                            )
                          ? '#fef3c7'
                          : getStatusColor(appointment.status).includes('red')
                          ? '#fee2e2'
                          : '#f3f4f6',
                      }}
                    >
                      <div className="font-medium truncate">
                        {/* {appointment.petName} */}
                      </div>
                      <div className="truncate">
                        {
                          services.find((s) => s.id === appointment.serviceId)
                            ?.name
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(selectedDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    return (
      <div className="space-y-2">
        <div className="text-lg font-semibold mb-4">
          {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}
        </div>

        {dayAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay citas programadas para este día
          </div>
        ) : (
          <div className="space-y-3">
            {dayAppointments.map((appointment) => {
              const service = services.find(
                (s) => s.id === appointment.serviceId
              )
              const veterinarian = veterinarians.find(
                (v) => v.id === appointment.veterinarianId
              )

              return (
                <Card
                  key={appointment.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {format(new Date(appointment.date), 'HH:mm')}
                        </span>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {/* <span>{appointment.petName}</span> */}
                        {/* <span className="text-muted-foreground">({appointment.petType})</span> */}
                      </div>

                      {service && (
                        <div className="text-sm text-muted-foreground">
                          {service.name}
                        </div>
                      )}

                      {veterinarian && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Stethoscope className="h-3 w-3" />
                          <span>{veterinarian.name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendario de Citas
          </CardTitle>

          {showCreateButton && (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          )}
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={selectedVeterinarian}
            onValueChange={setSelectedVeterinarian}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Seleccionar veterinario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los veterinarios</SelectItem>
              {veterinarians.map((vet) => (
                <SelectItem key={vet.id} value={vet.id}>
                  {vet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Mes
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Semana
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Día
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Navegación de fecha */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedDate(
                    addDays(
                      selectedDate,
                      viewMode === 'month' ? -30 : viewMode === 'week' ? -7 : -1
                    )
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <h3 className="text-lg font-semibold">
                {viewMode === 'month' &&
                  format(selectedDate, 'MMMM yyyy', { locale: es })}
                {viewMode === 'week' &&
                  `Semana del ${format(
                    startOfWeek(selectedDate, { weekStartsOn: 1 }),
                    'd MMM',
                    { locale: es }
                  )}`}
                {viewMode === 'day' &&
                  format(selectedDate, 'd MMMM yyyy', { locale: es })}
              </h3>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedDate(
                    addDays(
                      selectedDate,
                      viewMode === 'month' ? 30 : viewMode === 'week' ? 7 : 1
                    )
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Vista del calendario */}
            {viewMode === 'month' && (
              <Calendar
                value={selectedDate}
                onChange={handleDateSelect}
                locale={'es-ES'}
                className="rounded-md border"
              />
            )}

            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'day' && renderDayView()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
