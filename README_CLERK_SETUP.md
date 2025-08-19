# 🔐 Configuración de Clerk para EcommerceVet

## 📋 Pasos para configurar Clerk

### 1. Crear cuenta en Clerk
1. Ve a [clerk.com](https://clerk.com)
2. Crea una cuenta gratuita
3. Crea una nueva aplicación

### 2. Configurar variables de entorno
Actualiza el archivo `.env.local` con tus claves reales de Clerk:

```env
# Clerk Keys (reemplaza con tus claves reales)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
CLERK_SECRET_KEY=sk_test_tu_clave_secreta_aqui

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Webhook para sincronización (opcional)
WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
```

### 3. Configurar proveedores de autenticación en Clerk

En el dashboard de Clerk:

1. Ve a **User & Authentication** > **Social Connections**
2. Habilita **Google** como proveedor
3. Configura las credenciales de Google OAuth:
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Crea un proyecto o selecciona uno existente
   - Habilita la Google+ API
   - Crea credenciales OAuth 2.0
   - Configura las URLs de redirección autorizadas

### 4. Configurar roles de usuario (opcional)

Para manejar roles personalizados:

1. Ve a **User & Authentication** > **Metadata**
2. Configura campos personalizados en `publicMetadata`:
   - `role`: string (admin, veterinarian, client)

### 5. Configurar webhooks (opcional)

Para sincronizar usuarios:

1. Ve a **Webhooks** en el dashboard de Clerk
2. Crea un nuevo webhook endpoint: `https://tu-dominio.com/api/webhooks/clerk`
3. Selecciona los eventos: `user.created`, `user.updated`, `user.deleted`
4. Copia el signing secret y agrégalo a `.env.local`

## 🚀 Funcionalidades implementadas

### ✅ Autenticación completa
- Login con email/contraseña
- Login con Google (OAuth)
- Registro de nuevos usuarios
- Logout automático
- Persistencia de sesión

### ✅ Gestión de usuarios
- Perfiles de usuario automáticos
- Roles personalizables (admin, veterinarian, client)
- Redirección basada en roles
- Metadata de usuario

### ✅ UI/UX mejorada
- Componente UserButton personalizado
- Integración con el sistema de diseño existente
- Responsive design
- Estados de carga

### ✅ Seguridad
- Middleware de protección de rutas
- Validación de tokens automática
- Rutas protegidas configurables

## 🔧 Uso en el código

### Obtener usuario actual
```tsx
import { useUser } from '@clerk/nextjs'

function MiComponente() {
  const { isSignedIn, user } = useUser()
  
  if (isSignedIn) {
    return <div>Hola {user.firstName}!</div>
  }
  
  return <div>No autenticado</div>
}
```

### Proteger rutas
```tsx
import { auth } from '@clerk/nextjs'

export default function PaginaProtegida() {
  const { userId } = auth()
  
  if (!userId) {
    return <div>Acceso denegado</div>
  }
  
  return <div>Contenido protegido</div>
}
```

### Verificar roles
```tsx
import { useUser } from '@clerk/nextjs'
import { getUserRole } from '@/lib/clerk-auth'

function ComponenteAdmin() {
  const { user } = useUser()
  const role = getUserRole(user)
  
  if (role !== 'admin') {
    return <div>Solo administradores</div>
  }
  
  return <div>Panel de administración</div>
}
```

## 🎨 Personalización

### Temas y estilos
Los componentes de Clerk están personalizados para coincidir con el diseño de EcommerceVet:
- Colores del tema
- Tipografía consistente
- Espaciado y bordes
- Estados hover y focus

### Flujos personalizados
- Redirección automática basada en roles
- Mensajes de bienvenida personalizados
- Integración con el carrito de compras

## 🐛 Solución de problemas

### Error: "Clerk keys not found"
- Verifica que las variables de entorno estén correctamente configuradas
- Reinicia el servidor de desarrollo después de cambiar `.env.local`

### Error: "Invalid redirect URL"
- Verifica que las URLs de redirección estén configuradas en el dashboard de Clerk
- Asegúrate de que coincidan exactamente con las de tu aplicación

### Problemas con Google OAuth
- Verifica las credenciales de Google Cloud Console
- Asegúrate de que las URLs de redirección estén autorizadas
- Verifica que la Google+ API esté habilitada

## 📚 Recursos adicionales

- [Documentación de Clerk](https://clerk.com/docs)
- [Guía de Next.js con Clerk](https://clerk.com/docs/quickstarts/nextjs)
- [Configuración de Google OAuth](https://clerk.com/docs/authentication/social-connections/google)