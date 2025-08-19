'use client'

import {
  UserButton as ClerkUserButton,
  useUser,
  SignInButton,
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { getUserRole } from '@/lib/clerk-auth'
import type { ClerkUser } from '@/lib/clerk-auth'

export function UserButton() {
  const { isSignedIn, user } = useUser()

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button className="bg-black text-white" variant="outline" size="sm">
          Iniciar Sesión
        </Button>
      </SignInButton>
    )
  }

  const userRole = getUserRole(user as ClerkUser)

  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:flex flex-col items-end text-sm">
        <span className="font-medium">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-xs text-muted-foreground capitalize">
          {userRole === 'admin'
            ? 'Administrador'
            : userRole === 'veterinarian'
            ? 'Veterinario'
            : 'Cliente'}
        </span>
      </div>
      <ClerkUserButton
        appearance={{
          elements: {
            avatarBox: 'h-8 w-8',
            userButtonPopoverCard: 'shadow-lg border',
            userButtonPopoverActionButton: 'hover:bg-accent',
            userButtonPopoverActionButtonText: 'text-foreground',
            userButtonPopoverFooter: 'hidden',
          },
        }}
        afterSignOutUrl="/"
      />
    </div>
  )
}
