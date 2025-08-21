'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'; // Removed: module not found
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Calendar } from '@/components/ui/calendar'; // Removed: module not found
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  DollarSign,
} from 'lucide-react'
import {
  VeterinaryService,
  Veterinarian,
  AppointmentPriority,
} from '@/types/veterinary'
import { VeterinarianService } from '@/lib/veterinarians'
import { AppointmentService } from '@/lib/appointments'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AppointmentBookingProps {
  service: VeterinaryService
  onBookingComplete?: (appointmentId: string) => void
  onCancel?: () => void
}

export function AppointmentBooking({
  service,
  onBookingComplete,
  onCancel,
}: AppointmentBookingProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedVeterinarian, setSelectedVeterinarian] = useState<string>('')
  const [selectedPet, setSelectedPet] = useState<string>('')
  const [reason, setReason] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [priority, setPriority] = useState<AppointmentPriority>(
    AppointmentPriority.NORMAL
  )
  const [notes, setNotes] = useState('')

  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  // const [pets, setPets] = useState<Pet[]>([]); // Removed: unused
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Cargar veterinarios al montar el componente
  useEffect(() => {
    const loadVeterinarians = async () => {
      try {
        const allVets = await VeterinarianService.getAllVeterinarians()
        // Filtrar veterinarios que pueden realizar este servicio
        const compatibleVets = allVets.filter(
          (vet) =>
            service.veterinarianSpecialty?.some((specialty) =>
              vet.specialties.includes(specialty)
            ) || service.veterinarianSpecialty?.length === 0
        )
        setVeterinarians(compatibleVets)
      } catch {
        setError('Error al cargar veterinarios')
      }
    }

    loadVeterinarians()
    // Aquí también cargarías las mascotas del usuario actual
    // setPets(await getUserPets());
  }, [service])

  // Cargar horarios disponibles cuando se selecciona fecha y veterinario
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !selectedVeterinarian) return
      try {
        setIsLoading(true)
        const slots = await VeterinarianService.getAvailableSlots(
          selectedVeterinarian,
          selectedDate,
          service.duration
        )
        setAvailableSlots(slots)
      } catch {
        setError('Error al cargar horarios disponibles')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSlots()
  }, [selectedDate, selectedVeterinarian, service.duration])

  // Removed loadAvailableSlots, logic moved to useEffect above

  // Removed unused handleDateSelect function

  const handleBookAppointment = async () => {
    if (
      !selectedDate ||
      !selectedTime ||
      !selectedVeterinarian ||
      !selectedPet
    ) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      // Calcular hora de fin
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const endTime = new Date()
      endTime.setHours(hours, minutes + service.duration)
      const endTimeString = format(endTime, 'HH:mm')

      const appointmentData = {
        clientId: 'current_user_id', // Obtener del contexto de usuario
        petId: selectedPet,
        veterinarianId: selectedVeterinarian,
        serviceId: service.id,
        date: selectedDate,
        startTime: selectedTime,
        endTime: endTimeString,
        status: 'scheduled', // Replace with correct type if available
        priority,
        reason,
        symptoms,
        notes,
        followUpRequired: false,
        remindersSent: [],
        paymentStatus: 'pending', // Replace with correct type if available
        totalCost: service.price,
      }

      const newAppointment = await AppointmentService.createAppointment(
        appointmentData
      )

      if (onBookingComplete) {
        onBookingComplete(newAppointment.id)
      }

      setStep(4) // Mostrar confirmación
    } catch {
      setError('Error al crear la cita. Por favor intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Seleccionar Fecha y Veterinario
              </h3>

              {/* Selección de Veterinario */}
              <div className="space-y-3 mb-6">
                <Label>Veterinario</Label>
                <Select
                  value={selectedVeterinarian}
                  onValueChange={setSelectedVeterinarian}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un veterinario" />
                  </SelectTrigger>
                  <SelectContent>
                    {veterinarians.map((vet) => (
                      <SelectItem key={vet.id} value={vet.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{vet.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {vet.specialties.join(', ')}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Calendario */}
              <div className="space-y-3">
                <Label>Fecha</Label>
                <input
                  type="date"
                  value={
                    selectedDate ? selectedDate.toISOString().split('T')[0] : ''
                  }
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value ? new Date(e.target.value) : undefined
                    )
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className="rounded-md border p-2"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Seleccionar Horario
              </h3>

              {selectedDate && (
                <div className="mb-4">
                  <Badge variant="outline" className="mb-4">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}
                  </Badge>
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">
                    Cargando horarios...
                  </p>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? 'default' : 'outline'}
                      onClick={() => setSelectedTime(slot)}
                      className="justify-center"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {slot}
                    </Button>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay horarios disponibles para la fecha seleccionada. Por
                    favor selecciona otra fecha.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Información de la Cita
              </h3>

              {/* Selección de Mascota */}
              <div className="space-y-3 mb-6">
                <Label>Mascota *</Label>
                <Select value={selectedPet} onValueChange={setSelectedPet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu mascota" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Aquí irían las mascotas del usuario */}
                    <SelectItem value="pet1">Max (Perro)</SelectItem>
                    <SelectItem value="pet2">Luna (Gato)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Motivo de la consulta */}
              <div className="space-y-3 mb-6">
                <Label>Motivo de la consulta *</Label>
                <Input
                  placeholder="Ej: Consulta de rutina, vacunación..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {/* Síntomas */}
              <div className="space-y-3 mb-6">
                <Label>Síntomas (opcional)</Label>
                <textarea
                  placeholder="Describe los síntomas que has observado..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={3}
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Prioridad */}
              <div className="space-y-3 mb-6">
                <Label>Prioridad</Label>
                <Select
                  value={priority}
                  onValueChange={(value) =>
                    setPriority(value as AppointmentPriority)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AppointmentPriority.LOW}>
                      Baja
                    </SelectItem>
                    <SelectItem value={AppointmentPriority.NORMAL}>
                      Normal
                    </SelectItem>
                    <SelectItem value={AppointmentPriority.HIGH}>
                      Alta
                    </SelectItem>
                    <SelectItem value={AppointmentPriority.EMERGENCY}>
                      Emergencia
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notas adicionales */}
              <div className="space-y-3">
                <Label>Notas adicionales (opcional)</Label>
                <textarea
                  placeholder="Información adicional que consideres importante..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                ¡Cita Reservada Exitosamente!
              </h3>
              <p className="text-muted-foreground">
                Tu cita ha sido programada. Recibirás un correo de confirmación
                y recordatorios antes de tu cita.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Servicio:</span>
                <span className="font-medium">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span className="font-medium">
                  {selectedDate &&
                    format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hora:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Duración:</span>
                <span className="font-medium">{service.duration} minutos</span>
              </div>
              <div className="flex justify-between">
                <span>Costo:</span>
                <span className="font-medium">
                  S/. {service.price.toFixed(2)}
                </span>
              </div>
            </div>

            <Button onClick={onCancel} className="w-full">
              Finalizar
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return selectedDate && selectedVeterinarian
      case 2:
        return selectedTime
      case 3:
        return selectedPet && reason.trim()
      default:
        return false
    }
  }

  if (step === 4) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">{renderStepContent()}</CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Reservar Cita - {service.name}
        </CardTitle>

        {/* Indicador de pasos */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${
                  step >= stepNumber
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }
              `}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`
                  w-8 h-0.5 mx-2
                  ${step > stepNumber ? 'bg-primary' : 'bg-muted'}
                `}
                />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información del servicio */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{service.name}</h4>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {service.duration} min
              </div>
              <div className="flex items-center gap-1 font-medium">
                <DollarSign className="h-4 w-4" />
                S/. {service.price.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Contenido del paso actual */}
        {renderStepContent()}

        {/* Botones de navegación */}
        <div className="flex justify-between pt-6">
          <div>
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
              >
                Anterior
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceedToNextStep() || isLoading}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleBookAppointment}
                disabled={!canProceedToNextStep() || isLoading}
              >
                {isLoading ? 'Reservando...' : 'Confirmar Cita'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
