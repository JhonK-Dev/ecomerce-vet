'use client'

import { useState, useEffect, Suspense } from 'react'
import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/ecommerce/product-card'
import { ProductFiltersComponent } from '@/components/ecommerce/product-filters'
import { Search, Grid3X3, List, Filter, ArrowUpDown } from 'lucide-react'
import { Product, ProductFilters, PaginationParams } from '@/types'
import { ProductCategory } from '@/types'
import { ProductService } from '@/lib/products'

// Component that uses searchParams
function ProductsPageContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Estados para filtros y paginación
  const [filters, setFilters] = useState<ProductFilters>({})
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 12,
    sortBy: 'name',
    sortOrder: 'asc',
  })
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  // Inicializar filtros desde URL
  useEffect(() => {
    const initialFilters: ProductFilters = {}

    const category = searchParams.get('categoria')
    const brand = searchParams.get('marca')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrecio')
    const maxPrice = searchParams.get('maxPrecio')

    if (category) initialFilters.category = category as ProductCategory
    if (brand) initialFilters.brand = brand
    if (search) {
      initialFilters.search = search
      setSearchQuery(search)
    }
    if (minPrice) initialFilters.minPrice = Number(minPrice)
    if (maxPrice) initialFilters.maxPrice = Number(maxPrice)

    setFilters(initialFilters)
  }, [searchParams])

  // Cargar productos cuando cambien los filtros o paginación
  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await ProductService.getProducts(filters, pagination)
      setProducts(response.data)
      setTotalPages(response.pagination?.totalPages || 1)
      setTotalProducts(response.pagination?.total || 0)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, search: searchQuery }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    setPagination((prev) => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      page: 1,
    }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const clearSearch = () => {
    setSearchQuery('')
    setFilters((prev) => ({ ...prev, search: undefined }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Productos Veterinarios</h1>
        <p className="text-muted-foreground">
          Encuentra todo lo que necesitas para el cuidado de tu mascota
        </p>
      </div>

      {/* Barra de búsqueda y controles */}
      <div className="mb-6 space-y-4">
        {/* Búsqueda */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Buscar</Button>
          {filters.search && (
            <Button variant="outline" onClick={clearSearch}>
              Limpiar
            </Button>
          )}
        </form>

        {/* Controles de vista y ordenamiento */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>

            <div className="text-sm text-muted-foreground">
              {totalProducts} productos encontrados
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Ordenamiento */}
            <Select
              value={`${pagination.sortBy}-${pagination.sortOrder}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-48">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Nombre A-Z</SelectItem>
                <SelectItem value="name-desc">Nombre Z-A</SelectItem>
                <SelectItem value="price-asc">Precio menor a mayor</SelectItem>
                <SelectItem value="price-desc">Precio mayor a menor</SelectItem>
                <SelectItem value="createdAt-desc">Más recientes</SelectItem>
                <SelectItem value="createdAt-asc">Más antiguos</SelectItem>
              </SelectContent>
            </Select>

            {/* Vista */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
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

        {/* Filtros activos */}
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="secondary">Categoría: {filters.category}</Badge>
            )}
            {filters.brand && (
              <Badge variant="secondary">Marca: {filters.brand}</Badge>
            )}
            {filters.search && (
              <Badge variant="secondary">Búsqueda: {filters.search}</Badge>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary">
                Precio: S/. {filters.minPrice || 0} - S/.{' '}
                {filters.maxPrice || '∞'}
              </Badge>
            )}
            {filters.inStock && <Badge variant="secondary">En stock</Badge>}
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex gap-6">
        {/* Filtros laterales */}
        <aside
          className={`w-80 flex-shrink-0 ${
            showFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          <ProductFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </aside>

        {/* Lista de productos */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg aspect-square mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-6 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className={viewMode === 'list' ? 'flex-row' : ''}
                  />
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Anterior
                    </Button>

                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1
                      const isCurrentPage = page === pagination.page
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - pagination.page) <= 2

                      if (!showPage) {
                        if (
                          page === pagination.page - 3 ||
                          page === pagination.page + 3
                        ) {
                          return (
                            <span key={page} className="px-2">
                              ...
                            </span>
                          )
                        }
                        return null
                      }

                      return (
                        <Button
                          key={page}
                          variant={isCurrentPage ? 'default' : 'outline'}
                          onClick={() => handlePageChange(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      )
                    })}

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">
                No se encontraron productos
              </h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar los filtros o términos de búsqueda
              </p>
              <Button onClick={() => handleFiltersChange({})}>
                Limpiar filtros
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Loading fallback component
function ProductsPageFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Productos Veterinarios</h1>
        <p className="text-muted-foreground">
          Encuentra todo lo que necesitas para el cuidado de tu mascota
        </p>
      </div>

      {/* Loading skeleton */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
          <div className="h-10 bg-muted rounded flex-1 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-20 animate-pulse"></div>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="w-80 flex-shrink-0 hidden lg:block">
          <div className="bg-muted rounded-lg h-96 animate-pulse"></div>
        </aside>
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-square mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  )
}
