// Gestión de citas veterinarias
import { 
  Appointment, 
  AppointmentStatus, 
  AppointmentPriority, 
  AppointmentFilters,
  ReminderType,
  PaymentStatus
} from '@/types/veterinary';
import { VeterinarianService } from './veterinarians';
import { AuthService } from './auth';

// Datos simulados de citas - con persistencia en localStorage
const getAppointmentsFromStorage = (): Appointment[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('ecommercevet_appointments');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convertir strings de fecha de vuelta a Date objects
      return parsed.map((apt: Appointment) => ({
        ...apt,
        date: new Date(apt.date),
        createdAt: new Date(apt.createdAt),
        updatedAt: new Date(apt.updatedAt),
        followUpDate: apt.followUpDate ? new Date(apt.followUpDate) : undefined
      }));
    }
  } catch (error) {
    console.error('Error loading appointments from storage:', error);
  }
  return getDefaultAppointments();
};

const saveAppointmentsToStorage = (appointments: Appointment[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ecommercevet_appointments', JSON.stringify(appointments));
    console.log('✅ Citas guardadas en localStorage:', appointments.length);
  } catch (error) {
    console.error('Error saving appointments to storage:', error);
  }
};

const getDefaultAppointments = (): Appointment[] => [
  {
    id: '1',
    clientId: 'client_001',
    petId: 'pet_001',
    veterinarianId: '1',
    serviceId: '1',
    date: new Date(),
    startTime: '09:00',
    endTime: '09:30',
    status: AppointmentStatus.CONFIRMED,
    priority: AppointmentPriority.NORMAL,
    reason: 'Consulta de rutina',
    notes: 'Primera visita del año',
    symptoms: 'Revisión general de salud',
    followUpRequired: false,
    remindersSent: [ReminderType.EMAIL],
    paymentStatus: PaymentStatus.PENDING,
    totalCost: 80.00,
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date(),
    // Relaciones para la UI
    pet: { id: 'pet_001', name: 'Luna' },
    client: { id: 'client_001', name: 'María García', email: 'maria@example.com' },
    veterinarian: { id: '1', name: 'Dr. Carlos Ruiz' },
    service: { id: '1', name: 'Consulta General' }
  },
  {
    id: '2',
    clientId: 'client_002',
    petId: 'pet_002',
    veterinarianId: '2',
    serviceId: '2',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
    startTime: '10:00',
    endTime: '10:20',
    status: AppointmentStatus.SCHEDULED,
    priority: AppointmentPriority.HIGH,
    reason: 'Vacunación anual',
    symptoms: 'Aplicación de vacunas múltiples',
    followUpRequired: true,
    followUpDate: new Date('2025-01-21'),
    remindersSent: [],
    paymentStatus: PaymentStatus.PENDING,
    totalCost: 120.00,
    createdAt: new Date('2024-12-16'),
    updatedAt: new Date(),
    // Relaciones para la UI
    pet: { id: 'pet_002', name: 'Max', species: 'CAT' },
    client: { id: 'client_002', name: 'Juan Pérez', email: 'juan@example.com' },
    veterinarian: { id: '2', name: 'Dra. Ana Martínez', specialties: ['GENERAL'] },
    service: { id: '2', name: 'Vacunación', price: 120 }
  }
];

// Inicializar appointments con datos del storage
let appointments: Appointment[] = [];

// Función para inicializar appointments (se llama cuando se necesita)
const initializeAppointments = () => {
  if (appointments.length === 0) {
    appointments = getAppointmentsFromStorage();
    console.log('📅 Appointments initialized:', appointments.length, 'citas cargadas');
  }
  return appointments;
};

export class AppointmentService {
  // Crear nueva cita
  static async createAppointment(
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'remindersSent'>
  ): Promise<Appointment> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('🔄 Iniciando creación de cita:', appointmentData);
        
        // Inicializar appointments si es necesario
        initializeAppointments();

        // Verificar disponibilidad del veterinario
        const veterinarian = await VeterinarianService.getVeterinarianById(appointmentData.veterinarianId);
        if (!veterinarian) {
          console.error('❌ Veterinario no encontrado:', appointmentData.veterinarianId);
          reject(new Error('Veterinario no encontrado'));
          return;
        }

        const isAvailable = VeterinarianService.isVeterinarianAvailable(
          veterinarian,
          appointmentData.date,
          appointmentData.startTime,
          appointmentData.endTime
        );

        if (!isAvailable) {
          console.error('❌ Veterinario no disponible en horario:', appointmentData.startTime);
          reject(new Error('El veterinario no está disponible en el horario seleccionado'));
          return;
        }

        // Verificar conflictos con otras citas
        const hasConflict = this.hasTimeConflict(
          appointmentData.veterinarianId,
          appointmentData.date,
          appointmentData.startTime,
          appointmentData.endTime
        );

        if (hasConflict) {
          console.error('❌ Conflicto de horario detectado');
          reject(new Error('Ya existe una cita en el horario seleccionado'));
          return;
        }

