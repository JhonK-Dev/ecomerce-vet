// Gestión de veterinarios
import { 
  Veterinarian, 
  VeterinarianSpecialty, 
  WorkingHours
} from '@/types/veterinary';

// Horario de trabajo por defecto
const defaultWorkingHours: WorkingHours = {
  monday: { isWorking: true, startTime: '08:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
  tuesday: { isWorking: true, startTime: '08:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
  wednesday: { isWorking: true, startTime: '08:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
  thursday: { isWorking: true, startTime: '08:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
  friday: { isWorking: true, startTime: '08:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
  saturday: { isWorking: true, startTime: '08:00', endTime: '14:00' },
  sunday: { isWorking: false, startTime: '', endTime: '' }
};

// Datos simulados de veterinarios
const veterinarians: Veterinarian[] = [
  {
    id: '1',
    userId: 'vet_1', // ID de Clerk
    name: 'Dr. María González',
    email: 'maria.gonzalez@ecommercevet.com',
    phone: '+51 999 777 666',
    specialties: [VeterinarianSpecialty.GENERAL, VeterinarianSpecialty.SURGERY],
    licenseNumber: 'VET-001-2020',
    experience: 8,
    bio: 'Veterinaria especializada en cirugía general con más de 8 años de experiencia. Graduada de la Universidad Nacional Mayor de San Marcos.',
    avatar: '/avatars/vet-maria.jpg',
    isActive: true,
    workingHours: defaultWorkingHours,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: '2',
    userId: 'vet_2',
    name: 'Dr. Carlos Mendoza',
    email: 'carlos.mendoza@ecommercevet.com',
    phone: '+51 999 888 777',
    specialties: [VeterinarianSpecialty.CARDIOLOGY, VeterinarianSpecialty.GENERAL],
    licenseNumber: 'VET-002-2019',
    experience: 12,
    bio: 'Especialista en cardiología veterinaria con certificación internacional. Experto en diagnóstico y tratamiento de enfermedades cardíacas.',
    avatar: '/avatars/vet-carlos.jpg',
    isActive: true,
    workingHours: {
      ...defaultWorkingHours,
      saturday: { isWorking: false, startTime: '', endTime: '' },
      sunday: { isWorking: true, startTime: '09:00', endTime: '13:00' }
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date()
  },
  {
    id: '3',
    userId: 'vet_3',
    name: 'Dra. Ana Rodríguez',
    email: 'ana.rodriguez@ecommercevet.com',
    phone: '+51 999 666 555',
    specialties: [VeterinarianSpecialty.DERMATOLOGY, VeterinarianSpecialty.GENERAL],
    licenseNumber: 'VET-003-2021',
    experience: 6,
    bio: 'Dermatóloga veterinaria especializada en enfermedades de la piel y alergias. Certificada en dermatología avanzada.',
    avatar: '/avatars/vet-ana.jpg',
    isActive: true,
    workingHours: {
      ...defaultWorkingHours,
      wednesday: { isWorking: false, startTime: '', endTime: '' },
      saturday: { isWorking: true, startTime: '08:00', endTime: '16:00' }
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date()
  },
  {
    id: '4',
    userId: 'vet_4',
    name: 'Dr. Luis Fernández',
    email: 'luis.fernandez@ecommercevet.com',
    phone: '+51 999 555 444',
    specialties: [VeterinarianSpecialty.ORTHOPEDICS, VeterinarianSpecialty.SURGERY],
    licenseNumber: 'VET-004-2018',
    experience: 15,
    bio: 'Cirujano ortopédico veterinario con amplia experiencia en traumatología y cirugía de huesos. Especialista en rehabilitación.',
    avatar: '/avatars/vet-luis.jpg',
    isActive: true,
    workingHours: {
      ...defaultWorkingHours,
      sunday: { isWorking: true, startTime: '08:00', endTime: '12:00' }
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date()
  },
  {
    id: '5',
    userId: 'vet_5',
    name: 'Dra. Patricia Silva',
    email: 'patricia.silva@ecommercevet.com',
    phone: '+51 999 444 333',
    specialties: [VeterinarianSpecialty.EXOTIC_ANIMALS, VeterinarianSpecialty.GENERAL],
    licenseNumber: 'VET-005-2022',
    experience: 4,
    bio: 'Especialista en animales exóticos: aves, reptiles, pequeños mamíferos. Certificada en medicina de fauna silvestre.',
    avatar: '/avatars/vet-patricia.jpg',
    isActive: true,
    workingHours: {
      ...defaultWorkingHours,
      monday: { isWorking: false, startTime: '', endTime: '' },
      saturday: { isWorking: true, startTime: '10:00', endTime: '16:00' }
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date()
  }
];

export class VeterinarianService {
  // Obtener todos los veterinarios activos
  static async getAllVeterinarians(): Promise<Veterinarian[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(veterinarians.filter(vet => vet.isActive));
      }, 200);
    });
  }

  // Obtener veterinario por ID
  static async getVeterinarianById(id: string): Promise<Veterinarian | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const veterinarian = veterinarians.find(v => v.id === id);
        resolve(veterinarian || null);
      }, 150);
    });
  }

  // Obtener veterinario por User ID de Clerk
  static async getVeterinarianByUserId(userId: string): Promise<Veterinarian | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const veterinarian = veterinarians.find(v => v.userId === userId);
        resolve(veterinarian || null);
      }, 150);
    });
  }

  // Obtener veterinarios por especialidad
  static async getVeterinariansBySpecialty(specialty: VeterinarianSpecialty): Promise<Veterinarian[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const vets = veterinarians.filter(
          vet => vet.isActive && vet.specialties.includes(specialty)
        );
        resolve(vets);
      }, 200);
    });
  }

  // Obtener veterinarios disponibles en una fecha específica
  static async getAvailableVeterinarians(date: Date): Promise<Veterinarian[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof WorkingHours;
        const availableVets = veterinarians.filter(vet => {
          if (!vet.isActive) return false;
          const daySchedule = vet.workingHours[dayOfWeek];
          return daySchedule.isWorking;
        });
        resolve(availableVets);
      }, 200);
    });
  }

  // Verificar si un veterinario está disponible en un horario específico
  static isVeterinarianAvailable(
    veterinarian: Veterinarian, 
    date: Date, 
    startTime: string, 
    endTime: string
  ): boolean {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof WorkingHours;
    const daySchedule = veterinarian.workingHours[dayOfWeek];

    if (!daySchedule.isWorking) return false;

    // Convertir horarios a minutos para comparación
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const scheduleStart = timeToMinutes(daySchedule.startTime);
    const scheduleEnd = timeToMinutes(daySchedule.endTime);
    const appointmentStart = timeToMinutes(startTime);
    const appointmentEnd = timeToMinutes(endTime);

    // Verificar que la cita esté dentro del horario de trabajo
    if (appointmentStart < scheduleStart || appointmentEnd > scheduleEnd) {
      return false;
    }

    // Verificar que no esté en horario de descanso
    if (daySchedule.breakStart && daySchedule.breakEnd) {
      const breakStart = timeToMinutes(daySchedule.breakStart);
      const breakEnd = timeToMinutes(daySchedule.breakEnd);
      
      // Si la cita se superpone con el descanso
      if (appointmentStart < breakEnd && appointmentEnd > breakStart) {
        return false;
      }
    }

    return true;
  }

  // Obtener horarios disponibles de un veterinario para una fecha
  static async getAvailableSlots(
    veterinarianId: string, 
    date: Date, 
    serviceDuration: number = 30
  ): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const veterinarian = veterinarians.find(v => v.id === veterinarianId);
        if (!veterinarian) {
          resolve([]);
          return;
        }

        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof WorkingHours;
        const daySchedule = veterinarian.workingHours[dayOfWeek];

        if (!daySchedule.isWorking) {
          resolve([]);
          return;
        }

        const slots: string[] = [];
        const timeToMinutes = (time: string) => {
          const [hours, minutes] = time.split(':').map(Number);
          return hours * 60 + minutes;
        };

        const minutesToTime = (minutes: number) => {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        };

        const startMinutes = timeToMinutes(daySchedule.startTime);
        const endMinutes = timeToMinutes(daySchedule.endTime);
        const breakStart = daySchedule.breakStart ? timeToMinutes(daySchedule.breakStart) : null;
        const breakEnd = daySchedule.breakEnd ? timeToMinutes(daySchedule.breakEnd) : null;

        // Generar slots cada 15 minutos
        for (let current = startMinutes; current + serviceDuration <= endMinutes; current += 15) {
          // Verificar que no esté en horario de descanso
          if (breakStart && breakEnd && current < breakEnd && current + serviceDuration > breakStart) {
            continue;
          }

          slots.push(minutesToTime(current));
        }

        resolve(slots);
      }, 300);
    });
  }

  // Crear nuevo veterinario (Admin)
  static async createVeterinarian(vetData: Omit<Veterinarian, 'id' | 'createdAt' | 'updatedAt'>): Promise<Veterinarian> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newVeterinarian: Veterinarian = {
          ...vetData,
          id: (veterinarians.length + 1).toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        veterinarians.push(newVeterinarian);
        resolve(newVeterinarian);
      }, 500);
    });
  }

  // Actualizar veterinario
  static async updateVeterinarian(id: string, updates: Partial<Veterinarian>): Promise<Veterinarian | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = veterinarians.findIndex(v => v.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }

        veterinarians[index] = {
          ...veterinarians[index],
          ...updates,
          updatedAt: new Date()
        };

        resolve(veterinarians[index]);
      }, 400);
    });
  }

  // Actualizar horarios de trabajo
  static async updateWorkingHours(id: string, workingHours: WorkingHours): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = veterinarians.findIndex(v => v.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }

        veterinarians[index].workingHours = workingHours;
        veterinarians[index].updatedAt = new Date();
        resolve(true);
      }, 300);
    });
  }

  // Obtener especialidades disponibles
  static getSpecialties(): { value: VeterinarianSpecialty; label: string; description: string }[] {
    return [
      { 
        value: VeterinarianSpecialty.GENERAL, 
        label: 'Medicina General', 
        description: 'Atención médica integral para todas las especies' 
      },
      { 
        value: VeterinarianSpecialty.SURGERY, 
        label: 'Cirugía', 
        description: 'Procedimientos quirúrgicos especializados' 
      },
      { 
        value: VeterinarianSpecialty.CARDIOLOGY, 
        label: 'Cardiología', 
        description: 'Diagnóstico y tratamiento de enfermedades cardíacas' 
      },
      { 
        value: VeterinarianSpecialty.DERMATOLOGY, 
        label: 'Dermatología', 
        description: 'Enfermedades de la piel y alergias' 
      },
      { 
        value: VeterinarianSpecialty.ONCOLOGY, 
        label: 'Oncología', 
        description: 'Diagnóstico y tratamiento del cáncer' 
      },
      { 
        value: VeterinarianSpecialty.OPHTHALMOLOGY, 
        label: 'Oftalmología', 
        description: 'Enfermedades y cirugía ocular' 
      },
      { 
        value: VeterinarianSpecialty.ORTHOPEDICS, 
        label: 'Ortopedia', 
        description: 'Traumatología y cirugía de huesos' 
      },
      { 
        value: VeterinarianSpecialty.EXOTIC_ANIMALS, 
        label: 'Animales Exóticos', 
        description: 'Atención especializada para fauna no convencional' 
      }
    ];
  }

  // Desactivar veterinario
  static async deactivateVeterinarian(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = veterinarians.findIndex(v => v.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }

        veterinarians[index].isActive = false;
        veterinarians[index].updatedAt = new Date();
        resolve(true);
      }, 300);
    });
  }
}