// Tipos específicos para el módulo de Historias Clínicas Digitales

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  birthDate: Date;
  gender: PetGender;
  weight: number; // en kg
  color: string;
  microchipNumber?: string;
  ownerId: string; // Referencia al User de Clerk
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerAddress: string;
  emergencyContact?: EmergencyContact;
  isActive: boolean;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export enum PetSpecies {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  RABBIT = 'rabbit',
  HAMSTER = 'hamster',
  GUINEA_PIG = 'guinea_pig',
  FERRET = 'ferret',
  REPTILE = 'reptile',
  FISH = 'fish',
  OTHER = 'other'
}

export enum PetGender {
  MALE = 'male',
  FEMALE = 'female',
  NEUTERED_MALE = 'neutered_male',
  SPAYED_FEMALE = 'spayed_female'
}

// Historia Clínica Principal
export interface MedicalRecord {
  id: string;
  petId: string;
  pet?: Pet;
  veterinarianId: string;
  veterinarian?: import('./veterinary').Veterinarian;
  appointmentId?: string;
  date: Date;
  type: MedicalRecordType;
  title: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  medications?: Medication[];
  vaccinations?: Vaccination[];
  allergies?: Allergy[];
  surgeries?: Surgery[];
  labResults?: LabResult[];
  images?: MedicalImage[];
  documents?: MedicalDocument[];
  vitalSigns?: VitalSigns;
  weight?: number;
  temperature?: number;
  notes?: string;
  followUpDate?: Date;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum MedicalRecordType {
  CONSULTATION = 'consultation',
  VACCINATION = 'vaccination',
  SURGERY = 'surgery',
  EMERGENCY = 'emergency',
  CHECKUP = 'checkup',
  LABORATORY = 'laboratory',
  IMAGING = 'imaging',
  TREATMENT = 'treatment',
  FOLLOW_UP = 'follow_up'
}

// Medicamentos
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  prescribedBy: string; // veterinarianId
  notes?: string;
}

// Vacunas
export interface Vaccination {
  id: string;
  vaccine: string;
  brand: string;
  batchNumber: string;
  administeredDate: Date;
  nextDueDate?: Date;
  veterinarianId: string;
  location: string; // lugar de aplicación
  reactions?: string;
  notes?: string;
}

// Alergias
export interface Allergy {
  id: string;
  allergen: string;
  severity: AllergySeverity;
  symptoms: string[];
  treatment?: string;
  discoveredDate: Date;
  notes?: string;
}

export enum AllergySeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  LIFE_THREATENING = 'life_threatening'
}

// Cirugías
export interface Surgery {
  id: string;
  procedure: string;
  date: Date;
  veterinarianId: string;
  anesthesia: string;
  duration: number; // en minutos
  complications?: string;
  recovery: string;
  followUpInstructions: string;
  images?: string[];
  notes?: string;
}

// Resultados de Laboratorio
export interface LabResult {
  id: string;
  testName: string;
  testDate: Date;
  results: LabTestResult[];
  interpretation?: string;
  veterinarianId: string;
  laboratoryName?: string;
  documentUrl?: string;
  isAbnormal: boolean;
  notes?: string;
}

export interface LabTestResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

// Imágenes Médicas
export interface MedicalImage {
  id: string;
  type: ImageType;
  url: string;
  description: string;
  date: Date;
  veterinarianId: string;
  findings?: string;
}

export enum ImageType {
  XRAY = 'xray',
  ULTRASOUND = 'ultrasound',
  CT_SCAN = 'ct_scan',
  MRI = 'mri',
  PHOTO = 'photo',
  OTHER = 'other'
}

// Documentos Médicos
export interface MedicalDocument {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadDate: Date;
  uploadedBy: string; // userId
  description?: string;
  size: number; // en bytes
}

export enum DocumentType {
  LAB_REPORT = 'lab_report',
  IMAGING_REPORT = 'imaging_report',
  PRESCRIPTION = 'prescription',
  CERTIFICATE = 'certificate',
  INSURANCE = 'insurance',
  OTHER = 'other'
}

// Signos Vitales
export interface VitalSigns {
  heartRate?: number; // latidos por minuto
  respiratoryRate?: number; // respiraciones por minuto
  temperature?: number; // en Celsius
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  weight?: number; // en kg
  bodyConditionScore?: number; // 1-9 escala
}

// Alertas y Recordatorios
export interface MedicalAlert {
  id: string;
  petId: string;
  type: AlertType;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  priority: AlertPriority;
  createdBy: string; // veterinarianId
  assignedTo?: string; // ownerId
  completedDate?: Date;
  notes?: string;
  createdAt: Date;
}

export enum AlertType {
  VACCINATION_DUE = 'vaccination_due',
  MEDICATION_REMINDER = 'medication_reminder',
  FOLLOW_UP_APPOINTMENT = 'follow_up_appointment',
  ANNUAL_CHECKUP = 'annual_checkup',
  DENTAL_CLEANING = 'dental_cleaning',
  WEIGHT_CHECK = 'weight_check',
  CUSTOM = 'custom'
}

export enum AlertPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Filtros para búsqueda
export interface MedicalRecordFilters {
  petId?: string;
  veterinarianId?: string;
  type?: MedicalRecordType;
  dateFrom?: Date;
  dateTo?: Date;
  hasImages?: boolean;
  hasDocuments?: boolean;
  search?: string;
}

export interface PetFilters {
  ownerId?: string;
  species?: PetSpecies;
  breed?: string;
  ageMin?: number;
  ageMax?: number;
  search?: string;
}

// Estadísticas y Reportes
export interface MedicalStats {
  totalRecords: number;
  recordsByType: Record<MedicalRecordType, number>;
  recentActivity: MedicalRecord[];
  upcomingAlerts: MedicalAlert[];
  vaccinationStatus: {
    upToDate: number;
    overdue: number;
    upcoming: number;
  };
}