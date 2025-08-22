'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Calendar,
  User,
  Stethoscope,
  Pill,
  Syringe,
  FileText,
  Image as ImageIcon,
  Thermometer,
  Weight,
  Heart,
  Clock,
  Eye,
  Edit,
  Download,
  AlertCircle
} from 'lucide-react'
import { MedicalRecord, MedicalRecordType } from '@/types/medical-records'
import { cn } from '@/lib/utils'

interface MedicalRecordCardProps {
  record: MedicalRecord
  onEdit?: (record: MedicalRecord) => void
  onView?: (record: MedicalRecord) => void
  showPetInfo?: boolean
  className?: string
}

export function MedicalRecordCard({ 
  record, 
  onEdit, 
  onView,
  showPetInfo = false,
  className 
}: MedicalRecordCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getRecordTypeInfo = (type: MedicalRecordType) => {
    const typeMap = {
      [MedicalRecordType.CONSULTATION]: {
        label: 'Consulta',
        icon: Stethoscope,
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      [MedicalRecordType.VACCINATION]: {
        label: 'Vacunación',
        icon: Syringe,
        color: 'bg-green-100 text-green-800 border-green-200'
      },
      [MedicalRecordType.SURGERY]: {
        label: 'Cirugía',
        icon: FileText,
        color: 'bg-red-100 text-red-800 border-red-200'
      },
      [MedicalRecordType.EMERGENCY]: {
        label: 'Emergencia',
        icon: AlertCircle,
        color: 'bg-red-100 text-red-800 border-red-200'
      },
      [MedicalRecordType.CHECKUP]: {
        label: 'Chequeo',
        icon: Heart,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      },
      [MedicalRecordType.LABORATORY]: {
        label: 'Laboratorio',
        icon: FileText,
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      },
      [MedicalRecordType.IMAGING]: {
        label: 'Imágenes',
        icon: ImageIcon,
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
      },
      [MedicalRecordType.TREATMENT]: {
        label: 'Tratamiento',
        icon: Pill,
        color: 'bg-teal-100 text-teal-800 border-teal-200'
      },
      [MedicalRecordType.FOLLOW_UP]: {
        label: 'Seguimiento',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      }
    }
    return typeMap[type]
  }

  const typeInfo = getRecordTypeInfo(record.type)
  const TypeIcon = typeInfo.icon

  const hasAttachments = (record.images && record.images.length > 0) || 
                        (record.documents && record.documents.length > 0)

  const hasMedications = record.medications && record.medications.length > 0
  const hasVaccinations = record.vaccinations && record.vaccinations.length > 0
  const hasLabResults = record.labResults && record.labResults.length > 0

  return (
    <Card className={cn("w-full hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={cn(
              "p-2 rounded-lg border",
              typeInfo.color
            )}>
              <TypeIcon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">
                {record.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{record.date.toLocaleDateString()}</span>
                <span>•</span>
                <User className="w-3 h-3" />
                <span>Dr. Veterinario</span>
              </div>
              
              {showPetInfo && record.pet && (
                <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                  <Heart className="w-3 h-3" />
                  <span>{record.pet.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={typeInfo.color}>
              {typeInfo.label}
            </Badge>
            
            {record.isPrivate && (
              <Badge variant="secondary" className="text-xs">
                Privado
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Descripción */}
        <div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {record.description}
          </p>
        </div>

        {/* Diagnóstico y Tratamiento */}
        {(record.diagnosis || record.treatment) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {record.diagnosis && (
              <div>
                <span className="font-medium text-muted-foreground">Diagnóstico:</span>
                <p className="mt-1 line-clamp-2">{record.diagnosis}</p>
              </div>
            )}
            {record.treatment && (
              <div>
                <span className="font-medium text-muted-foreground">Tratamiento:</span>
                <p className="mt-1 line-clamp-2">{record.treatment}</p>
              </div>
            )}
          </div>
        )}

        {/* Signos Vitales */}
        {record.vitalSigns && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-muted/50 rounded-lg">
            {record.vitalSigns.temperature && (
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Temp.</div>
                  <div className="font-medium">{record.vitalSigns.temperature}°C</div>
                </div>
              </div>
            )}
            {record.vitalSigns.weight && (
              <div className="flex items-center space-x-2">
                <Weight className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Peso</div>
                  <div className="font-medium">{record.vitalSigns.weight} kg</div>
                </div>
              </div>
            )}
            {record.vitalSigns.heartRate && (
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <div>
                  <div className="text-xs text-muted-foreground">FC</div>
                  <div className="font-medium">{record.vitalSigns.heartRate} lpm</div>
                </div>
              </div>
            )}
            {record.vitalSigns.respiratoryRate && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">FR</div>
                  <div className="font-medium">{record.vitalSigns.respiratoryRate} rpm</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Indicadores de contenido */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            {hasMedications && (
              <div className="flex items-center space-x-1">
                <Pill className="w-3 h-3" />
                <span>{record.medications!.length} medicamento{record.medications!.length > 1 ? 's' : ''}</span>
              </div>
            )}
            {hasVaccinations && (
              <div className="flex items-center space-x-1">
                <Syringe className="w-3 h-3" />
                <span>{record.vaccinations!.length} vacuna{record.vaccinations!.length > 1 ? 's' : ''}</span>
              </div>
            )}
            {hasLabResults && (
              <div className="flex items-center space-x-1">
                <FileText className="w-3 h-3" />
                <span>{record.labResults!.length} análisis</span>
              </div>
            )}
            {hasAttachments && (
              <div className="flex items-center space-x-1">
                <ImageIcon className="w-3 h-3" />
                <span>Archivos</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-3 h-3 mr-1" />
                  Ver detalles
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <TypeIcon className="w-5 h-5" />
                    <span>{record.title}</span>
                  </DialogTitle>
                  <DialogDescription>
                    {record.date.toLocaleDateString()} - {typeInfo.label}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Información básica */}
                  <div>
                    <h4 className="font-semibold mb-2">Descripción</h4>
                    <p className="text-sm text-muted-foreground">{record.description}</p>
                  </div>

                  {record.diagnosis && (
                    <div>
                      <h4 className="font-semibold mb-2">Diagnóstico</h4>
                      <p className="text-sm">{record.diagnosis}</p>
                    </div>
                  )}

                  {record.treatment && (
                    <div>
                      <h4 className="font-semibold mb-2">Tratamiento</h4>
                      <p className="text-sm">{record.treatment}</p>
                    </div>
                  )}

                  {/* Medicamentos */}
                  {hasMedications && (
                    <div>
                      <h4 className="font-semibold mb-2">Medicamentos</h4>
                      <div className="space-y-2">
                        {record.medications!.map((med, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="font-medium">{med.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {med.dosage} - {med.frequency} por {med.duration}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {med.instructions}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vacunas */}
                  {hasVaccinations && (
                    <div>
                      <h4 className="font-semibold mb-2">Vacunas</h4>
                      <div className="space-y-2">
                        {record.vaccinations!.map((vac, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="font-medium">{vac.vaccine}</div>
                            <div className="text-sm text-muted-foreground">
                              Marca: {vac.brand} | Lote: {vac.batchNumber}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Aplicada en: {vac.location}
                            </div>
                            {vac.nextDueDate && (
                              <div className="text-xs text-orange-600 mt-1">
                                Próxima dosis: {vac.nextDueDate.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.notes && (
                    <div>
                      <h4 className="font-semibold mb-2">Notas adicionales</h4>
                      <p className="text-sm text-muted-foreground">{record.notes}</p>
                    </div>
                  )}

                  {record.followUpDate && (
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Seguimiento programado:</strong> {record.followUpDate.toLocaleDateString()}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(record)}>
                <Edit className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}