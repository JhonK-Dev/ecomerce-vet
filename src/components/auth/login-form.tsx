'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { AuthService } from '@/lib/auth';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await AuthService.login(formData.email, formData.password);
      
      if (result) {
        // Redirigir según el rol del usuario
        switch (result.user.role) {
          case 'admin':
            router.push('/admin');
            break;
          case 'veterinarian':
            router.push('/veterinario');
            break;
          case 'client':
            router.push('/');
            break;
          default:
            router.push('/');
        }
      } else {
        setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
      }
    } catch (error) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  // Credenciales de demo para facilitar las pruebas
  const demoCredentials = [
    { role: 'Administrador', email: 'admin@ecommercevet.com', password: 'password123' },
    { role: 'Veterinario', email: 'veterinario@ecommercevet.com', password: 'password123' },
    { role: 'Cliente', email: 'cliente@example.com', password: 'password123' }
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">🐕</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary">EcommerceVet</h1>
          <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
        </div>

        {/* Demo Credentials */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800">Credenciales de Demo</CardTitle>
            <CardDescription className="text-xs text-blue-600">
              Haz clic para usar credenciales de prueba
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs h-8 border-blue-200 hover:bg-blue-100"
                onClick={() => fillDemoCredentials(cred.email, cred.password)}
              >
                <span className="font-medium">{cred.role}:</span>
                <span className="ml-1 text-muted-foreground">{cred.email}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className='shadow-xl'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl text-center'>Bienvenido</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tu contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  href="/recuperar-password" 
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?{' '}
                <Link href="/registro" className="text-primary hover:underline">
                  Regístrate aquí
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Additional Info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Al iniciar sesión, aceptas nuestros</p>
          <div className="space-x-1">
            <Link href="/terminos" className="text-primary hover:underline">
              Términos de Servicio
            </Link>
            <span>y</span>
            <Link href="/privacidad" className="text-primary hover:underline">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}