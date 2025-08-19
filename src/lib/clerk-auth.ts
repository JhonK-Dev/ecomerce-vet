// Utilidades para integración con Clerk
import { User } from '@/types'
import { UserRole } from '@/types'

// Mapear usuario de Clerk a nuestro tipo User
export function mapClerkUserToUser(clerkUser: any): User {
  return {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Usuario',
    role: (clerkUser.publicMetadata?.role as UserRole) || UserRole.CLIENT,
    avatar: clerkUser.imageUrl,
    phone: clerkUser.phoneNumbers[0]?.phoneNumber || undefined,
    address: clerkUser.publicMetadata?.address as string || undefined,
    createdAt: new Date(clerkUser.createdAt),
    updatedAt: new Date(clerkUser.updatedAt)
  }
}

// Función para actualizar el rol del usuario en Clerk
export async function updateUserRole(userId: string, role: UserRole) {
  try {
    // Esta función se ejecutaría en el servidor
    // Aquí puedes implementar la lógica para actualizar el metadata del usuario
    console.log(`Actualizando rol del usuario ${userId} a ${role}`)
    
    // En un entorno real, esto se haría a través de una API route
    // que use el Clerk Backend API
    return true
  } catch (error) {
    console.error('Error actualizando rol del usuario:', error)
    return false
  }
}

// Función para verificar permisos basados en el rol de Clerk
export function hasPermission(clerkUser: any, permission: string): boolean {
  if (!clerkUser) return false

  const role = clerkUser.publicMetadata?.role as UserRole || UserRole.CLIENT

  switch (role) {
    case UserRole.ADMIN:
      return true // Admin tiene todos los permisos
    case UserRole.VETERINARIAN:
      return ['read_patients', 'write_patients', 'read_appointments', 'write_appointments'].includes(permission)
    case UserRole.CLIENT:
      return ['read_own_data', 'write_own_data', 'read_products', 'create_orders'].includes(permission)
    default:
      return false
  }
}

// Función para obtener el rol del usuario
export function getUserRole(clerkUser: any): UserRole {
  return (clerkUser?.publicMetadata?.role as UserRole) || UserRole.CLIENT
}