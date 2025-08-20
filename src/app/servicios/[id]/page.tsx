'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppointmentBooking } from '@/components/veterinary/appointment-booking';
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Calendar, 
  Info, 
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';
import { VeterinaryService, ServiceCategory, Veterinarian } from '@/types/veterinary';
import { VeterinaryServiceService } from '@/lib/veterinary-services';
import { VeterinarianService } from '@/lib/veterinarians';
import { cn } from '@/lib/utils';

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;
  
  const [service, setService] = useState<VeterinaryService | null>(null);
  const [availableVeterinarians, setAvailableVeterinarians] = useState<Veterinarian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serviceId) {
      loadServiceDetails();
    }
  }, [serviceId]);

  const loadServiceDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const serviceData = await VeterinaryServiceService.getServiceById(serviceId);
      if (!serviceData) {
        setError('Servicio no encontrado');
        return;
      }
      
      setService(serviceData);
      
      // Cargar veterinarios disponibles para este servicio
      if (serviceData.veterinarianSpecialty && serviceData.veterinarianSpecialty.length > 0) {
        const vets = await VeterinarianService.getVeterinariansBySpecialty(
          serviceData.veterinarianSpecialty[0]
        );
        setAvailableVeterinarians(vets);
      } else {
        const allVets = await VeterinarianService.getAllVeterinarians();
        setAvailableVeterinarians(allVets);
      }
    } catch (err) {
      setError('Error al cargar los detalles del servicio');
      console.error('Error loading service details:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Servicio no encontrado'}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/servicios">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a servicios
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/servicios">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a servicios
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información principal del servicio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Imagen y título */}
          <Card>
            <div className="relative h-64 md:h-80">
              <Image
                src={service.image || '/services/default-service.jpg'}
                alt={service.name}
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge className={getCategoryColor(service.category)}>
                  {getCategoryLabel(service.category)}
                </Badge>
              </div>
              {service.requiresPreparation && (
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white/90">
                    <Info className="h-3 w-3 mr-1" />
                    Preparación requerida
                  </Badge>
                </div>
              )}
            </div>
            
            <CardHeader>
              <CardTitle className="text-2xl">{service.name}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {service.duration} minutos
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  S/. {service.price.toFixed(2)}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Descripción */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción del Servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </CardContent>
          </Card>

          {/* Instrucciones de preparación */}
          {service.requiresPreparation && service.preparationInstructions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Preparación Requerida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {service.preparationInstructions}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Especialidades requeridas */}
          {service.veterinarianSpecialty && service.veterinarianSpecialty.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Especialidades Veterinarias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {service.veterinarianSpecialty.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      <Stethoscope className="h-3 w-3 mr-1" />
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Veterinarios disponibles */}
          {availableVeterinarians.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Veterinarios Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {availableVeterinarians.slice(0, 3).map((vet) => (
                    <div key={vet.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{vet.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {vet.specialties.join(', ')}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{vet.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {vet.yearsOfExperience} años exp.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel lateral - Reserva de cita */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reservar Cita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Precio:</span>
                  <span className="text-lg font-bold">S/. {service.price.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Duración:</span>
                  <span className="font-medium">{service.duration} min</span>
                </div>

                <Separator />

                {!showBooking ? (
                  <Button 
                    className="w-full" 
                    onClick={() => setShowBooking(true)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Reservar Cita
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <AppointmentBooking
                      service={service}
                      onBookingComplete={(appointmentId) => {
                        console.log('Cita reservada:', appointmentId);
                        setShowBooking(false);
                        // Aquí podrías mostrar un mensaje de éxito o redirigir
                      }}
                      onCancel={() => setShowBooking(false)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información Importante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Confirmación inmediata</p>
                  <p className="text-xs text-muted-foreground">
                    Recibirás confirmación por email
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Recordatorios automáticos</p>
                  <p className="text-xs text-muted-foreground">
                    Te recordaremos tu cita 24h antes
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Cancelación flexible</p>
                  <p className="text-xs text-muted-foreground">
                    Cancela hasta 2 horas antes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}