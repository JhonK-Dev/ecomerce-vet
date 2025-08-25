'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Bell } from 'lucide-react'
import {
  AlertType,
  AlertPriority,
  MedicalAlert,
  Pet,
} from '@/types/medical-records'
import { MedicalRecordService } from '@/lib/medical-records'

interface CreateAlertDialogProps {
  petId?: string
  pets?: Pet[]
  onAlertCreated?: (alert: MedicalAlert) => void
  trigger?: React.ReactNode
}

export function CreateAlertDialog({
  petId,
  pets = [],
  onAlertCreated,
  trigger,
}: CreateAlertDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    petId: petId || '',
    type: AlertType.CUSTOM,
    title: '',
    description: '',
    dueDate: '',
    priority: AlertPriority.MEDIUM,
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.petId || !formData.title || !formData.dueDate) return

    try {
      setLoading(true)
      const alertData = {
        petId: formData.petId,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate),
        priority: formData.priority,
        isCompleted: false,
        createdBy: 'current_user', // En producción usar el ID del usuario actual
        assignedTo: 'pet_owner', // En producción usar el ID del propietario
        notes: formData.notes,
      }

      const newAlert = await MedicalRecordService.createAlert(alertData)
      onAlertCreated?.(newAlert)
      setOpen(false)
      // Forzar recarga para mostrar la nueva alerta
      window.location.reload()
      
      // Resetear formulario
      setFormData({
        petId: petId || '',
        type: AlertType.CUSTOM,
        title: '',
        description: '',
        dueDate: '',
        priority: AlertPriority.MEDIUM,
        notes: '',
      })
    } catch (error) {
      console.error('Error creating alert:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAlertTypeLabel = (type: AlertType) => {
    const labels = {
      [AlertType.VACCINATION_DUE]: 'Vacuna Pendiente',
      [AlertType.MEDICATION_REMINDER]: 'Recordatorio de Medicamento',
      [AlertType.FOLLOW_UP_APPOINTMENT]: 'Cita de Seguimiento',
      [AlertType.ANNUAL_CHECKUP]: 'Chequeo Anual',
      [AlertType.DENTAL_CLEANING]: 'Limpieza Dental',
      [AlertType.WEIGHT_CHECK]: 'Control de Peso',
      [AlertType.CUSTOM]: 'Personalizado',
    }
    return labels[type]
  }

  const getPriorityLabel = (priority: AlertPriority) => {
    const labels = {
      [AlertPriority.LOW]: 'Baja',
      [AlertPriority.MEDIUM]: 'Media',
      [AlertPriority.HIGH]: 'Alta',
      [AlertPriority.URGENT]: 'Urgente',
    }
    return labels[priority]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Alerta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Crear Nueva Alerta
          </DialogTitle>
          <DialogDescription>
            Crea una nueva alerta o recordatorio para la mascota.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selección de mascota (si no está predefinida) */}
          {!petId && pets.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="petId">Mascota</Label>
              <Select
                value={formData.petId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, petId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una mascota" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} ({MedicalRecordService.getSpeciesLabel(pet.species)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tipo de alerta */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Alerta</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value as AlertType }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AlertType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {getAlertTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ej: Vacuna antirrábica"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe los detalles de la alerta..."
              rows={3}
            />
          </div>

          {/* Fecha límite */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha Límite</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              required
            />
          </div>

          {/* Prioridad */}
          <div className="space-y-2">
            <Label htmlFor="priority">Prioridad</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, priority: value as AlertPriority }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AlertPriority).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {getPriorityLabel(priority)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notas adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Notas adicionales (opcional)..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Alerta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}