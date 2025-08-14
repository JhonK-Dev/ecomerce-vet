'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickView?: boolean;
}

export function ProductCard({ product, className, showQuickView = true }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const finalPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    
    // Aquí implementar la lógica real del carrito
    console.log('Producto agregado al carrito:', product.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    // Aquí implementar la lógica real de favoritos
    console.log('Toggle favorito:', product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Aquí implementar modal de vista rápida
    console.log('Vista rápida:', product.id);
  };

  return (
    <Card className={cn("group relative overflow-hidden transition-all hover:shadow-lg", className)}>
      <Link href={`/productos/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          {/* Imagen del producto */}
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercentage}%
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="secondary" className="text-xs">
                Últimas {product.stock}
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="outline" className="text-xs bg-background">
                Agotado
              </Badge>
            )}
          </div>

          {/* Botones de acción */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={handleToggleFavorite}
            >
              <Heart 
                className={cn(
                  "h-4 w-4", 
                  isFavorite && "fill-red-500 text-red-500"
                )} 
              />
            </Button>
            
            {showQuickView && (
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                onClick={handleQuickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Overlay de acciones en hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isLoading}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isLoading ? 'Agregando...' : 'Agregar al carrito'}
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Marca */}
          <div className="text-xs text-muted-foreground mb-1">
            {product.brand}
          </div>

          {/* Nombre del producto */}
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating (simulado) */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                )}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
          </div>

          {/* Precio */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-primary">
              S/. {finalPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                S/. {product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-2">
            {product.stock > 0 ? (
              <span className="text-xs text-green-600">
                ✓ En stock ({product.stock} disponibles)
              </span>
            ) : (
              <span className="text-xs text-red-600">
                ✗ Agotado
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}