'use client'

import { useState, useEffect, useCallback } from 'react'
import { ServiceCard } from './service-card'
import { ServiceFilters } from './service-filters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  RefreshCw,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  VeterinaryService,
  ServiceFilters as ServiceFiltersType,
} from '@/types/veterinary'
import { VeterinaryServiceService } from '@/lib/veterinary-services'
import { cn } from '@/lib/utils'

interface ServicesListProps {
  initialServices?: VeterinaryService[]
  showFilters?: boolean
  showSearch?: boolean
  showViewToggle?: boolean
  showSorting?: boolean
  className?: string
  onServiceSelect?: (service: VeterinaryService) => void
}

type SortOption = 'name' | 'price' | 'duration' | 'category'
type SortDirection = 'asc' | 'desc'

export function ServicesList({
  initialServices,
  showFilters = true,
  showSearch = true,
  showViewToggle = true,
  showSorting = true,
  className,
  onServiceSelect,
}: ServicesListProps) {
  const [services, setServices] = useState<VeterinaryService[]>(
    initialServices || []
  )
  const [filteredServices, setFilteredServices] = useState<VeterinaryService[]>(
    []
  )
  const [filters, setFilters] = useState<ServiceFiltersType>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(!initialServices)
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialServices) {
      loadServices()
    }
  }, [initialServices])

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

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...services]

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtros corregidos según ServiceFiltersType
    if (filters.category) {
      filtered = filtered.filter(
        (service) => service.category === filters.category
      )
    }
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      const min = filters.priceMin ?? 0
      const max = filters.priceMax ?? Infinity
      filtered = filtered.filter(
        (service) => service.price >= min && service.price <= max
      )
    }
    if (
      filters.durationMin !== undefined ||
      filters.durationMax !== undefined
    ) {
      const min = filters.durationMin ?? 0
      const max = filters.durationMax ?? Infinity
      filtered = filtered.filter(
        (service) => service.duration >= min && service.duration <= max
      )
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

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'price':
          comparison = a.price - b.price
          break
        case 'duration':
          comparison = a.duration - b.duration
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    setFilteredServices(filtered)
  }, [services, filters, searchTerm, sortBy, sortDirection])

  // Ejecutar la función cuando cambien las dependencias
  useEffect(() => {
    applyFiltersAndSort()
  }, [applyFiltersAndSort])

  const handleFiltersChange = (newFilters: ServiceFiltersType) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const getSortLabel = (option: SortOption) => {
    const labels = {
      name: 'Nombre',
      price: 'Precio',
      duration: 'Duración',
      category: 'Categoría',
    }
    return labels[option]
  }

  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadServices} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Controles superiores */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Búsqueda */}
        {showSearch && (
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        <div className="flex gap-2">
          {/* Filtros */}
          {showFilters && (
            <Button
              variant="outline"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          )}

          {/* Ordenamiento */}
          {showSorting && (
            <div className="flex gap-1">
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="price">Precio</SelectItem>
                  <SelectItem value="duration">Duración</SelectItem>
                  <SelectItem value="category">Categoría</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortDirection}
                title={`Ordenar ${
                  sortDirection === 'asc' ? 'descendente' : 'ascendente'
                }`}
              >
                {sortDirection === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}

          {/* Toggle de vista */}
          {showViewToggle && (
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
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Panel de filtros */}
        {showFilters && showFiltersPanel && (
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
              {sortBy && !isLoading && (
                <span className="ml-2">
                  • Ordenado por {getSortLabel(sortBy)} (
                  {sortDirection === 'asc' ? 'A-Z' : 'Z-A'})
                </span>
              )}
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
                  className={cn(
                    viewMode === 'list' && 'flex-row',
                    onServiceSelect &&
                      'cursor-pointer hover:shadow-md transition-shadow'
                  )}
                  showBookButton={!onServiceSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
