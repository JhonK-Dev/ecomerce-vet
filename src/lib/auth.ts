// Sistema de autenticación para Ecommerce Vet
import { User, UserRole } from '@/types';
import { DEMO_USERS, SYSTEM_CONFIG, HELPERS } from './constants';

// Simulación de base de datos de usuarios usando constantes
const users: User[] = [
  {
    id: HELPERS.generateId('admin_'),
    email: 'admin@ecommercevet.com',
    name: 'Administrador',
    role: UserRole.ADMIN,
    avatar: '/avatars/admin.jpg',
    phone: '+51 999 888 777',
    address: 'Av. Principal 123, Lima',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: DEMO_USERS.VETERINARIANS[0].id,
    email: DEMO_USERS.VETERINARIANS[0].email,
    name: DEMO_USERS.VETERINARIANS[0].name,
    role: UserRole.VETERINARIAN,
    avatar: '/avatars/vet.jpg',
    phone: '+51 999 777 666', // Teléfono por defecto para veterinarios
    address: 'Clínica Veterinaria Central',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: DEMO_USERS.CLIENTS[0].id,
    email: DEMO_USERS.CLIENTS[0].email,
    name: DEMO_USERS.CLIENTS[0].name,
    role: UserRole.CLIENT,
    avatar: '/avatars/client.jpg',
    phone: DEMO_USERS.CLIENTS[0].phone,
    address: DEMO_USERS.CLIENTS[0].address,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date()
  }
];

export class AuthService {
  private static currentUser: User | null = null;

  // Simular login (en producción usar JWT, OAuth, etc.)
  static async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    // Simulación de validación de credenciales
    const user = users.find(u => u.email === email);
    
    if (user && password === 'password123') { // En producción, verificar hash de contraseña
      this.currentUser = user;
      const token = this.generateToken(user);
      
      // Guardar en localStorage (en producción usar cookies seguras)
      if (typeof window !== 'undefined') {
        localStorage.setItem(SYSTEM_CONFIG.STORAGE_KEYS.USER_PREFERENCES, token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return { user, token };
    }
    
    return null;
  }

  // Logout
  static logout(): void {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  // Obtener usuario actual
  static getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Intentar recuperar del localStorage
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          this.currentUser = JSON.parse(userStr);
          return this.currentUser;
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }
    }

    return null;
  }

  // Verificar si está autenticado
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Verificar rol
  static hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Verificar permisos
  static hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    switch (user.role) {
      case UserRole.ADMIN:
        return true; // Admin tiene todos los permisos
      case UserRole.VETERINARIAN:
        return ['read_patients', 'write_patients', 'read_appointments', 'write_appointments'].includes(permission);
      case UserRole.CLIENT:
        return ['read_own_data', 'write_own_data', 'read_products', 'create_orders'].includes(permission);
      default:
        return false;
    }
  }

  // Generar token (simulado)
  private static generateToken(user: User): string {
    // En producción usar JWT real
    return btoa(JSON.stringify({ userId: user.id, role: user.role, exp: Date.now() + 86400000 }));
  }

  // Validar token
  static validateToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }

  // Registrar nuevo usuario
  static async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);
    return newUser;
  }

  // Obtener usuario por ID
  static getUserById(userId: string): User | undefined {
    return users.find(u => u.id === userId);
  }

  // Actualizar perfil
  static async updateProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date()
    };

    // Actualizar usuario actual si es el mismo
    if (this.currentUser?.id === userId) {
      this.currentUser = users[userIndex];
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(this.currentUser));
      }
    }

    return users[userIndex];
  }
}