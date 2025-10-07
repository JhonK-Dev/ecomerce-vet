'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductCard } from '@/components/ecommerce/product-card';
import {
  Calendar,
  Heart,
  Truck,
  Shield,
  Clock,
  Phone,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';
import { Product } from '@/types';
import { ProductService } from '@/lib/products';
import LoadingScreen from '@/components/loading-screen';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      src: '/hero-slide1.webp',
      alt: 'Veterinario cuidando gato',
      author: 'Aura',
      date: 'Mayo 02, 2024',
    },
    {
      id: 2,
      src: '/hero-slide2.webp',
      alt: 'Chequeo de cachorro',
      author: 'Equipo Vet',
      date: 'Junio 15, 2024',
    },
    {
      id: 3,
      src: '/hero-slide3.webp',
      alt: 'Atención clínica perro',
      author: 'Jhon Kerry',
      date: 'Julio 10, 2024',
    },
    {
      id: 4,
      src: '/hero-slide4.webp',
      alt: 'Chequeo de gato cachorro',
      author: 'Michi López',
      date: 'Julio 23, 2025',
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, bestSelling] = await Promise.all([
          ProductService.getFeaturedProducts(8),
          ProductService.getBestSellingProducts(6),
        ]);
        setFeaturedProducts(featured);
        setBestSellingProducts(bestSelling);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-transparent to-background/10">
        {/* Fondo */}
        <Image
          src="/collage.webp"
          alt="Collage mascotas"
          fill
          className="object-cover"
          priority
        />

        {/* Contenido del hero */}
        <div className="relative z-10 w-full py-4">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-center lg:text-left space-y-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Cuidamos a tu mascota con amor y profesionalismo
                </h1>
                <p className="text-base sm:text-lg md:text-lg text-white/90 leading-relaxed">
                  Tu clínica veterinaria de confianza. Productos de calidad y servicios especializados para el bienestar de tu mascota.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                  <Button size="lg" className="text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 bg-green-800 hover:bg-green-600 text-white shadow-lg" asChild>
                    <Link href="/servicios">
                      <Calendar className="mr-2 h-5 w-5" />
                      Reservar Cita
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 border-2 border-green-800 bg-white/95 text-green-800 hover:bg-green-800 hover:text-white shadow-lg"
                    asChild
                  >
                    <Link href="/productos">
                      Ver Productos
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Carrusel */}
              <div className="w-full">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm">
                  <Image
                    src={slides[currentSlide].src}
                    alt={slides[currentSlide].alt}
                    width={600}
                    height={350}
                    className="w-full object-cover aspect-video"
                    priority
                  />

                  <div className="absolute bottom-20 right-12 text-white text-sm lg:text-base text-right" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3), -2px -2px 4px rgba(0,0,0,0.3), 2px -2px 4px rgba(0,0,0,0.3), -2px 2px 4px rgba(0,0,0,0.3)' }}>
                    <span className="font-medium">{slides[currentSlide].author}</span> | {slides[currentSlide].date}
                  </div>

                  {/* Dots navegación */}
                  <div className="absolute bottom-12 right-12 flex gap-3">
                    {slides.map((slide, idx) => (
                      <button
                        key={slide.id}
                        onClick={() => setCurrentSlide(idx)}
                        className={`rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide
                            ? 'w-3 h-3 bg-blue-500 scale-110'
                            : 'w-3 h-3 bg-white/60 hover:bg-white/80'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-left mb-16 max-w-2xl">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Por qué elegir EcommerceVet?
            </h2>
            <p className="text-muted-foreground">
              Ofrecemos una experiencia completa para el cuidado de tu mascota,
              combinando productos de calidad con servicios veterinarios
              profesionales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-y-14 sm:gap-8">
            {/* Card */}
            <Card className="relative pt-8 md:pt-8 pb-6 px-6 rounded-md shadow-md bg-green-50/40 transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg">
              <div className="absolute -top-6 left-6 w-12 h-12 sm:w-14 sm:h-14 bg-green-600 rounded-md flex items-center justify-center shadow-md">
                <Truck className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg mb-1">Envío Gratis</h3>
                <p className="text-sm text-muted-foreground">
                  En compras mayores a S/. 150 en Lima Metropolitana
                </p>
              </div>
            </Card>

            <Card className="relative pt-8 md:pt-8 pb-6 px-6 rounded-md shadow-md bg-yellow-50/40 transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg">
              <div className="absolute -top-6 left-6 w-12 h-12 sm:w-14 sm:h-14 bg-yellow-500 rounded-md flex items-center justify-center shadow-md">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg mb-1">Productos Garantizados</h3>
                <p className="text-sm text-muted-foreground">
                  Solo marcas reconocidas y productos de calidad veterinaria
                </p>
              </div>
            </Card>

            <Card className="relative pt-8 md:pt-8 pb-6 px-6 rounded-md shadow-md bg-blue-50/50 transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg">
              <div className="absolute -top-6 left-6 w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-md flex items-center justify-center shadow-md">
                <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg mb-1">Atención 24/7</h3>
                <p className="text-sm text-muted-foreground">
                  Emergencias veterinarias las 24 horas del día
                </p>
              </div>
            </Card>

            <Card className="relative pt-8 md:pt-8 pb-6 px-6 rounded-md shadow-md bg-pink-50/50 transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg">
              <div className="absolute -top-6 left-6 w-12 h-12 sm:w-14 sm:h-14 bg-pink-500 rounded-md flex items-center justify-center shadow-md">
                <Stethoscope className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg mb-1">Veterinarios Expertos</h3>
                <p className="text-sm text-muted-foreground">
                  Equipo profesional con años de experiencia
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                Productos Destacados
              </h2>
              <p className="text-muted-foreground">
                Los mejores productos con ofertas especiales
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/productos">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios veterinarios para mantener
              a tu mascota saludable y feliz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Consultas Veterinarias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Exámenes completos, diagnósticos y tratamientos personalizados
                  para tu mascota.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/servicios/consultas">Más información</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Vacunación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Programas completos de vacunación para proteger a tu mascota
                  de enfermedades.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/servicios/vacunacion">Más información</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Cirugías</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Procedimientos quirúrgicos con tecnología avanzada y cuidado
                  post-operatorio.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/servicios/cirugias">Más información</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/servicios">
                Ver todos los servicios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                Productos Más Vendidos
              </h2>
              <p className="text-muted-foreground">
                Los favoritos de nuestros clientes
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/productos?sort=bestselling">
                Ver más
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas atención de emergencia?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Estamos disponibles 24/7 para emergencias veterinarias
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Phone className="mr-2 h-5 w-5" />
              Llamar Emergencias: (01) 234-5678
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Reservar Cita
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
