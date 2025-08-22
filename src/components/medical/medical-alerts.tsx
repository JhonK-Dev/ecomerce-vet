'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Bell,
  Syringe,
  Pill,
  Heart,
  Plus,
  X,
  Check
} from 'lucide-react'
import { 
  MedicalAlert, 
  AlertType, 
  AlertPriority,
  Pet 
} from '@/types/medical-records'
import { MedicalRecordService } from '@/lib/medical-records'
import { cn } from '@/lib/utils'

interface MedicalAlertsProps {
  petId?: string
  ownerId?: string
  showCompleted?: boolean
  maxItems?: number
  onAlertComplete?: (alert: MedicalAlert) => void
  className?: string
}

export function MedicalAlerts({
  petId,
  ownerId,
  showCompleted = false,
  maxItems,
  onAlertComplete,
  className
}: MedicalAlertsProps) {
  const [alerts, setAlerts] = useState<MedicalAlert[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<MedicalAlert | null>(null)

  useEffect(() => {
    loadAlerts()
  }, [petId, ownerId])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      let alertsData: MedicalAlert[] = []
      let petsData: Pet[] = []

      if (petId) {
        alertsData = await MedicalRecordService.getAlertsByPet(petId)
        const pet = await MedicalRecordService.getPetById(petId)
        if (pet) petsData = [pet]
      } else if (ownerId) {
        alertsData = await MedicalRecordService.getAlertsByOwner(ownerId)
        petsData = await MedicalRecordService.getPetsByOwner(ownerId)
      } else {
        alertsData = await MedicalRecordService.getUpcomingAlerts(90)
        petsData = await MedicalRecordService.getAllPets()
      }

      // Filtrar alertas completadas si no se deben mostrar
      if (!showCompleted) {
        alertsData = alertsData.filter(alert => !alert.isCompleted)
      }

      // Limitar número de elementos si se especifica
      if (maxItems) {
        alertsData = alertsData.slice(0, maxItems)
      }

      setAlerts(alertsData)
      setPets(petsData)
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteAlert = async (alert: MedicalAlert) => {
    try {
      const updatedAlert = await MedicalRecordService.completeAlert(alert.id)
      if (updatedAlert) {
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? updatedAlert : a
        ))
        onAlertComplete?.(updatedAlert)
      }
    } catch (error) {
      console.error('Error completing alert:', error)
    }
  }

  const getAlertTypeInfo = (type: AlertType) => {
    const typeMap = {
      [AlertType.VACCINATION_DUE]: {
        label: 'Vacuna Pendiente',
        icon: Syringe,
        color: 'text-green-600'
      },
      [AlertType.MEDICATION_REMINDER]: {
        label: 'Medicamento',
        icon: Pill,
        color: 'text-blue-600'
      },
      [AlertType.FOLLOW_UP_APPOINTMENT]: {
        label: 'Seguimiento',
        icon: Calendar,
        color: 'text-purple-600'
      },
      [AlertType.ANNUAL_CHECKUP]: {
        label: 'Chequeo Anual',
        icon: Heart,
        color: 'text-red-600'
      },
      [AlertType.DENTAL_CLEANING]: {
        label: 'Limpieza Dental',
        icon: Heart,
        color: 'text-orange-600'
      },
      [AlertType.WEIGHT_CHECK]: {
        label: 'Control de Peso',
        icon: Heart,
        color: 'text-indigo-600'
      },
      [AlertType.CUSTOM]: {
        label: 'Personalizado',
        icon: Bell,
        color: 'text-gray-600'
      }
    }
    return typeMap[type]
  }

  const getPriorityInfo = (priority: AlertPriority) => {
    const priorityMap = {
      [AlertPriority.LOW]: {
        label: 'Baja',
        color: 'bg-green-100 text-green-800 border-green-200'
      },
      [AlertPriority.MEDIUM]: {
        label: 'Media',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      [AlertPriority.HIGH]: {
        label: 'Alta',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      },
      [AlertPriority.URGENT]: {
        label: 'Urgente',
        color: 'bg-red-100 text-red-800 border-red-200'
      }
    }
    return priorityMap[priority]
  }

  const isOverdue = (dueDate: Date) => {
    return dueDate < new Date()
  }

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId)
    return pet?.name || 'Mascota desconocida'
  }

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">¡Todo al día!</h3>
          <p className="text-muted-foreground">
            No hay alertas pendientes en este momento.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {alerts.map(alert => {
        const typeInfo = getAlertTypeInfo(alert.type)
        const priorityInfo = getPriorityInfo(alert.priority)
        const TypeIcon = typeInfo.icon
        const overdue = isOverdue(alert.dueDate)
        const daysUntil = getDaysUntilDue(alert.dueDate)

        return (
          <Card 
            key={alert.id} 
            className={cn(
              "transition-all hover:shadow-md",
              overdue && !alert.isCompleted && "border-red-200 bg-red-50",
              alert.isCompleted && "opacity-60"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={cn(
                    "p-2 rounded-lg",
                    overdue && !alert.isCompleted ? "bg-red-100" : "bg-muted"
                  )}>
                    <TypeIcon className={cn("w-4 h-4", typeInfo.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      <Badge variant="outline" className={priorityInfo.color}>
                        {priorityInfo.label}
                      </Badge>
                      {alert.isCompleted && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completada
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {!petId && (
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{getPetName(alert.petId)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{alert.dueDate.toLocaleDateString()}</span>
                      </div>
                      
                      <div className={cn(
                        "flex items-center space-x-1",
                        overdue && !alert.isCompleted && "text-red-600 font-medium"
                      )}>
                        <Clock className="w-3 h-3" />
                        <span>
                          {overdue && !alert.isCompleted
                            ? `Vencida hace ${Math.abs(daysUntil)} día${Math.abs(daysUntil) !== 1 ? 's' : ''}`
                            : alert.isCompleted
                            ? 'Completada'
                            : daysUntil === 0
                            ? 'Hoy'
                            : daysUntil === 1
                            ? 'Mañana'
                            : `En ${daysUntil} días`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <TypeIcon className="w-5 h-5" />
                          <span>{alert.title}</span>
                        </DialogTitle>
                        <DialogDescription>
                          {typeInfo.label} - Prioridad {priorityInfo.label}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Descripción</h4>
                          <p className="text-sm text-muted-foreground">
                            {alert.description}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Mascota:</span>
                            <p>{getPetName(alert.petId)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Fecha límite:</span>
                            <p>{alert.dueDate.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Prioridad:</span>
                            <p>{priorityInfo.label}</p>
                          </div>
                          <div>
                            <span className="font-medium">Estado:</span>
                            <p>{alert.isCompleted ? 'Completada' : 'Pendiente'}</p>
                          </div>
                        </div>
                        
                        {alert.notes && (
                          <div>
                            <h4 className="font-semibold mb-2">Notas</h4>
                            <p className="text-sm text-muted-foreground">
                              {alert.notes}
                            </p>
                          </div>
                        )}
                        
                        {alert.isCompleted && alert.completedDate && (
                          <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              Completada el {alert.completedDate.toLocaleDateString()}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      
                      <DialogFooter>
                        {!alert.isCompleted && (
                          <Button 
                            onClick={() => handleCompleteAlert(alert)}
                            className="w-full"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Marcar como completada
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {!alert.isCompleted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompleteAlert(alert)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}