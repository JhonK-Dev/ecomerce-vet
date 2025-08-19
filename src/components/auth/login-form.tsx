'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SignIn, SignUp, useUser } from '@clerk/nextjs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [activeTab, setActiveTab] = useState('login')
  const { isSignedIn, user } = useUser()
  const router = useRouter()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isSignedIn) {
      // Determinar redirección basada en metadata del usuario o rol por defecto
      const userRole = user?.publicMetadata?.role as string || 'client'
      
      switch (userRole) {
        case 'admin':
          router.push('/admin')
          break
        case 'veterinarian':
          router.push('/veterinario')
          break
        case 'client':
        default:
          router.push('/')
          break
      }
    }
  }, [isSignedIn, user, router])

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/dogs.webp)',
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-primary font-bold text-3xl">
                🐾
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">EcommerceVet</h1>
          <p className="text-white/90 mt-2 drop-shadow-md">Tu clínica veterinaria de confianza</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Bienvenido</CardTitle>
            <CardDescription className="text-center">
              Inicia sesión o crea una cuenta nueva
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="flex flex-col items-center">
                  <SignIn 
                    appearance={{
                      elements: {
                        formButtonPrimary: 
                          "bg-primary hover:bg-primary/90 text-primary-foreground",
                        card: "shadow-none border-0 bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: 
                          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                        socialButtonsBlockButtonText: "text-foreground",
                        dividerLine: "bg-border",
                        dividerText: "text-muted-foreground",
                        formFieldInput: 
                          "border border-input bg-background text-foreground",
                        footerActionLink: "text-primary hover:text-primary/80"
                      },
                      layout: {
                        socialButtonsPlacement: "top"
                      }
                    }}
                    redirectUrl="/"
                  />
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="flex flex-col items-center">
                  <SignUp 
                    appearance={{
                      elements: {
                        formButtonPrimary: 
                          "bg-primary hover:bg-primary/90 text-primary-foreground",
                        card: "shadow-none border-0 bg-transparent",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: 
                          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                        socialButtonsBlockButtonText: "text-foreground",
                        dividerLine: "bg-border",
                        dividerText: "text-muted-foreground",
                        formFieldInput: 
                          "border border-input bg-background text-foreground",
                        footerActionLink: "text-primary hover:text-primary/80"
                      },
                      layout: {
                        socialButtonsPlacement: "top"
                      }
                    }}
                    redirectUrl="/"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-white/90 hover:text-white underline drop-shadow-md"
          >
            ← Volver al inicio
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-center text-xs text-white/80">
          <p className="drop-shadow-md">Al iniciar sesión, aceptas nuestros</p>
          <div className="space-x-1 mt-1">
            <Link href="/terminos" className="text-white hover:text-white/80 underline drop-shadow-md">
              Términos de Servicio
            </Link>
            <span>y</span>
            <Link href="/privacidad" className="text-white hover:text-white/80 underline drop-shadow-md">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}