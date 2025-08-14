// Sistema de autenticación para Ecommerce Vet
import { User, UserRole } from '@/types';

// Simulación de base de datos de usuarios (en producción usar una DB real)
const users: User[] = [
  {
    id: '1',
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
    id: '2',
    email: 'veterinario@ecommercevet.com',
    name: 'Dr. María González',
    role: UserRole.VETERINARIAN,
    avatar: '/avatars/vet.jpg',
    phone: '+51 999 777 666',
    address: 'Clínica Veterinaria Central',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: '3',
    email: 'cliente@example.com',
    name: 'Juan Pérez',
    role: UserRole.CLIENT,
    avatar: '/avatars/client.jpg',
    phone: '+51 999 666 555',
    address: 'Jr. Los Olivos 456, San Isidro',
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
        localStorage.setItem('auth_token', token);
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