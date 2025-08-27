// 🎯 CONSTANTES CENTRALIZADAS DEL SISTEMA ECOMMERCEVET
// Todas las constantes hardcodeadas organizadas en un solo lugar

// ==========================================
// 🔧 CONFIGURACIÓN DEL SISTEMA
// ==========================================

export const SYSTEM_CONFIG = {
  // Nombres de aplicación
  APP_NAME: 'EcommerceVet',
  APP_DESCRIPTION: 'Tu clínica veterinaria de confianza',
  
  // Configuración de localStorage
  STORAGE_KEYS: {
    APPOINTMENTS: 'ecommercevet_appointments',
    MEDICAL_RECORDS: 'ecommercevet_medical_records',
    PETS: 'ecommercevet_pets',
    CART: 'ecommercevet_cart',
    USER_PREFERENCES: 'ecommercevet_user_preferences'
  },
  
  // Timeouts y delays
  DELAYS: {
    API_SIMULATION: 500,
    SEARCH_DEBOUNCE: 300,
    NOTIFICATION_TIMEOUT: 5000,
    AUTO_SAVE: 2000
  },
  
  // Paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 25,
    MAX_PAGE_SIZE: 100,
    PRODUCTS_PER_PAGE: 12,
    APPOINTMENTS_PER_PAGE: 10
  }
} as const;

// ==========================================
// 👥 DATOS DE USUARIOS DEMO
// ==========================================

export const DEMO_USERS = {
  CLIENTS: [
    {
      id: 'client_001',
      name: 'María García',
      email: 'maria.garcia@example.com',
      phone: '+51 987 654 321',
      address: 'Av. Larco 123, Miraflores, Lima'
    },
    {
      id: 'client_002', 
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: '+51 987 654 322',
      address: 'Jr. Cusco 456, San Isidro, Lima'
    },
    {
      id: 'client_003',
      name: 'Carlos López',
      email: 'carlos.lopez@example.com', 
      phone: '+51 987 654 323',
      address: 'Av. Brasil 789, Pueblo Libre, Lima'
    },
    {
      id: 'client_004',
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@example.com',
      phone: '+51 987 654 324', 
      address: 'Calle Las Flores 321, Surco, Lima'
    }
  ],
  
  VETERINARIANS: [
    {
      id: 'vet_001',
      clerkId: 'vet_1',
      name: 'Dr. Carlos Ruiz',
      email: 'carlos.ruiz@ecommercevet.com',
      specialties: ['GENERAL', 'SURGERY'],
      license: 'VET-001-2020'
    },
    {
      id: 'vet_002', 
      clerkId: 'vet_2',
      name: 'Dra. Ana Martínez',
      email: 'ana.martinez@ecommercevet.com',
      specialties: ['GENERAL', 'DERMATOLOGY'],
      license: 'VET-002-2019'
    },
    {
      id: 'vet_003',
      clerkId: 'vet_3', 
      name: 'Dr. Luis Fernández',
      email: 'luis.fernandez@ecommercevet.com',
      specialties: ['CARDIOLOGY', 'INTERNAL_MEDICINE'],
      license: 'VET-003-2021'
    }
  ]
} as const;

// ==========================================
// 🐕 DATOS DE MASCOTAS DEMO
// ==========================================

export const DEMO_PETS = [
  {
    id: 'pet_001',
    name: 'Luna',
    species: 'DOG',
    breed: 'Golden Retriever',
    ownerId: 'client_001',
    birthDate: '2020-03-15',
    weight: 28.5,
    color: 'Dorado'
  },
  {
    id: 'pet_002',
    name: 'Max', 
    species: 'CAT',
    breed: 'Persa',
    ownerId: 'client_002',
    birthDate: '2019-08-22',
    weight: 4.2,
    color: 'Blanco'
  },
  {
    id: 'pet_003',
    name: 'Bella',
    species: 'DOG', 
    breed: 'Labrador',
    ownerId: 'client_001',
    birthDate: '2021-01-10',
    weight: 25.0,
    color: 'Negro'
  },
  {
    id: 'pet_004',
    name: 'Rocky',
    species: 'DOG',
    breed: 'Bulldog',
    ownerId: 'client_003', 
    birthDate: '2018-11-05',
    weight: 22.8,
    color: 'Marrón'
  },
  {
    id: 'pet_005',
    name: 'Michi',
    species: 'CAT',
    breed: 'Siamés',
    ownerId: 'client_004',
    birthDate: '2020-06-18',
    weight: 3.8,
    color: 'Crema'
  },
  {
    id: 'pet_006',
    name: 'Coco',
    species: 'DOG',
    breed: 'Poodle',
    ownerId: 'client_002',
    birthDate: '2019-12-03',
    weight: 8.5,
    color: 'Blanco'
  }
] as const;

// ==========================================
// 🏥 SERVICIOS VETERINARIOS
// ==========================================

