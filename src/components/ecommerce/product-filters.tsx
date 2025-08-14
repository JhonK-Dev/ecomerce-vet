'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { X, Filter, RotateCcw } from 'lucide-react';
import { ProductCategory, ProductFilters } from '@/types';
import { ProductService } from '@/lib/products';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  className?: string;
}

export function ProductFiltersComponent({ filters, onFiltersChange, className }: ProductFiltersProps) {
  const [categories, setCategories] = useState<{ value: ProductCategory; label: string; count: number }[]>([]);
  const [brands, setBrands] = useState<{ value: string; label: string; count: number }[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 200 });
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 200]);

  useEffect(() => {
    // Cargar datos para los filtros
    setCategories(ProductService.getCategories());
    setBrands(ProductService.getBrands());
    const range = ProductService.getPriceRange();
    setPriceRange(range);
    setLocalPriceRange([filters.minPrice || range.min, filters.maxPrice || range.max]);
  }, []);

  const handleCategoryChange = (category: ProductCategory, checked: boolean) => {
    onFiltersChange({
      ...filters,
      category: checked ? category : undefined
    });
  };

  const handleBrandChange = (brand: string) => {
    onFiltersChange({
      ...filters,
      brand: brand === 'all' ? undefined : brand
    });
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setLocalPriceRange(value);
    onFiltersChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1]
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: checked ? true : undefined
    });
  };

  const clearFilters = () => {
    setLocalPriceRange([priceRange.min, priceRange.max]);
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.inStock) count++;
    if (filters.search) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categorías */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Categorías</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={category.value}
                  checked={filters.category === category.value}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.value, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={category.value} 
                  className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                >
                  <span>{category.label}</span>
                  <span className="text-muted-foreground">({category.count})</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Marcas */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Marca</Label>
          <Select 
            value={filters.brand || 'all'} 
            onValueChange={handleBrandChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las marcas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.value} value={brand.value}>
                  {brand.label} ({brand.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Rango de precios */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Rango de precio</Label>
          <div className="px-2">
            <Slider
              value={localPriceRange}
              onValueChange={handlePriceRangeChange}
              max={priceRange.max}
              min={priceRange.min}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>S/. {localPriceRange[0]}</span>
            <span>S/. {localPriceRange[1]}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minPrice" className="text-xs">Mínimo</Label>
              <Input
                id="minPrice"
                type="number"
                value={localPriceRange[0]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setLocalPriceRange([value, localPriceRange[1]]);
                  handlePriceRangeChange([value, localPriceRange[1]]);
                }}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-xs">Máximo</Label>
              <Input
                id="maxPrice"
                type="number"
                value={localPriceRange[1]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setLocalPriceRange([localPriceRange[0], value]);
                  handlePriceRangeChange([localPriceRange[0], value]);
                }}
                className="h-8"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Disponibilidad */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Disponibilidad</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock || false}
              onCheckedChange={handleInStockChange}
            />
            <Label htmlFor="inStock" className="text-sm cursor-pointer">
              Solo productos en stock
            </Label>
          </div>
        </div>

        {/* Filtros activos */}
        {activeFiltersCount > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filtros activos</Label>
              <div className="flex flex-wrap gap-1">
                {filters.category && (
                  <Badge variant="secondary" className="text-xs">
                    {categories.find(c => c.value === filters.category)?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => handleCategoryChange(filters.category!, false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.brand && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.brand}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => handleBrandChange('all')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.inStock && (
                  <Badge variant="secondary" className="text-xs">
                    En stock
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => handleInStockChange(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}