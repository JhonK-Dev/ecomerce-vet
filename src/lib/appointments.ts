// Gestión de citas veterinarias
import { 
  Appointment, 
  AppointmentStatus, 
  AppointmentPriority, 
  AppointmentFilters,
  AppointmentSlot,
  ReminderType,
  PaymentStatus
} from '@/types/veterinary';
import { VeterinarianService } from './veterinarians';
import { VeterinaryServiceService } from './veterinary-services';
import { AuthService } from './auth';
import { EmailService } from './email';

// Datos simulados de citas
const appointments: Appointment[] = [
  {
    id: '1',
    clientId: 'client_001',
    petId: 'pet_001',
    veterinarianId: '1',
    serviceId: '1',
    date: new Date('2024-12-20'),
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
    updatedAt: new Date()
  },
  {
    id: '2',
    clientId: 'client_002',
    petId: 'pet_002',
    veterinarianId: '2',
    serviceId: '2',
    date: new Date('2024-12-21'),
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
    updatedAt: new Date()
  }
];

export class AppointmentService {
  // Crear nueva cita
  static async createAppointment(
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'remindersSent'>
  ): Promise<Appointment> {
    return new Promise(async (resolve, reject) => {
      try {
        // Verificar disponibilidad del veterinario
        const veterinarian = await VeterinarianService.getVeterinarianById(appointmentData.veterinarianId);
        if (!veterinarian) {
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
          reject(new Error('Ya existe una cita en el horario seleccionado'));
          return;
        }

        setTimeout(() => {
          const newAppointment: Appointment = {
            ...appointmentData,
            id: (appointments.length + 1).toString(),
            status: AppointmentStatus.SCHEDULED,
            remindersSent: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };

          appointments.push(newAppointment);
          
          // Enviar confirmación automática
          this.sendConfirmationNotification(newAppointment);
          
          resolve(newAppointment);
        }, 500);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Obtener citas con filtros
  static async getAppointments(filters: AppointmentFilters = {}): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
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

        resolve(filteredAppointments);
      }, 300);
    });
  }

  // Obtener cita por ID
  static async getAppointmentById(id: string): Promise<Appointment | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointment = appointments.find(apt => apt.id === id);
        resolve(appointment || null);
      }, 200);
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

        // Enviar notificación de cambio de estado
        this.sendStatusChangeNotification(appointments[index]);

        resolve(appointments[index]);
      }, 300);
    });
  }

  // Reprogramar cita
  static async rescheduleAppointment(
    id: string,
    newDate: Date,
    newStartTime: string,
    newEndTime: string
  ): Promise<Appointment | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const appointment = await this.getAppointmentById(id);
        if (!appointment) {
          reject(new Error('Cita no encontrada'));
          return;
        }

        // Verificar disponibilidad en la nueva fecha/hora
        const veterinarian = await VeterinarianService.getVeterinarianById(appointment.veterinarianId);
        if (!veterinarian) {
          reject(new Error('Veterinario no encontrado'));
          return;
        }

        const isAvailable = VeterinarianService.isVeterinarianAvailable(
          veterinarian,
          newDate,
          newStartTime,
          newEndTime
        );

        if (!isAvailable) {
          reject(new Error('El veterinario no está disponible en el nuevo horario'));
          return;
        }

        setTimeout(() => {
          const index = appointments.findIndex(apt => apt.id === id);
          if (index !== -1) {
            appointments[index] = {
              ...appointments[index],
              date: newDate,
              startTime: newStartTime,
              endTime: newEndTime,
              status: AppointmentStatus.RESCHEDULED,
              updatedAt: new Date()
            };

            // Enviar notificación de reprogramación
            this.sendRescheduleNotification(appointments[index]);

            resolve(appointments[index]);
          } else {
            resolve(null);
          }
        }, 300);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Cancelar cita
  static async cancelAppointment(id: string, reason?: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
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

        // Enviar notificación de cancelación
        this.sendCancellationNotification(appointments[index]);

        resolve(true);
      }, 300);
    });
  }

  // Obtener slots disponibles para una fecha y veterinario
  static async getAvailableSlots(
    veterinarianId: string,
    date: Date,
    serviceDuration: number = 30
  ): Promise<AppointmentSlot[]> {
    return new Promise(async (resolve) => {
      try {
        const availableTimeSlots = await VeterinarianService.getAvailableSlots(
          veterinarianId,
          date,
          serviceDuration
        );

        // Obtener citas existentes para esa fecha
        const existingAppointments = await this.getAppointments({
          veterinarianId,
          dateFrom: date,
          dateTo: date
        });

        const slots: AppointmentSlot[] = availableTimeSlots.map(startTime => {
          const endTime = this.addMinutesToTime(startTime, serviceDuration);
          const isAvailable = !this.hasTimeConflict(veterinarianId, date, startTime, endTime);

          return {
            date,
            startTime,
            endTime,
            veterinarianId,
            isAvailable
          };
        });

        resolve(slots);
      } catch (error) {
        resolve([]);
      }
    });
  }

  // Obtener próximas citas de un cliente
  static async getUpcomingAppointments(clientId: string): Promise<Appointment[]> {
    const today = new Date();
    return this.getAppointments({
      clientId,
      dateFrom: today,
      status: AppointmentStatus.CONFIRMED
    });
  }

  // Obtener historial de citas de una mascota
  static async getPetAppointmentHistory(petId: string): Promise<Appointment[]> {
    return this.getAppointments({ petId });
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
    const userEmail = user ? user.email : 'delivered@resend.dev';

    try {
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

  private static async sendStatusChangeNotification(appointment: Appointment): Promise<void> {
    const user = AuthService.getUserById(appointment.clientId);
    const userEmail = user ? user.email : 'delivered@resend.dev';
    
    try {
      await fetch('/api/send-appointment-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment, userEmail, type: 'reminder' }),
      });
    } catch (error) {
      console.error('Error enviando notificación de cambio de estado:', error);
    }
  }

  private static async sendRescheduleNotification(appointment: Appointment): Promise<void> {
    const user = AuthService.getUserById(appointment.clientId);
    const userEmail = user ? user.email : 'delivered@resend.dev';
    
    try {
      await fetch('/api/send-appointment-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment, userEmail, type: 'reminder' }),
      });
    } catch (error) {
      console.error('Error enviando notificación de reprogramación:', error);
    }
  }

  private static async sendCancellationNotification(appointment: Appointment): Promise<void> {
    const user = AuthService.getUserById(appointment.clientId);
    const userEmail = user ? user.email : 'delivered@resend.dev';
    
    try {
      await fetch('/api/send-appointment-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment, userEmail, type: 'cancellation' }),
      });
    } catch (error) {
      console.error('Error enviando notificación de cancelación:', error);
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
}