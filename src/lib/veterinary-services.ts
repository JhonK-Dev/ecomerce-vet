// Gestión de servicios veterinarios
import { 
  VeterinaryService, 
  ServiceCategory, 
  VeterinarianSpecialty,
  ServiceFilters,
  PaginationParams 
} from '@/types/veterinary';
import { 
  VETERINARY_SERVICES
} from './constants';

// Datos simulados de servicios veterinarios usando constantes
const veterinaryServices: VeterinaryService[] = [
  {
    id: VETERINARY_SERVICES[0].id,
    name: VETERINARY_SERVICES[0].name,
    description: VETERINARY_SERVICES[0].description,
    category: ServiceCategory.CONSULTATION,
    duration: VETERINARY_SERVICES[0].duration,
    price: VETERINARY_SERVICES[0].price,
    isActive: true,
    requiresPreparation: false,
    image: '/services/consultation.jpg',
    veterinarianSpecialty: [VeterinarianSpecialty.GENERAL],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: VETERINARY_SERVICES[1].id,
    name: VETERINARY_SERVICES[1].name,
    description: VETERINARY_SERVICES[1].description,
    category: ServiceCategory.VACCINATION,
    duration: VETERINARY_SERVICES[1].duration,
    price: VETERINARY_SERVICES[1].price,
    isActive: true,
    requiresPreparation: true,
    preparationInstructions: 'La mascota debe estar en ayunas 2 horas antes. Traer cartilla de vacunación.',
    image: '/services/vaccination.jpg',
    veterinarianSpecialty: [VeterinarianSpecialty.GENERAL],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Cirugía de Esterilización',
    description: 'Procedimiento quirúrgico de esterilización para perros y gatos.',
    category: ServiceCategory.SURGERY,
    duration: 120,
    price: 350.00,
    isActive: true,
    requiresPreparation: true,
    preparationInstructions: 'Ayuno completo 12 horas antes. Análisis pre-quirúrgicos requeridos.',
    image: '/services/surgery.jpg',
    veterinarianSpecialty: [VeterinarianSpecialty.SURGERY],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Baño y Peluquería',
    description: 'Servicio completo de higiene: baño, corte de pelo, corte de uñas y limpieza de oídos.',
    category: ServiceCategory.GROOMING,
    duration: 90,
    price: 60.00,
    isActive: true,
    requiresPreparation: false,
    image: '/services/grooming.jpg',
    veterinarianSpecialty: [VeterinarianSpecialty.GENERAL],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Desparasitación Interna',
    description: 'Tratamiento antiparasitario interno con medicamentos de última generación.',
    category: ServiceCategory.DEWORMING,
    duration: 15,
    price: 45.00,
    isActive: true,
    requiresPreparation: false,
    image: '/services/deworming.jpg',
    veterinarianSpecialty: [VeterinarianSpecialty.GENERAL],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Limpieza Dental',
    description: 'Profilaxis dental profesional con ultrasonido y pulido.',
    category: ServiceCategory.DENTAL,
    duration: 60,
    price: 180.00,
    isActive: true,
    requiresPreparation: true,
    preparationInstructions: 'Ayuno 8 horas antes del procedimiento. Análisis pre-anestésicos requeridos.',
    image: '/services/dental.jpg',
    veterinarianSpecialty: [VeterinarianSpecialty.GENERAL],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '7',
    name: 'Consulta de Emergencia',
    description: 'Atención inmediata para casos urgentes y emergencias médicas.',
    category: ServiceCategory.EMERGENCY,
    duration: 45,
    price: 150.00,
    isActive: true,
    requiresPreparation: false,
    image: '/services/emergency.jpg',
    veterinarianSpecialty: [VeterinarianSpecialty.GENERAL, VeterinarianSpecialty.SURGERY],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '8',
    name: 'Análisis de Laboratorio',
    description: 'Exámenes de sangre, orina y heces para diagnóstico preciso.',
    category: ServiceCategory.LABORATORY,
    duration: 30,
    price: 95.00,
    isActive: true,
    requiresPreparation: true,
    preparationInstructions: 'Ayuno 12 horas para análisis de sangre. Muestra de orina matutina.',
    image: '/services/laboratory.jpg',
    veterinarianSpecialty: [VeterinarianSpecialty.GENERAL],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '9',
    name: 'Radiografía',
    description: 'Estudios radiográficos digitales para diagnóstico por imagen.',
    category: ServiceCategory.IMAGING,
    duration: 45,
    price: 120.00,
    isActive: true,
    requiresPreparation: false,
    image: '/services/xray.jpg',
    veterinarianSpecialty: [VeterinarianSpecialty.GENERAL, VeterinarianSpecialty.ORTHOPEDICS],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '10',
    name: 'Fisioterapia',
    description: 'Sesiones de rehabilitación y fisioterapia para recuperación post-quirúrgica.',
    category: ServiceCategory.THERAPY,
    duration: 60,
    price: 85.00,
    isActive: true,
    requiresPreparation: false,
    image: '/services/physiotherapy.jpg',
    veterinarianSpecialty: [VeterinarianSpecialty.ORTHOPEDICS],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

export class VeterinaryServiceService {
  // Obtener todos los servicios
  static async getAllServices(): Promise<VeterinaryService[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(veterinaryServices.filter(service => service.isActive));
      }, 300);
    });
  }

  // Obtener servicios con filtros y paginación
  static async getServices(
    filters: ServiceFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<{ services: VeterinaryService[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredServices = [...veterinaryServices];

        // Aplicar filtros
        if (filters.category) {
          filteredServices = filteredServices.filter(
            service => service.category === filters.category
          );
        }

        if (filters.veterinarianSpecialty) {
          filteredServices = filteredServices.filter(
            service => service.veterinarianSpecialty?.includes(filters.veterinarianSpecialty!)
          );
        }

        if (filters.priceMin !== undefined) {
          filteredServices = filteredServices.filter(
            service => service.price >= filters.priceMin!
          );
        }

        if (filters.priceMax !== undefined) {
          filteredServices = filteredServices.filter(
            service => service.price <= filters.priceMax!
          );
        }

        if (filters.durationMin !== undefined) {
          filteredServices = filteredServices.filter(
            service => service.duration >= filters.durationMin!
          );
        }

        if (filters.durationMax !== undefined) {
          filteredServices = filteredServices.filter(
            service => service.duration <= filters.durationMax!
          );
        }

        if (filters.isActive !== undefined) {
          filteredServices = filteredServices.filter(
            service => service.isActive === filters.isActive
          );
        }

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredServices = filteredServices.filter(
            service =>
              service.name.toLowerCase().includes(searchTerm) ||
              service.description.toLowerCase().includes(searchTerm)
          );
        }

        // Ordenar
        filteredServices.sort((a, b) => a.name.localeCompare(b.name));

        // Paginación
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedServices = filteredServices.slice(startIndex, endIndex);

        resolve({
          services: paginatedServices,
          total: filteredServices.length
        });
      }, 300);
    });
  }

  // Obtener servicio por ID
  static async getServiceById(id: string): Promise<VeterinaryService | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const service = veterinaryServices.find(s => s.id === id);
        resolve(service || null);
      }, 200);
    });
  }

  // Obtener servicios por categoría
  static async getServicesByCategory(category: ServiceCategory): Promise<VeterinaryService[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const services = veterinaryServices.filter(
          service => service.category === category && service.isActive
        );
        resolve(services);
      }, 200);
    });
  }

  // Obtener servicios populares
  static async getPopularServices(limit: number = 6): Promise<VeterinaryService[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular popularidad basada en ID (en producción usar datos reales)
        const popularServices = veterinaryServices
          .filter(service => service.isActive)
          .sort((a, b) => parseInt(a.id) - parseInt(b.id))
          .slice(0, limit);
        resolve(popularServices);
      }, 200);
    });
  }

  // Obtener servicios de emergencia
  static async getEmergencyServices(): Promise<VeterinaryService[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const emergencyServices = veterinaryServices.filter(
          service => service.category === ServiceCategory.EMERGENCY && service.isActive
        );
        resolve(emergencyServices);
      }, 200);
    });
  }

  // Crear nuevo servicio (Admin)
  static async createService(serviceData: Omit<VeterinaryService, 'id' | 'createdAt' | 'updatedAt'>): Promise<VeterinaryService> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newService: VeterinaryService = {
          ...serviceData,
          id: (veterinaryServices.length + 1).toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        veterinaryServices.push(newService);
        resolve(newService);
      }, 500);
    });
  }

  // Actualizar servicio (Admin)
  static async updateService(id: string, updates: Partial<VeterinaryService>): Promise<VeterinaryService | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = veterinaryServices.findIndex(s => s.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }

        veterinaryServices[index] = {
          ...veterinaryServices[index],
          ...updates,
          updatedAt: new Date()
        };

        resolve(veterinaryServices[index]);
      }, 500);
    });
  }

  // Eliminar servicio (Admin)
  static async deleteService(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = veterinaryServices.findIndex(s => s.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }

        // Soft delete - marcar como inactivo
        veterinaryServices[index].isActive = false;
        veterinaryServices[index].updatedAt = new Date();
        resolve(true);
      }, 300);
    });
  }

  // Obtener categorías disponibles
  static getServiceCategories(): { value: ServiceCategory; label: string; description: string }[] {
    return [
      { 
        value: ServiceCategory.CONSULTATION, 
        label: 'Consultas', 
        description: 'Exámenes médicos y evaluaciones generales' 
      },
      { 
        value: ServiceCategory.VACCINATION, 
        label: 'Vacunación', 
        description: 'Inmunización y prevención de enfermedades' 
      },
      { 
        value: ServiceCategory.SURGERY, 
        label: 'Cirugías', 
        description: 'Procedimientos quirúrgicos especializados' 
      },
      { 
        value: ServiceCategory.GROOMING, 
        label: 'Peluquería', 
        description: 'Servicios de higiene y estética' 
      },
      { 
        value: ServiceCategory.DEWORMING, 
        label: 'Desparasitación', 
        description: 'Tratamientos antiparasitarios' 
      },
      { 
        value: ServiceCategory.DENTAL, 
        label: 'Dental', 
        description: 'Cuidado y limpieza dental' 
      },
      { 
        value: ServiceCategory.EMERGENCY, 
        label: 'Emergencias', 
        description: 'Atención médica urgente' 
      },
      { 
        value: ServiceCategory.LABORATORY, 
        label: 'Laboratorio', 
        description: 'Análisis y estudios diagnósticos' 
      },
      { 
        value: ServiceCategory.IMAGING, 
        label: 'Imagenología', 
        description: 'Radiografías y estudios por imagen' 
      },
      { 
        value: ServiceCategory.THERAPY, 
        label: 'Terapias', 
        description: 'Rehabilitación y fisioterapia' 
      }
    ];
  }

  // Calcular duración total de múltiples servicios
  static calculateTotalDuration(serviceIds: string[]): number {
    return serviceIds.reduce((total, id) => {
      const service = veterinaryServices.find(s => s.id === id);
      return total + (service?.duration || 0);
    }, 0);
  }

  // Calcular costo total de múltiples servicios
  static calculateTotalCost(serviceIds: string[]): number {
    return serviceIds.reduce((total, id) => {
      const service = veterinaryServices.find(s => s.id === id);
      return total + (service?.price || 0);
    }, 0);
  }
}