export const VETERINARY_SERVICES = [
  {
    id: 'service_001',
    name: 'Consulta General',
    description: 'Revisión médica completa',
    price: 80.00,
    duration: 30,
    category: 'CONSULTATION'
  },
  {
    id: 'service_002',
    name: 'Vacunación',
    description: 'Aplicación de vacunas preventivas',
    price: 120.00,
    duration: 20,
    category: 'VACCINATION'
  },
  {
    id: 'service_003',
    name: 'Consulta de Emergencia',
    description: 'Atención médica urgente',
    price: 250.00,
    duration: 45,
    category: 'EMERGENCY'
  },
  {
    id: 'service_004',
    name: 'Peluquería',
    description: 'Corte y arreglo estético',
    price: 45.00,
    duration: 60,
    category: 'GROOMING'
  },
  {
    id: 'service_005',
    name: 'Limpieza Dental',
    description: 'Profilaxis dental profesional',
    price: 180.00,
    duration: 90,
    category: 'DENTAL'
  }
] as const;

// ==========================================
// 💊 MEDICAMENTOS Y TRATAMIENTOS
// ==========================================

export const MEDICATIONS = {
  ANTIBIOTICS: [
    { name: 'Amoxicilina', dosage: '250mg', frequency: 'Cada 8 horas' },
    { name: 'Cefalexina', dosage: '500mg', frequency: 'Cada 12 horas' },
    { name: 'Enrofloxacina', dosage: '150mg', frequency: 'Cada 24 horas' }
  ],
  
  ANTIPARASITICS: [
    { name: 'Ivermectina', dosage: '1ml', frequency: 'Dosis única' },
    { name: 'Fenbendazol', dosage: '500mg', frequency: 'Cada 24 horas por 3 días' },
    { name: 'Praziquantel', dosage: '50mg', frequency: 'Dosis única' }
  ],
  
  VACCINES: [
    { name: 'Séxtuple Canina', type: 'Prevención múltiple', schedule: 'Anual' },
    { name: 'Antirrábica', type: 'Rabia', schedule: 'Anual' },
    { name: 'Triple Felina', type: 'Prevención felina', schedule: 'Anual' },
    { name: 'Leucemia Felina', type: 'FeLV', schedule: 'Anual' }
  ]
} as const;

// ==========================================
// 📧 CONFIGURACIÓN DE EMAILS
// ==========================================

export const EMAIL_CONFIG = {
  // Email por defecto para desarrollo
  DEFAULT_EMAIL: 'delivered@resend.dev',
  FALLBACK_EMAIL: 'kerrymamani@gmail.com',
  
  // Templates de email
  TEMPLATES: {
    APPOINTMENT_CONFIRMATION: 'appointment-confirmation',
    APPOINTMENT_REMINDER: 'appointment-reminder', 
    APPOINTMENT_CANCELLATION: 'appointment-cancellation',
    MEDICAL_ALERT: 'medical-alert',
    ORDER_CONFIRMATION: 'order-confirmation'
  },
  
  // Asuntos de email
  SUBJECTS: {
    APPOINTMENT_CONFIRMED: '✅ Cita Confirmada - EcommerceVet',
    APPOINTMENT_REMINDER: '⏰ Recordatorio de Cita - EcommerceVet',
    APPOINTMENT_CANCELLED: '❌ Cita Cancelada - EcommerceVet',
    MEDICAL_ALERT: '🔔 Alerta Médica - EcommerceVet',
    ORDER_CONFIRMED: '🛒 Pedido Confirmado - EcommerceVet'
  }
} as const;

// ==========================================
// 💰 PRECIOS Y COSTOS
// ==========================================

export const PRICING = {
  // Servicios base
  CONSULTATION_FEE: 80.00,
  EMERGENCY_FEE: 250.00,
  VACCINATION_FEE: 120.00,
  GROOMING_FEE: 45.00,
  DENTAL_CLEANING_FEE: 180.00,
  
  // Descuentos
  PREMIUM_DISCOUNT: 0.05, // 5%
  BULK_DISCOUNT: 0.10,    // 10%
  LOYALTY_DISCOUNT: 0.15, // 15%
  
  // Envío
  FREE_SHIPPING_THRESHOLD: 100.00,
  STANDARD_SHIPPING: 15.00,
  EXPRESS_SHIPPING: 25.00,
  
  // Impuestos
  TAX_RATE: 0.18 // 18% IGV en Perú
} as const;

// ==========================================
// 🕒 HORARIOS Y FECHAS
// ==========================================

export const SCHEDULE_CONFIG = {
  // Horarios de atención
  BUSINESS_HOURS: {
    MONDAY: { start: '08:00', end: '18:00' },
    TUESDAY: { start: '08:00', end: '18:00' },
    WEDNESDAY: { start: '08:00', end: '18:00' },
    THURSDAY: { start: '08:00', end: '18:00' },
    FRIDAY: { start: '08:00', end: '18:00' },
    SATURDAY: { start: '09:00', end: '15:00' },
    SUNDAY: { start: '09:00', end: '13:00' }
  },
  
  // Duración de servicios (en minutos)
  SERVICE_DURATIONS: {
    CONSULTATION: 30,
    VACCINATION: 20,
    EMERGENCY: 45,
    GROOMING: 60,
    DENTAL: 90,
    SURGERY: 120
  },
  
  // Intervalos de citas
  APPOINTMENT_INTERVALS: 15, // minutos
  
  // Días de anticipación
  MAX_BOOKING_DAYS: 90,
  MIN_BOOKING_HOURS: 2,
  
  // Recordatorios
  REMINDER_DAYS: [7, 3, 1], // días antes de la cita
  FOLLOW_UP_DAYS: 7 // días después del tratamiento
} as const;