        setTimeout(() => {
          const newAppointment: Appointment = {
            ...appointmentData,
            id: Date.now().toString(), // ID único basado en timestamp
            status: AppointmentStatus.SCHEDULED,
            remindersSent: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };

          console.log('✅ Creando nueva cita:', newAppointment);
          appointments.push(newAppointment);
          
          // Guardar en localStorage
          saveAppointmentsToStorage(appointments);
          console.log('💾 Cita guardada. Total citas:', appointments.length);
          
          // Enviar confirmación automática
          this.sendConfirmationNotification(newAppointment);
          
          resolve(newAppointment);
        }, 500);
      } catch (error) {
        console.error('❌ Error en createAppointment:', error);
        reject(error);
      }
    });
  }

  // Obtener citas con filtros
  static async getAppointments(filters: AppointmentFilters = {}): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Inicializar appointments
        initializeAppointments();
        
        let filteredAppointments = [...appointments];

        if (filters.veterinarianId) {
          filteredAppointments = filteredAppointments.filter(
            apt => apt.veterinarianId === filters.veterinarianId
          );
        }

        if (filters.clientId) {
          filteredAppointments = filteredAppointments.filter(
            apt => apt.clientId === filters.clientId
          );
        }

        if (filters.petId) {
          filteredAppointments = filteredAppointments.filter(
            apt => apt.petId === filters.petId
          );
        }

        if (filters.serviceId) {
          filteredAppointments = filteredAppointments.filter(
            apt => apt.serviceId === filters.serviceId
          );
        }

        if (filters.status) {
          filteredAppointments = filteredAppointments.filter(
            apt => apt.status === filters.status
          );
        }

        if (filters.priority) {
          filteredAppointments = filteredAppointments.filter(
            apt => apt.priority === filters.priority
          );
        }

        if (filters.dateFrom) {
          filteredAppointments = filteredAppointments.filter(
            apt => apt.date >= filters.dateFrom!
          );
        }

        if (filters.dateTo) {
          filteredAppointments = filteredAppointments.filter(
            apt => apt.date <= filters.dateTo!
          );
        }

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredAppointments = filteredAppointments.filter(
            apt => 
              apt.reason.toLowerCase().includes(searchTerm) ||
              apt.notes?.toLowerCase().includes(searchTerm) ||
              apt.symptoms?.toLowerCase().includes(searchTerm)
          );
        }

        // Ordenar por fecha y hora
        filteredAppointments.sort((a, b) => {
          const dateA = new Date(`${a.date.toDateString()} ${a.startTime}`);
          const dateB = new Date(`${b.date.toDateString()} ${b.startTime}`);
          return dateA.getTime() - dateB.getTime();
        });

        console.log('📋 Citas filtradas:', filteredAppointments.length);
        resolve(filteredAppointments);
      }, 300);
    });
  }

  // Obtener cita por ID
  static async getAppointmentById(id: string): Promise<Appointment | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeAppointments();
        const appointment = appointments.find(apt => apt.id === id);
        resolve(appointment || null);
      }, 200);
    });
  }

  // Verificar conflictos de horario
  private static hasTimeConflict(
    veterinarianId: string,
    date: Date,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: string
  ): boolean {
    const conflictingAppointments = appointments.filter(apt => 
      apt.veterinarianId === veterinarianId &&
      apt.date.toDateString() === date.toDateString() &&
      apt.status !== AppointmentStatus.CANCELLED &&
      apt.id !== excludeAppointmentId
    );

    return conflictingAppointments.some(apt => {
      const existingStart = this.timeToMinutes(apt.startTime);
      const existingEnd = this.timeToMinutes(apt.endTime);
      const newStart = this.timeToMinutes(startTime);
      const newEnd = this.timeToMinutes(endTime);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  }

  // Enviar notificaciones (usando API route del servidor)
  private static async sendConfirmationNotification(appointment: Appointment): Promise<void> {
    const user = AuthService.getUserById(appointment.clientId);
    const userEmail = user ? user.email : 'kerrymamani@gmail.com';

    try {
      console.log('📧 Enviando email de confirmación a:', userEmail);
      await fetch('/api/send-appointment-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointment,
          userEmail,
          type: 'confirmation'
        }),
      });
    } catch (error) {
      console.error('Error enviando email:', error);
    }
  }

  // Utilidades
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private static addMinutesToTime(time: string, minutes: number): string {
    const totalMinutes = this.timeToMinutes(time) + minutes;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // Cancelar cita
  static async cancelAppointment(id: string, reason?: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeAppointments();
        const index = appointments.findIndex(apt => apt.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }

        appointments[index] = {
          ...appointments[index],
          status: AppointmentStatus.CANCELLED,
          notes: reason ? `Cancelada: ${reason}` : 'Cancelada',
          updatedAt: new Date()
        };

        // Guardar cambios
        saveAppointmentsToStorage(appointments);
        resolve(true);
      }, 300);
    });
  }

  // Actualizar estado de cita
  static async updateAppointmentStatus(
    id: string, 
    status: AppointmentStatus, 
    notes?: string
  ): Promise<Appointment | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeAppointments();
        const index = appointments.findIndex(apt => apt.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }

        appointments[index] = {
          ...appointments[index],
          status,
          notes: notes || appointments[index].notes,
          updatedAt: new Date()
        };

        // Guardar cambios
        saveAppointmentsToStorage(appointments);
        resolve(appointments[index]);
      }, 300);
    });
  }
}