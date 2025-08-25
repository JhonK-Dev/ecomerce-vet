'use client'

import { useState, useEffect } from 'react'
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
import { Edit, Heart } from 'lucide-react'
import {
  Pet,
  PetSpecies,
  PetGender,
} from '@/types/medical-records'
import { MedicalRecordService } from '@/lib/medical-records'

interface EditPetDialogProps {
  pet: Pet
  onPetUpdated?: (pet: Pet) => void
  trigger?: React.ReactNode
}

export function EditPetDialog({
  pet,
  onPetUpdated,
  trigger,
}: EditPetDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    birthDate: pet.birthDate.toISOString().split('T')[0],
    gender: pet.gender,
    weight: pet.weight.toString(),
    color: pet.color,
    microchipNumber: pet.microchipNumber || '',
    ownerName: pet.ownerName,
    ownerPhone: pet.ownerPhone,
    ownerEmail: pet.ownerEmail,
    ownerAddress: pet.ownerAddress,
    emergencyContactName: pet.emergencyContact?.name || '',
    emergencyContactPhone: pet.emergencyContact?.phone || '',
    emergencyContactRelationship: pet.emergencyContact?.relationship || '',
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        birthDate: pet.birthDate.toISOString().split('T')[0],
        gender: pet.gender,
        weight: pet.weight.toString(),
        color: pet.color,
        microchipNumber: pet.microchipNumber || '',
        ownerName: pet.ownerName,
        ownerPhone: pet.ownerPhone,
        ownerEmail: pet.ownerEmail,
        ownerAddress: pet.ownerAddress,
        emergencyContactName: pet.emergencyContact?.name || '',
        emergencyContactPhone: pet.emergencyContact?.phone || '',
        emergencyContactRelationship: pet.emergencyContact?.relationship || '',
      })
    }
  }, [open, pet])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.breed || !formData.birthDate) return

    try {
      setLoading(true)
      
      const updateData: Partial<Pet> = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        birthDate: new Date(formData.birthDate),
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        color: formData.color,
        microchipNumber: formData.microchipNumber || undefined,
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail,
        ownerAddress: formData.ownerAddress,
      }

      // Agregar contacto de emergencia si se proporciona
      if (formData.emergencyContactName && formData.emergencyContactPhone) {
        updateData.emergencyContact = {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship,
        }
      }

      const updatedPet = await MedicalRecordService.updatePet(pet.id, updateData)
      if (updatedPet) {
        onPetUpdated?.(updatedPet)
        setOpen(false)
        // Forzar recarga de la página para mostrar cambios
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating pet:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Editar Información de {pet.name}
          </DialogTitle>
          <DialogDescription>
            Actualiza la información de la mascota.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Especie</Label>
              <Select
                value={formData.species}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, species: value as PetSpecies }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PetSpecies).map((species) => (
                    <SelectItem key={species} value={species}>
                      {MedicalRecordService.getSpeciesLabel(species)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed">Raza</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, breed: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value as PetGender }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PetGender).map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {MedicalRecordService.getGenderLabel(gender)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
                }
                required
              />
            </div>

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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, color: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="microchipNumber">Número de Microchip (opcional)</Label>
            <Input
              id="microchipNumber"
              value={formData.microchipNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, microchipNumber: e.target.value }))
              }
              placeholder="Ej: 982000123456789"
            />
          </div>

          {/* Información del propietario */}
          <div className="space-y-4">
            <h4 className="font-semibold">Información del Propietario</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Nombre Completo</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ownerName: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Teléfono</Label>
                <Input
                  id="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ownerPhone: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Email</Label>
              <Input
                id="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ownerEmail: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerAddress">Dirección</Label>
              <Textarea
                id="ownerAddress"
                value={formData.ownerAddress}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ownerAddress: e.target.value }))
                }
                rows={2}
                required
              />
            </div>
          </div>

          {/* Contacto de emergencia */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contacto de Emergencia (opcional)</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Nombre</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, emergencyContactName: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Teléfono</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, emergencyContactPhone: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelationship">Relación</Label>
              <Input
                id="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, emergencyContactRelationship: e.target.value }))
                }
                placeholder="Ej: Familiar, Amigo, Vecino"
              />
            </div>
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}