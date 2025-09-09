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
import { Plus, Stethoscope } from 'lucide-react'
import {
  MedicalRecord,
  MedicalRecordType,
  Pet,
} from '@/types/medical-records'
import { MedicalRecordService } from '@/lib/medical-records'

interface CreateMedicalRecordDialogProps {
  petId?: string
  pets?: Pet[]
  onRecordCreated?: (record: MedicalRecord) => void
  trigger?: React.ReactNode
}

export function CreateMedicalRecordDialog({
  petId,
  pets = [],
  onRecordCreated,
  trigger,
}: CreateMedicalRecordDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    petId: petId || '',
    type: MedicalRecordType.CONSULTATION,
    title: '',
    description: '',
    diagnosis: '',
    treatment: '',
    weight: '',
    temperature: '',
    heartRate: '',
    respiratoryRate: '',
    notes: '',
    followUpDate: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.petId || !formData.title || !formData.description) return

    try {
      setLoading(true)
      
      const recordData = {
        petId: formData.petId,
        veterinarianId: 'current_vet', // En producción usar el ID del veterinario actual
        date: new Date(),
        type: formData.type,
        title: formData.title,
        description: formData.description,
        diagnosis: formData.diagnosis || undefined,
        treatment: formData.treatment || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        notes: formData.notes || undefined,
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : undefined,
        vitalSigns: {
          heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
          respiratoryRate: formData.respiratoryRate ? parseInt(formData.respiratoryRate) : undefined,
          temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
        },
        medications: [],
        vaccinations: [],
        allergies: [],
        surgeries: [],
        labResults: [],
        images: [],
        documents: [],
        isPrivate: false,
      }

      const newRecord = await MedicalRecordService.createMedicalRecord(recordData)
      onRecordCreated?.(newRecord)
      setOpen(false)
      // Forzar recarga para mostrar el nuevo registro
      window.location.reload()
      
      // Resetear formulario
      setFormData({
        petId: petId || '',
        type: MedicalRecordType.CONSULTATION,
        title: '',
        description: '',
        diagnosis: '',
        treatment: '',
        weight: '',
        temperature: '',
        heartRate: '',
        respiratoryRate: '',
        notes: '',
        followUpDate: '',
      })
    } catch (error) {
      console.error('Error creating medical record:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRecordTypeLabel = (type: MedicalRecordType) => {
    const labels = {
      [MedicalRecordType.CONSULTATION]: 'Consulta',
      [MedicalRecordType.VACCINATION]: 'Vacunación',
      [MedicalRecordType.SURGERY]: 'Cirugía',
      [MedicalRecordType.EMERGENCY]: 'Emergencia',
      [MedicalRecordType.CHECKUP]: 'Chequeo',
      [MedicalRecordType.LABORATORY]: 'Laboratorio',
      [MedicalRecordType.IMAGING]: 'Imágenes',
      [MedicalRecordType.TREATMENT]: 'Tratamiento',
      [MedicalRecordType.FOLLOW_UP]: 'Seguimiento',
    }
    return labels[type]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Consulta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            Nuevo Registro Médico
          </DialogTitle>
          <DialogDescription>
            Crea un nuevo registro en la historia clínica de la mascota.
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

          {/* Tipo de registro */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Registro</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value as MedicalRecordType }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(MedicalRecordType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {getRecordTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Información básica */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ej: Consulta de rutina, Vacunación anual"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe el motivo de la consulta o procedimiento..."
              rows={3}
              required
            />
          </div>

          {/* Diagnóstico y tratamiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnóstico</Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))
                }
                placeholder="Diagnóstico clínico..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Tratamiento</Label>
              <Textarea
                id="treatment"
                value={formData.treatment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, treatment: e.target.value }))
                }
                placeholder="Plan de tratamiento..."
                rows={3}
              />
            </div>
          </div>

          {/* Signos vitales */}
          <div className="space-y-3">
            <h4 className="font-semibold">Signos Vitales</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, weight: e.target.value }))
                  }
                  placeholder="0.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperatura (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, temperature: e.target.value }))
                  }
                  placeholder="38.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heartRate">Freq. Cardíaca (lpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={formData.heartRate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, heartRate: e.target.value }))
                  }
                  placeholder="80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Freq. Respiratoria (rpm)</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  value={formData.respiratoryRate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, respiratoryRate: e.target.value }))
                  }
                  placeholder="20"
                />
              </div>
            </div>
          </div>

          {/* Notas y seguimiento */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Observaciones adicionales..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpDate">Fecha de Seguimiento (opcional)</Label>
            <Input
              id="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, followUpDate: e.target.value }))
              }
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
              {loading ? 'Creando...' : 'Crear Registro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}