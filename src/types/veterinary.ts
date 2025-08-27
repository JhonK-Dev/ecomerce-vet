// Tipos para el módulo de servicios veterinarios

export interface VeterinaryService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  duration: number; // en minutos
  price: number;
  isActive: boolean;
  requiresPreparation: boolean;
  preparationInstructions?: string;
  image?: string;
  veterinarianSpecialty?: VeterinarianSpecialty[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ServiceCategory {
  CONSULTATION = 'consultation',
  VACCINATION = 'vaccination',
  SURGERY = 'surgery',
  GROOMING = 'grooming',
  DEWORMING = 'deworming',
  DENTAL = 'dental',
  EMERGENCY = 'emergency',
  LABORATORY = 'laboratory',
  IMAGING = 'imaging',
  THERAPY = 'therapy'
}

export enum VeterinarianSpecialty {
  GENERAL = 'general',
  SURGERY = 'surgery',
  CARDIOLOGY = 'cardiology',
  DERMATOLOGY = 'dermatology',
  ONCOLOGY = 'oncology',
  OPHTHALMOLOGY = 'ophthalmology',
  ORTHOPEDICS = 'orthopedics',
  EXOTIC_ANIMALS = 'exotic_animals'
}

export interface Veterinarian {
  id: string;
  userId: string; // Referencia al User de Clerk
  name: string;
  email: string;
  phone: string;
  specialties: VeterinarianSpecialty[];
  licenseNumber: string;
  experience: number; // años de experiencia
  bio: string;
  avatar?: string;
  isActive: boolean;
  workingHours: WorkingHours;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isWorking: boolean;
  startTime: string; // formato HH:mm
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface Pet {
  id: string;
  ownerId: string; // ID del cliente
  name: string;
  species: PetSpecies;
  breed: string;
  age: number;
  weight: number;
  gender: PetGender;
  color: string;
  microchipNumber?: string;
  medicalHistory: MedicalRecord[];
  vaccinations: Vaccination[];
  allergies: string[];
  medications: string[];
  notes: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum PetSpecies {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  RABBIT = 'rabbit',
  HAMSTER = 'hamster',
  FISH = 'fish',
  REPTILE = 'reptile',
  OTHER = 'other'
}

export enum PetGender {
  MALE = 'male',
  FEMALE = 'female'
}

export interface MedicalRecord {
  id: string;
  petId: string;
  veterinarianId: string;
  appointmentId?: string;
  date: Date;
  diagnosis: string;
  treatment: string;
  medications: Medication[];
  notes: string;
  attachments: string[];
  followUpDate?: Date;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  vaccine: string;
  date: Date;
  nextDueDate: Date;
  veterinarianId: string;
  batchNumber?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  petId: string;
  veterinarianId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  reason: string;
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  remindersSent: ReminderType[];
  paymentStatus: PaymentStatus;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones opcionales para la UI
  pet?: { id: string; name: string; species?: string };
  client?: { name: string; email: string; id: string };
  veterinarian?: { id: string; name: string; specialties?: string[] };
  service?: { id: string; name: string; price?: number };
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled'
}

export enum AppointmentPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  EMERGENCY = 'emergency'
}

export enum ReminderType {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PUSH = 'push'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIAL = 'partial',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface AppointmentSlot {
  date: Date;
  startTime: string;
  endTime: string;
  veterinarianId: string;
  isAvailable: boolean;
  isBlocked?: boolean;
  blockReason?: string;
}

export interface Calendar {
  id: string;
  veterinarianId: string;
  date: Date;
  slots: AppointmentSlot[];
  specialNotes?: string;
  isHoliday: boolean;
  holidayName?: string;
}

// Filtros y búsqueda
export interface AppointmentFilters {
  veterinarianId?: string;
  clientId?: string;
  petId?: string;
  serviceId?: string;
  status?: AppointmentStatus;
  priority?: AppointmentPriority;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface ServiceFilters {
  category?: ServiceCategory;
  veterinarianSpecialty?: VeterinarianSpecialty;
  priceMin?: number;
  priceMax?: number;
  durationMin?: number;
  durationMax?: number;
  isActive?: boolean;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

// Notificaciones y recordatorios
export interface NotificationTemplate {
  id: string;
  type: ReminderType;
  event: NotificationEvent;
  template: string;
  isActive: boolean;
  sendBefore: number; // minutos antes del evento
}

export enum NotificationEvent {
  APPOINTMENT_CONFIRMATION = 'appointment_confirmation',
  APPOINTMENT_REMINDER_24H = 'appointment_reminder_24h',
  APPOINTMENT_REMINDER_2H = 'appointment_reminder_2h',
  APPOINTMENT_CANCELLED = 'appointment_cancelled',
  APPOINTMENT_RESCHEDULED = 'appointment_rescheduled',
  VACCINATION_DUE = 'vaccination_due',
  FOLLOW_UP_REMINDER = 'follow_up_reminder'
}

// Estadísticas y reportes
export interface VeterinaryStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  revenue: number;
  averageAppointmentDuration: number;
  mostPopularServices: ServiceStats[];
  veterinarianPerformance: VeterinarianStats[];
  monthlyTrends: MonthlyStats[];
}

export interface ServiceStats {
  serviceId: string;
  serviceName: string;
  appointmentCount: number;
  revenue: number;
}

export interface VeterinarianStats {
  veterinarianId: string;
  veterinarianName: string;
  appointmentCount: number;
  completionRate: number;
  averageRating: number;
  revenue: number;
}

export interface MonthlyStats {
  month: string;
  appointmentCount: number;
  revenue: number;
  newClients: number;
}