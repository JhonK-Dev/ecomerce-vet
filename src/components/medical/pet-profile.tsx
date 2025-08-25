'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Edit,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Stethoscope,
} from 'lucide-react'
import { Pet, MedicalAlert, MedicalStats } from '@/types/medical-records'
import { MedicalRecordService } from '@/lib/medical-records'
import { EditPetDialog } from './edit-pet-dialog'
import { CreateMedicalRecordDialog } from './create-medical-record-dialog'
import { cn } from '@/lib/utils'

interface PetProfileProps {
  pet: Pet
  onEdit?: () => void
  onAddRecord?: () => void
  showOwnerInfo?: boolean
  className?: string
}

export function PetProfile({
  pet,
  onAddRecord,
  showOwnerInfo = true,
  className,
}: PetProfileProps) {
  const [alerts, setAlerts] = useState<MedicalAlert[]>([])
  const [stats, setStats] = useState<MedicalStats | null>(null)
  const [loading, setLoading] = useState(true)

  const loadPetData = useCallback(async () => {
    try {
      setLoading(true)
      const [petAlerts, petStats] = await Promise.all([
        MedicalRecordService.getAlertsByPet(pet.id),
        MedicalRecordService.getMedicalStats(pet.id),
      ])
      setAlerts(petAlerts)
      setStats(petStats)
    } catch (error) {
      console.error('Error loading pet data:', error)
    } finally {
      setLoading(false)
    }
  }, [pet.id])

  useEffect(() => {
    loadPetData()
  }, [loadPetData])

  const age = MedicalRecordService.formatAge(pet.birthDate)
  const species = MedicalRecordService.getSpeciesLabel(pet.species)
  const gender = MedicalRecordService.getGenderLabel(pet.gender)

  const urgentAlerts = alerts.filter(
    (alert) =>
      !alert.isCompleted &&
      alert.dueDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // próximos 7 días
  )

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                {pet.profileImage ? (
                  <Image
                    src={pet.profileImage}
                    alt={pet.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              {!pet.isActive && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
              )}
            </div>

            <div>
              <CardTitle className="text-2xl">{pet.name}</CardTitle>
              <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                <span>{species}</span>
                <span>•</span>
                <span>{pet.breed}</span>
                <span>•</span>
                <span>{age}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge
                  variant={
                    pet.gender.includes('neutered') ||
                    pet.gender.includes('spayed')
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {gender}
                </Badge>
                {pet.microchipNumber && (
                  <Badge variant="outline" className="text-xs">
                    Chip: {pet.microchipNumber}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <EditPetDialog
              pet={pet}
              onPetUpdated={(updatedPet) => {
                // La actualización se maneja en el componente padre
                console.log('Pet updated:', updatedPet)
              }}
              trigger={
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              }
            />
            {onAddRecord && (
              <CreateMedicalRecordDialog
                petId={pet.id}
                onRecordCreated={(record) => {
                  console.log('Record created:', record)
                  onAddRecord()
                }}
                trigger={
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Consulta
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Alertas Urgentes */}
        {loading ? (
          <div className="py-4 flex justify-center">
            <div className="animate-pulse">Cargando...</div>
          </div>
        ) : (
          urgentAlerts.length > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Atención:</strong> {urgentAlerts.length} alerta
                {urgentAlerts.length > 1 ? 's' : ''} próxima
                {urgentAlerts.length > 1 ? 's' : ''}
                <div className="mt-2 space-y-1">
                  {urgentAlerts.slice(0, 2).map((alert) => (
                    <div key={alert.id} className="text-sm">
                      • {alert.title} - {alert.dueDate.toLocaleDateString()}
                    </div>
                  ))}
                  {urgentAlerts.length > 2 && (
                    <div className="text-sm">
                      • Y {urgentAlerts.length - 2} más...
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )
        )}

        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center">
              <Stethoscope className="w-4 h-4 mr-2" />
              Información Médica
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peso:</span>
                <span className="font-medium">{pet.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Color:</span>
                <span className="font-medium">{pet.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Fecha de Nacimiento:
                </span>
                <span className="font-medium">
                  {pet.birthDate.toLocaleDateString()}
                </span>
              </div>
              {stats && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consultas:</span>
                  <span className="font-medium">{stats.totalRecords}</span>
                </div>
              )}
            </div>
          </div>

          {showOwnerInfo && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center">
                <User className="w-4 h-4 mr-2" />
                Propietario
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">{pet.ownerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <span>{pet.ownerPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3 text-muted-foreground" />
                  <span>{pet.ownerEmail}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3 h-3 text-muted-foreground mt-0.5" />
                  <span className="text-xs leading-relaxed">
                    {pet.ownerAddress}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contacto de Emergencia */}
        {pet.emergencyContact && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center text-red-600">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Contacto de Emergencia
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span className="font-medium">
                    {pet.emergencyContact.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span className="font-medium">
                    {pet.emergencyContact.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Relación:</span>
                  <span className="font-medium">
                    {pet.emergencyContact.relationship}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Estadísticas de Salud */}
        {loading ? (
          <div className="py-4 flex justify-center">
            <div className="animate-pulse">Cargando información...</div>
          </div>
        ) : (
          stats && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Estado de Salud
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.vaccinationStatus.upToDate}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Vacunas al día
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.vaccinationStatus.upcoming}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Próximas
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-red-600">
                      {stats.vaccinationStatus.overdue}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Vencidas
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}

        {/* Próximas Citas/Alertas */}
        {loading ? (
          <div className="py-4 flex justify-center">
            <div className="animate-pulse">Cargando alertas...</div>
          </div>
        ) : (
          alerts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Próximas Alertas
                </h4>
                <div className="space-y-2">
                  {alerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            alert.priority === 'urgent'
                              ? 'bg-red-500'
                              : alert.priority === 'high'
                              ? 'bg-orange-500'
                              : alert.priority === 'medium'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          )}
                        />
                        <span className="text-sm font-medium">
                          {alert.title}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {alert.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {alerts.length > 3 && (
                    <div className="text-center">
                      <Button variant="ghost" size="sm">
                        Ver todas las alertas ({alerts.length})
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )
        )}
      </CardContent>
    </Card>
  )
}
