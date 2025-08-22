'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Filter,
  Plus,
  FileText,
  Download,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { MedicalRecordCard } from './medical-record-card'
import {
  MedicalRecord,
  MedicalRecordType,
  MedicalRecordFilters,
  Pet,
} from '@/types/medical-records'
import { MedicalRecordService } from '@/lib/medical-records'
import { cn } from '@/lib/utils'

interface MedicalRecordsListProps {
  petId?: string
  veterinarianId?: string
  ownerId?: string
  showFilters?: boolean
  showAddButton?: boolean
  onAddRecord?: () => void
  onEditRecord?: (record: MedicalRecord) => void
  className?: string
}

export function MedicalRecordsList({
  petId,
  veterinarianId,
  ownerId,
  showFilters = true,
  showAddButton = true,
  onAddRecord,
  onEditRecord,
  className,
}: MedicalRecordsListProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados de filtros
  const [filters, setFilters] = useState<MedicalRecordFilters>({
    petId,
    veterinarianId,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<MedicalRecordType | 'all'>(
    'all'
  )
  const [dateRange, setDateRange] = useState<
    'all' | '7d' | '30d' | '90d' | '1y'
  >('all')

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let recordsData: MedicalRecord[] = []
      let petsData: Pet[] = []

      if (petId) {
        // Cargar registros de una mascota específica
        recordsData = await MedicalRecordService.getMedicalRecordsByPet(petId)
        const pet = await MedicalRecordService.getPetById(petId)
        if (pet) petsData = [pet]
      } else if (ownerId) {
        // Cargar registros de todas las mascotas del propietario
        petsData = await MedicalRecordService.getPetsByOwner(ownerId)
        const allRecords = await Promise.all(
          petsData.map((pet) =>
            MedicalRecordService.getMedicalRecordsByPet(pet.id)
          )
        )
        recordsData = allRecords.flat()
      } else {
        // Cargar todos los registros (para veterinarios)
        recordsData = await MedicalRecordService.searchMedicalRecords({
          veterinarianId,
        })
        petsData = await MedicalRecordService.getAllPets()
      }

      setRecords(recordsData)
      setPets(petsData)
    } catch (err) {
      setError('Error al cargar las historias clínicas')
      console.error('Error loading medical records:', err)
    } finally {
      setLoading(false)
    }
  }, [petId, veterinarianId, ownerId])

  const applyFilters = useCallback(() => {
    let filtered = [...records]

    // Filtro por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (record) =>
          record.title.toLowerCase().includes(search) ||
          record.description.toLowerCase().includes(search) ||
          record.diagnosis?.toLowerCase().includes(search) ||
          record.treatment?.toLowerCase().includes(search)
      )
    }

    // Filtro por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter((record) => record.type === selectedType)
    }

    // Filtro por fecha
    if (dateRange !== 'all') {
      const now = new Date()
      const daysMap = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365,
      }
      const days = daysMap[dateRange as keyof typeof daysMap]
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      filtered = filtered.filter((record) => record.date >= cutoffDate)
    }

    // Aplicar filtros adicionales
    if (filters.petId) {
      filtered = filtered.filter((record) => record.petId === filters.petId)
    }

    if (filters.veterinarianId) {
      filtered = filtered.filter(
        (record) => record.veterinarianId === filters.veterinarianId
      )
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((record) => record.date >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      filtered = filtered.filter((record) => record.date <= filters.dateTo!)
    }

    setFilteredRecords(filtered)
  }, [records, filters, searchTerm, selectedType, dateRange])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleRefresh = () => {
    loadData()
  }

  const handleExport = () => {
    // Implementar exportación de datos
    console.log('Exportar registros médicos')
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

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        )}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="ml-2"
          >
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Historia Clínica</h2>
          <p className="text-muted-foreground">
            {filteredRecords.length} registro
            {filteredRecords.length !== 1 ? 's' : ''}
            {petId && pets.length > 0 && ` de ${pets[0].name}`}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>

          {showAddButton && onAddRecord && (
            <Button onClick={onAddRecord}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Consulta
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar en registros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tipo de registro */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={selectedType}
                  onValueChange={(value) =>
                    setSelectedType(value as MedicalRecordType | 'all')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {Object.values(MedicalRecordType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getRecordTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rango de fechas */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <Select
                  value={dateRange}
                  onValueChange={(value) =>
                    setDateRange(value as 'all' | '7d' | '30d' | '90d' | '1y')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo el tiempo</SelectItem>
                    <SelectItem value="7d">Últimos 7 días</SelectItem>
                    <SelectItem value="30d">Últimos 30 días</SelectItem>
                    <SelectItem value="90d">Últimos 3 meses</SelectItem>
                    <SelectItem value="1y">Último año</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mascota (si no está filtrado por petId) */}
              {!petId && pets.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mascota</label>
                  <Select
                    value={filters.petId || 'all'}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        petId: value === 'all' ? undefined : value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las mascotas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las mascotas</SelectItem>
                      {pets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.name} (
                          {MedicalRecordService.getSpeciesLabel(pet.species)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas rápidas */}
      {filteredRecords.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(MedicalRecordType).map((type) => {
            const count = filteredRecords.filter((r) => r.type === type).length
            if (count === 0) return null

            return (
              <Card key={type}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{count}</div>
                  <div className="text-xs text-muted-foreground">
                    {getRecordTypeLabel(type)}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Lista de registros */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay registros</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedType !== 'all' || dateRange !== 'all'
                  ? 'No se encontraron registros con los filtros aplicados.'
                  : 'Aún no hay registros médicos para mostrar.'}
              </p>
              {showAddButton && onAddRecord && (
                <Button onClick={onAddRecord}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear primer registro
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <MedicalRecordCard
              key={record.id}
              record={record}
              onEdit={onEditRecord}
              showPetInfo={!petId}
            />
          ))
        )}
      </div>
    </div>
  )
}
