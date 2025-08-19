'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu,
  LogOut,
  Settings,
  Package,
  Calendar,
  FileText,
  Shield
} from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { User as UserType, UserRole } from '@/types';

export function Header() {
  const [user, setUser] = useState<UserType | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    
    // Simular conteo de items en carrito (implementar con estado global)
    setCartItemsCount(3);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getUserMenuItems = () => {
    if (!user) return [];

    const commonItems = [
      { icon: User, label: 'Mi Perfil', href: '/perfil' },
      { icon: Settings, label: 'Configuración', href: '/configuracion' },
    ];

    switch (user.role) {
      case UserRole.ADMIN:
        return [
          ...commonItems,
          { icon: Shield, label: 'Panel Admin', href: '/admin' },
          { icon: Package, label: 'Productos', href: '/admin/productos' },
          { icon: FileText, label: 'Reportes', href: '/admin/reportes' },
        ];
      case UserRole.VETERINARIAN:
        return [
          ...commonItems,
          { icon: Calendar, label: 'Agenda', href: '/veterinario/agenda' },
          { icon: FileText, label: 'Historias Clínicas', href: '/veterinario/historias' },
        ];
      case UserRole.CLIENT:
        return [
          ...commonItems,
          { icon: Package, label: 'Mis Pedidos', href: '/mis-pedidos' },
          { icon: Heart, label: 'Favoritos', href: '/favoritos' },
          { icon: Calendar, label: 'Mis Citas', href: '/mis-citas' },
        ];
      default:
        return commonItems;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          🐾 ¡Envío gratis en compras mayores a S/. 150! | 📞 Emergencias 24/7: (01) 234-5678
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🐕</span>
            </div>
            <span className="font-bold text-xl text-primary">EcommerceVet</span>
          </Link>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Productos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/productos"
                        >
                          <Package className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Catálogo Completo
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explora todos nuestros productos veterinarios
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <div className="grid gap-2">
                      <Link href="/productos?categoria=alimentos" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Alimentos</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Comida premium para perros y gatos
                        </p>
                      </Link>
                      <Link href="/productos?categoria=medicamentos" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Medicamentos</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Medicinas y suplementos veterinarios
                        </p>
                      </Link>
                      <Link href="/productos?categoria=accesorios" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Accesorios</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Collares, correas, juguetes y más
                        </p>
                      </Link>
                    </div>
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
                <Link href="/citas" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Reservar Cita
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/nosotros" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Nosotros
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
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

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge variant="secondary" className="w-fit text-xs">
                        {user.role === UserRole.ADMIN && 'Administrador'}
                        {user.role === UserRole.VETERINARIAN && 'Veterinario'}
                        {user.role === UserRole.CLIENT && 'Cliente'}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {getUserMenuItems().map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                {/* <Button asChild>
                  <Link href="/registro">Registrarse</Link>
                </Button> */}
              </div>
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