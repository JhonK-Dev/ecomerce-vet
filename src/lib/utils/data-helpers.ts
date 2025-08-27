// 🔧 HELPERS PARA MANEJO DE DATOS
// Funciones utilitarias para trabajar con los datos del sistema

import { DEMO_USERS, DEMO_PETS, VETERINARY_SERVICES } from '../constants';

// ==========================================
// 🔍 BÚSQUEDA Y FILTRADO
// ==========================================

export const DataHelpers = {
  // Buscar usuario por ID
  findUserById: (id: string) => {
    return DEMO_USERS.CLIENTS.find(client => client.id === id) ||
           DEMO_USERS.VETERINARIANS.find(vet => vet.id === id);
  },

  // Buscar mascota por ID
  findPetById: (id: string) => {
    return DEMO_PETS.find(pet => pet.id === id);
  },

  // Buscar servicio por ID
  findServiceById: (id: string) => {
    return VETERINARY_SERVICES.find(service => service.id === id);
  },

  // Obtener mascotas de un cliente
  getPetsByOwnerId: (ownerId: string) => {
    return DEMO_PETS.filter(pet => pet.ownerId === ownerId);
  },

  // Obtener veterinario por especialidad
  getVeterinariansBySpecialty: (specialty: string) => {
    return DEMO_USERS.VETERINARIANS.filter(vet => 
      vet.specialties.includes(specialty)
    );
  },

  // Validar email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Formatear precio
  formatPrice: (price: number): string => {
    return `S/. ${price.toFixed(2)}`;
  },

  // Formatear fecha
  formatDate: (date: Date): string => {
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Formatear hora
  formatTime: (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  },

  // Generar ID único
  generateUniqueId: (prefix: string = ''): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}${timestamp}_${random}`;
  },

  // Calcular edad de mascota
  calculatePetAge: (birthDate: string): string => {
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} año${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} mes${months > 1 ? 'es' : ''}`;
    } else {
      return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
    }
  },

  // Obtener saludo según hora
  getGreeting: (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  },

  // Validar teléfono peruano
  isValidPeruvianPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?51\s?9\d{8}$/;
    return phoneRegex.test(phone);
  },

  // Capitalizar primera letra
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Truncar texto
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  },

  // Obtener iniciales de nombre
  getInitials: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substr(0, 2);
  },

  // Validar rango de fechas para citas
  isValidAppointmentDate: (date: Date): boolean => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 90); // 90 días máximo
    
    const minDate = new Date();
    minDate.setHours(today.getHours() + 2); // 2 horas mínimo
    
    return date >= minDate && date <= maxDate;
  },

  // Convertir tiempo a minutos
  timeToMinutes: (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  },

  // Convertir minutos a tiempo
  minutesToTime: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  },

  // Verificar si es día laborable
  isBusinessDay: (date: Date): boolean => {
    const day = date.getDay();
    return day >= 1 && day <= 6; // Lunes a Sábado
  },

  // Obtener próxima fecha laborable
  getNextBusinessDay: (date: Date): Date => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    
    while (!DataHelpers.isBusinessDay(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return nextDay;
  },

  // Filtrar datos por término de búsqueda
  filterBySearchTerm: <T extends Record<string, any>>(
    items: T[],
    searchTerm: string,
    searchFields: (keyof T)[]
  ): T[] => {
    if (!searchTerm.trim()) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(term);
      })
    );
  },

  // Ordenar array por campo
  sortBy: <T extends Record<string, any>>(
    items: T[],
    field: keyof T,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] => {
    return [...items].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // Agrupar array por campo
  groupBy: <T extends Record<string, any>>(
    items: T[],
    field: keyof T
  ): Record<string, T[]> => {
    return items.reduce((groups, item) => {
      const key = item[field].toString();
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  // Obtener elementos únicos por campo
  uniqueBy: <T extends Record<string, any>>(
    items: T[],
    field: keyof T
  ): T[] => {
    const seen = new Set();
    return items.filter(item => {
      const value = item[field];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
};

// ==========================================
// 🎨 HELPERS DE UI
// ==========================================

export const UIHelpers = {
  // Obtener color por estado
  getStatusColor: (status: string): string => {
    const colors: Record<string, string> = {
      'PENDING': 'yellow',
      'CONFIRMED': 'green',
      'CANCELLED': 'red',
      'COMPLETED': 'blue',
      'IN_PROGRESS': 'purple',
      'SCHEDULED': 'indigo'
    };
    return colors[status] || 'gray';
  },

  // Obtener icono por categoría
  getIconByCategory: (category: string): string => {
    const icons: Record<string, string> = {
      'CONSULTATION': 'Stethoscope',
      'VACCINATION': 'Shield',
      'EMERGENCY': 'AlertCircle',
      'GROOMING': 'Scissors',
      'DENTAL': 'Smile',
      'SURGERY': 'Activity'
    };
    return icons[category] || 'Circle';
  },

  // Generar avatar placeholder
  generateAvatarUrl: (name: string): string => {
    const initials = DataHelpers.getInitials(name);
    return `https://ui-avatars.com/api/?name=${initials}&background=3B82F6&color=fff&size=128`;
  },

  // Obtener clase CSS por prioridad
  getPriorityClass: (priority: string): string => {
    const classes: Record<string, string> = {
      'LOW': 'bg-green-100 text-green-800',
      'NORMAL': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-yellow-100 text-yellow-800',
      'EMERGENCY': 'bg-red-100 text-red-800'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }
};

export default { DataHelpers, UIHelpers };