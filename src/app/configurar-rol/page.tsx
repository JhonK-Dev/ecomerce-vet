'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  User,
  Stethoscope,
  Shield,
  Heart,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { getUserRole } from '@/lib/clerk-auth'

export default function ConfigurarRolPage() {
  const { user } = useUser()
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  const currentRole = user ? getUserRole(user as any) : 'client'

  const roles = [
    {
      value: 'client',
      label: 'Cliente',
      description: 'Propietario de mascotas - Puede ver sus historias clínicas y hacer compras',
      icon: Heart,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      value: 'veterinarian',
      label: 'Veterinario',
      description: 'Profesional veterinario - Puede gestionar historias clínicas de todas las mascotas',
      icon: Stethoscope,
      color: 'bg-green-100 text-green-800'
    },
    {
      value: 'admin',
      label: 'Administrador',
      description: 'Administrador del sistema - Acceso completo a todas las funcionalidades',
      icon: Shield,
      color: 'bg-purple-100 text-purple-800'
    }
  ]

  const handleRoleChange = async () => {
    if (!selectedRole || !user) return

    setLoading(true)
    setMessage('')

    try {
      // Simular cambio de rol (en desarrollo)
      // En producción esto se haría a través de una API que actualice Clerk
      
      // Para desarrollo, mostrar instrucciones
      setMessage(`Para cambiar a rol "${roles.find(r => r.value === selectedRole)?.label}", 
        ve al Dashboard de Clerk y actualiza el metadata público del usuario con: {"role": "${selectedRole}"}`)
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      setMessage('Error al cambiar el rol. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center">
            <Settings className="w-8 h-8 mr-3 text-primary" />
            Configurar Rol de Usuario
          </h1>
          <p className="text-muted-foreground mt-2">
            Cambia tu rol para probar diferentes funcionalidades del sistema
          </p>
        </div>

        {/* Rol actual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Rol Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(() => {
                  const roleInfo = roles.find(r => r.value === currentRole)
                  const RoleIcon = roleInfo?.icon || User
                  return (
                    <>
                      <div className={`p-2 rounded-lg ${roleInfo?.color || 'bg-gray-100'}`}>
                        <RoleIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{roleInfo?.label || 'Cliente'}</div>
                        <div className="text-sm text-muted-foreground">
                          {roleInfo?.description || 'Rol por defecto'}
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
              <Badge variant="secondary">Activo</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Seleccionar nuevo rol */}
        <Card>
          <CardHeader>
            <CardTitle>Cambiar Rol</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Seleccionar nuevo rol:</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige un rol..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => {
                    const RoleIcon = role.icon
                    return (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center space-x-2">
                          <RoleIcon className="w-4 h-4" />
                          <span>{role.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedRole && (
              <div className="p-4 bg-muted rounded-lg">
                {(() => {
                  const roleInfo = roles.find(r => r.value === selectedRole)
                  const RoleIcon = roleInfo?.icon || User
                  return (
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${roleInfo?.color}`}>
                        <RoleIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{roleInfo?.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {roleInfo?.description}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            <Button 
              onClick={handleRoleChange}
              disabled={!selectedRole || selectedRole === currentRole || loading}
              className="w-full"
            >
              {loading ? 'Cambiando rol...' : 'Cambiar Rol'}
            </Button>
          </CardContent>
        </Card>

        {/* Mensaje */}
        {message && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Instrucciones para desarrollo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Instrucciones para Desarrollo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <p><strong>Para cambiar tu rol manualmente:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Ve al <a href="https://dashboard.clerk.com" target="_blank" className="text-primary hover:underline">Dashboard de Clerk</a></li>
                <li>Busca tu usuario en la sección "Users"</li>
                <li>Haz clic en tu usuario y ve a "Metadata"</li>
                <li>En "Public metadata" agrega:</li>
              </ol>
              
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-xs">
                {`{"role": "veterinarian"}`}
              </div>
              
              <p className="text-muted-foreground">
                <strong>Opciones de rol:</strong> "client", "veterinarian", "admin"
              </p>
              
              <p className="text-muted-foreground">
                Después de cambiar el metadata, cierra sesión y vuelve a entrar para ver los cambios.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Accesos rápidos */}
        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos por Rol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Cliente</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ver mis mascotas</li>
                  <li>• Historias clínicas</li>
                  <li>• Comprar productos</li>
                  <li>• Agendar citas</li>
                </ul>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Stethoscope className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Veterinario</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Todas las mascotas</li>
                  <li>• Crear registros médicos</li>
                  <li>• Gestionar alertas</li>
                  <li>• Ver estadísticas</li>
                </ul>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Admin</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Gestión completa</li>
                  <li>• Configuración sistema</li>
                  <li>• Reportes avanzados</li>
                  <li>• Gestión de usuarios</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}