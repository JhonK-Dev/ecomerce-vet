'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { X, Filter, RotateCcw } from 'lucide-react'
import type { ServiceFilters } from '@/types/veterinary'
import { VeterinarianSpecialty } from '@/types/veterinary'
import { VeterinaryServiceService } from '@/lib/veterinary-services'

interface ServiceFiltersProps {
  filters: ServiceFilters
  onFiltersChange: (filters: ServiceFilters) => void
  className?: string
}

export function ServiceFilters({
  filters,
  onFiltersChange,
  className,
}: ServiceFiltersProps) {
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.priceMin || 0,
    filters.priceMax || 500,
  ])

  const [durationRange, setDurationRange] = useState<number[]>([
    filters.durationMin || 0,
    filters.durationMax || 180,
  ])

  const categories = VeterinaryServiceService.getServiceCategories()

  const specialties = [
    { value: VeterinarianSpecialty.GENERAL, label: 'General' },
    { value: VeterinarianSpecialty.SURGERY, label: 'Cirugía' },
    { value: VeterinarianSpecialty.CARDIOLOGY, label: 'Cardiología' },
    { value: VeterinarianSpecialty.DERMATOLOGY, label: 'Dermatología' },
    { value: VeterinarianSpecialty.ONCOLOGY, label: 'Oncología' },
    { value: VeterinarianSpecialty.OPHTHALMOLOGY, label: 'Oftalmología' },
    { value: VeterinarianSpecialty.ORTHOPEDICS, label: 'Ortopedia' },
    { value: VeterinarianSpecialty.EXOTIC_ANIMALS, label: 'Animales Exóticos' },
  ]

  const handleFilterChange = (
    key: keyof ServiceFilters,
    value: ServiceFilters[keyof ServiceFilters]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    onFiltersChange({
      ...filters,
      priceMin: values[0],
      priceMax: values[1],
    })
  }

  const handleDurationRangeChange = (values: number[]) => {
    setDurationRange(values)
    onFiltersChange({
      ...filters,
      durationMin: values[0],
      durationMax: values[1],
    })
  }

  const clearFilters = () => {
    setPriceRange([0, 500])
    setDurationRange([0, 180])
    onFiltersChange({})
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category) count++
    if (filters.veterinarianSpecialty) count++
    if (filters.priceMin !== undefined || filters.priceMax !== undefined)
      count++
    if (filters.durationMin !== undefined || filters.durationMax !== undefined)
      count++
    if (filters.search) count++
    return count
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Búsqueda */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar Servicio</Label>
          <Input
            id="search"
            placeholder="Nombre del servicio..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <Separator />

        {/* Categoría */}
        <div className="space-y-3">
          <Label>Categoría</Label>
          <Select
            value={filters.category || ''}
            onValueChange={(value) =>
              handleFilterChange('category', value || undefined)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Especialidad Veterinaria */}
        <div className="space-y-3">
          <Label>Especialidad Requerida</Label>
          <Select
            value={filters.veterinarianSpecialty || ''}
            onValueChange={(value) =>
              handleFilterChange('veterinarianSpecialty', value || undefined)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las especialidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las especialidades</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.value} value={specialty.value}>
                  {specialty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Rango de Precios */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Precio</Label>
            <span className="text-sm text-muted-foreground">
              S/. {priceRange[0]} - S/. {priceRange[1]}
            </span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Duración */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Duración (minutos)</Label>
            <span className="text-sm text-muted-foreground">
              {durationRange[0]} - {durationRange[1]} min
            </span>
          </div>
          <Slider
            value={durationRange}
            onValueChange={handleDurationRangeChange}
            max={180}
            min={0}
            step={15}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Solo servicios activos */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="active-only"
            checked={filters.isActive !== false}
            onCheckedChange={(checked) =>
              handleFilterChange('isActive', checked ? undefined : false)
            }
          />
          <Label htmlFor="active-only" className="text-sm">
            Solo servicios disponibles
          </Label>
        </div>

        {/* Filtros activos */}
        {getActiveFiltersCount() > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filtros Activos</Label>
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {
                      categories.find((c) => c.value === filters.category)
                        ?.label
                    }
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('category', undefined)}
                    />
                  </Badge>
                )}

                {filters.veterinarianSpecialty && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {
                      specialties.find(
                        (s) => s.value === filters.veterinarianSpecialty
                      )?.label
                    }
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        handleFilterChange('veterinarianSpecialty', undefined)
                      }
                    />
                  </Badge>
                )}

                {(filters.priceMin !== undefined ||
                  filters.priceMax !== undefined) && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Precio: S/. {filters.priceMin || 0} - S/.{' '}
                    {filters.priceMax || 500}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        handleFilterChange('priceMin', undefined)
                        handleFilterChange('priceMax', undefined)
                        setPriceRange([0, 500])
                      }}
                    />
                  </Badge>
                )}

                {filters.search && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {'{filters.search}'}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('search', undefined)}
                    />
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
