'use client'

import { useState, useEffect, useCallback } from 'react'
import { ServiceCard } from '@/components/veterinary/service-card'
import { ServiceFilters } from '@/components/veterinary/service-filters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Search, Filter, Grid, List } from 'lucide-react'
import {
  VeterinaryService,
  ServiceFilters as ServiceFiltersType,
} from '@/types/veterinary'
import { VeterinaryServiceService } from '@/lib/veterinary-services'
import { cn } from '@/lib/utils'

export default function ServiciosPage() {
  const loadServices = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const allServices = await VeterinaryServiceService.getAllServices()
      setServices(allServices)
    } catch (err) {
      setError('Error al cargar los servicios. Por favor, intenta nuevamente.')
      console.error('Error loading services:', err)
    } finally {
      setIsLoading(false)
    }
  }
  const [services, setServices] = useState<VeterinaryService[]>([])
  const [filteredServices, setFilteredServices] = useState<VeterinaryService[]>(
    []
  )
  const [filters, setFilters] = useState<ServiceFiltersType>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [error, setError] = useState<string | null>(null)

  const applyFilters = useCallback(() => {
    let filtered = [...services]

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Aplicar filtros adicionales
    if (filters.category) {
      filtered = filtered.filter(
        (service) => service.category === filters.category
      )
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      filtered = filtered.filter((service) => {
        const min = filters.priceMin ?? 0
        const max = filters.priceMax ?? Infinity
        return service.price >= min && service.price <= max
      })
    }

    if (
      filters.durationMin !== undefined ||
      filters.durationMax !== undefined
    ) {
      filtered = filtered.filter((service) => {
        const min = filters.durationMin ?? 0
        const max = filters.durationMax ?? Infinity
        return service.duration >= min && service.duration <= max
      })
    }

    if (filters.veterinarianSpecialty !== undefined) {
      filtered = filtered.filter((service) =>
        service.veterinarianSpecialty?.includes(
          filters.veterinarianSpecialty as import('@/types/veterinary').VeterinarianSpecialty
        )
      )
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter(
        (service) => service.isActive === filters.isActive
      )
    }

    setFilteredServices(filtered)
  }, [services, filters, searchTerm])

  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [services, filters, searchTerm, applyFilters])

  const handleFiltersChange = (newFilters: ServiceFiltersType) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadServices} className="mt-4">
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Servicios Veterinarios</h1>
        <p className="text-muted-foreground">
          Encuentra el servicio veterinario que necesitas para tu mascota
        </p>
      </div>

      {/* Barra de búsqueda y controles */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Panel de filtros */}
        {showFilters && (
          <div className="lg:w-80">
            <ServiceFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              className="sticky top-4"
            />
          </div>
        )}

        {/* Lista de servicios */}
        <div className="flex-1">
          {/* Información de resultados */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? 'Cargando...'
                : `${filteredServices.length} servicios encontrados`}
            </p>

            {(Object.keys(filters).length > 0 || searchTerm) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Grid/Lista de servicios */}
          {isLoading ? (
            <div
              className={cn(
                'grid gap-6',
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              )}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No se encontraron servicios que coincidan con tu búsqueda
              </p>
              <Button onClick={clearFilters} variant="outline">
                Ver todos los servicios
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                'grid gap-6',
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              )}
            >
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