// ==========================================
// 🎨 CONFIGURACIÓN DE UI
// ==========================================

export const UI_CONFIG = {
  // Colores del sistema
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#10B981', 
    SUCCESS: '#22C55E',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#06B6D4'
  },
  
  // Iconos por categoría
  ICONS: {
    APPOINTMENT: 'Calendar',
    MEDICAL: 'Stethoscope',
    PET: 'Heart',
    USER: 'User',
    ADMIN: 'Shield',
    PRODUCT: 'ShoppingCart',
    EMAIL: 'Mail',
    PHONE: 'Phone'
  },
  
  // Mensajes del sistema
  MESSAGES: {
    LOADING: 'Cargando...',
    NO_DATA: 'No hay datos disponibles',
    ERROR_GENERIC: 'Ha ocurrido un error. Intenta nuevamente.',
    SUCCESS_SAVE: 'Guardado exitosamente',
    SUCCESS_DELETE: 'Eliminado exitosamente',
    CONFIRM_DELETE: '¿Estás seguro de eliminar este elemento?'
  }
} as const;

// ==========================================
// 🔐 CONFIGURACIÓN DE ROLES
// ==========================================

export const ROLE_CONFIG = {
  PERMISSIONS: {
    CLIENT: [
      'read_own_pets',
      'read_own_appointments', 
      'create_appointments',
      'read_products',
      'create_orders'
    ],
    VETERINARIAN: [
      'read_all_pets',
      'write_medical_records',
      'read_all_appointments',
      'write_appointments',
      'read_medical_alerts'
    ],
    ADMIN: [
      'read_all_data',
      'write_all_data',
      'manage_users',
      'manage_system',
      'view_reports'
    ]
  },
  
  DEFAULT_REDIRECTS: {
    CLIENT: '/',
    VETERINARIAN: '/historias-clinicas',
    ADMIN: '/admin'
  }
} as const;

// ==========================================
// 🛒 PRODUCTOS DEMO
// ==========================================

export const DEMO_PRODUCTS = {
  CATEGORIES: ['FOOD', 'MEDICINE', 'ACCESSORIES', 'HYGIENE', 'TOYS', 'SUPPLEMENTS'],
  
  BRANDS: [
    'Royal Canin',
    'Hill\'s',
    'Purina Pro Plan',
    'Eukanuba',
    'Pedigree',
    'Whiskas',
    'Bayer',
    'Zoetis'
  ],
  
  SAMPLE_PRODUCTS: [
    {
      name: 'Royal Canin Adult',
      category: 'FOOD',
      price: 89.90,
      brand: 'Royal Canin'
    },
    {
      name: 'Collar Antipulgas',
      category: 'ACCESSORIES', 
      price: 35.50,
      brand: 'Bayer'
    }
  ]
} as const;

// ==========================================
// 🔧 FUNCIONES HELPER
// ==========================================

export const HELPERS = {
  // Generar ID único
  generateId: (prefix: string = '') => `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  // Formatear precio
  formatPrice: (price: number) => `S/. ${price.toFixed(2)}`,
  
  // Formatear fecha
  formatDate: (date: Date) => date.toLocaleDateString('es-PE'),
  
  // Validar email
  isValidEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  // Obtener saludo según hora
  getGreeting: () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
} as const;

// ==========================================
// 📱 CONFIGURACIÓN RESPONSIVE
// ==========================================

export const RESPONSIVE_CONFIG = {
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px', 
    LG: '1024px',
    XL: '1280px'
  },
  
  GRID_COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
    LARGE: 4
  }
} as const;

// ==========================================
// 🎯 VALIDACIONES
// ==========================================

export const VALIDATION_RULES = {
  PET_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },
  
  PHONE: {
    PATTERN: /^\+?51\s?9\d{8}$/,
    MESSAGE: 'Formato: +51 987654321'
  },
  
  APPOINTMENT: {
    MIN_ADVANCE_HOURS: 2,
    MAX_ADVANCE_DAYS: 90,
    REASON_MIN_LENGTH: 10
  },
  
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true
  }
} as const;

export default {
  SYSTEM_CONFIG,
  DEMO_USERS,
  DEMO_PETS,
  VETERINARY_SERVICES,
  MEDICATIONS,
  EMAIL_CONFIG,
  PRICING,
  SCHEDULE_CONFIG,
  UI_CONFIG,
  ROLE_CONFIG,
  DEMO_PRODUCTS,
  HELPERS,
  RESPONSIVE_CONFIG,
  VALIDATION_RULES
};