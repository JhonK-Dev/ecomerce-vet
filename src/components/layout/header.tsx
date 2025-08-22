'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { UserButton } from '@/components/auth/user-button';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Menu,
  Stethoscope,
  User
} from 'lucide-react';
import { CartService } from '@/lib/cart';
import { ProductCategory } from '@/types';

export function Header() {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Obtener conteo real del carrito
    const cart = CartService.getCart();
    setCartItemsCount(cart.items.length);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Comida', value: ProductCategory.FOOD, description: 'Alimento balanceado y snacks' },
    { name: 'Medicina', value: ProductCategory.MEDICINE, description: 'Medicamentos y tratamientos' },
    { name: 'Accesorios', value: ProductCategory.ACCESSORIES, description: 'Collares, correas y más' },
    { name: 'Higiene', value: ProductCategory.HYGIENE, description: 'Shampoos y productos de limpieza' },
    { name: 'Juguetes', value: ProductCategory.TOYS, description: 'Entretenimiento para mascotas' },
    { name: 'Suplementos', value: ProductCategory.SUPPLEMENTS, description: 'Vitaminas y suplementos' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">EcommerceVet</span>
            </Link>

            {/* Navigation Menu */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Inicio
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Productos</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      {categories.map((category) => (
                        <Link
                          key={category.value}
                          href={`/productos?category=${category.value}`}
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                        >
                          <div className="text-sm font-medium leading-none group-hover:underline">
                            {category.name}
                          </div>
                          <div className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                            {category.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/servicios" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Servicios
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/historias-clinicas" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Historias Clínicas
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/carrito" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Favorites */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/favoritos">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* User Menu with Clerk */}
            <UserButton />

            {/* Configuración de rol (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/configurar-rol" title="Configurar Rol">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}

            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}