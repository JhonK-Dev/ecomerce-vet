'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign, Calendar, Info } from 'lucide-react';
import { VeterinaryService, ServiceCategory } from '@/types/veterinary';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: VeterinaryService;
  className?: string;
  showBookButton?: boolean;
}

export function ServiceCard({ service, className, showBookButton = true }: ServiceCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getCategoryColor = (category: ServiceCategory) => {
    const colors = {
      [ServiceCategory.CONSULTATION]: 'bg-blue-100 text-blue-800',
      [ServiceCategory.VACCINATION]: 'bg-green-100 text-green-800',
      [ServiceCategory.SURGERY]: 'bg-red-100 text-red-800',
      [ServiceCategory.GROOMING]: 'bg-purple-100 text-purple-800',
      [ServiceCategory.DEWORMING]: 'bg-yellow-100 text-yellow-800',
      [ServiceCategory.DENTAL]: 'bg-indigo-100 text-indigo-800',
      [ServiceCategory.EMERGENCY]: 'bg-red-100 text-red-800',
      [ServiceCategory.LABORATORY]: 'bg-cyan-100 text-cyan-800',
      [ServiceCategory.IMAGING]: 'bg-gray-100 text-gray-800',
      [ServiceCategory.THERAPY]: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: ServiceCategory) => {
    const labels = {
      [ServiceCategory.CONSULTATION]: 'Consulta',
      [ServiceCategory.VACCINATION]: 'Vacunación',
      [ServiceCategory.SURGERY]: 'Cirugía',
      [ServiceCategory.GROOMING]: 'Peluquería',
      [ServiceCategory.DEWORMING]: 'Desparasitación',
      [ServiceCategory.DENTAL]: 'Dental',
      [ServiceCategory.EMERGENCY]: 'Emergencia',
      [ServiceCategory.LABORATORY]: 'Laboratorio',
      [ServiceCategory.IMAGING]: 'Imagenología',
      [ServiceCategory.THERAPY]: 'Terapia'
    };
    return labels[category] || category;
  };

  const handleBookAppointment = async () => {
    setIsLoading(true);
    // Simular navegación a reserva de cita
    setTimeout(() => {
      setIsLoading(false);
      // Aquí se implementaría la navegación real
      console.log('Reservar cita para servicio:', service.id);
    }, 1000);
  };

  return (
    <Card className={cn("group relative overflow-hidden transition-all hover:shadow-lg", className)}>
      <div className="relative">
        {/* Imagen del servicio */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={service.image || '/services/default-service.jpg'}
            alt={service.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          
          {/* Badge de categoría */}
          <div className="absolute top-3 left-3">
            <Badge className={getCategoryColor(service.category)}>
              {getCategoryLabel(service.category)}
            </Badge>
          </div>

          {/* Badge de preparación requerida */}
          {service.requiresPreparation && (
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="bg-white/90">
                <Info className="h-3 w-3 mr-1" />
                Preparación
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {service.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Descripción */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {service.description}
          </p>

          {/* Información del servicio */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{service.duration} min</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">S/. {service.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Instrucciones de preparación */}
          {service.requiresPreparation && service.preparationInstructions && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-xs text-amber-800">
                <strong>Preparación:</strong> {service.preparationInstructions}
              </p>
            </div>
          )}

          {/* Especialidades requeridas */}
          {service.veterinarianSpecialty && service.veterinarianSpecialty.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {service.veterinarianSpecialty.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            {showBookButton && (
              <Button 
                className="flex-1" 
                onClick={handleBookAppointment}
                disabled={isLoading}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {isLoading ? 'Cargando...' : 'Reservar Cita'}
              </Button>
            )}
            
            <Button variant="outline" asChild>
              <Link href={`/servicios/${service.id}`}>
                Ver Detalles
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}