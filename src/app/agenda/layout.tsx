'use client'

import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { getUserRole, ClerkUser } from '@/lib/clerk-auth'
import { UserRole } from '@/types'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AgendaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    redirect('/login')
  }

  const userRole = getUserRole(user as ClerkUser)

  // Solo veterinarios y admins pueden acceder a la agenda
  if (userRole !== UserRole.VETERINARIAN && userRole !== UserRole.ADMIN) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            No tienes permisos para acceder a esta sección. Solo veterinarios y
            administradores pueden gestionar la agenda.{' '}
            <Link href="/" className="underline">
              Ir al inicio
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
