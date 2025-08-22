# 🩺 CÓMO ACCEDER COMO VETERINARIO

## 🎯 **Opciones para Cambiar a Rol de Veterinario**

### **Opción 1: Página de Configuración (Más Fácil) ✅**

1. **Accede a la página de configuración**:
   - Ve a: `http://localhost:3000/configurar-rol`
   - O haz clic en el ícono de usuario en el header (solo en desarrollo)

2. **Sigue las instrucciones**:
   - La página te mostrará tu rol actual
   - Te dará instrucciones paso a paso para cambiar el rol
   - Incluye enlaces directos al Dashboard de Clerk

### **Opción 2: Dashboard de Clerk (Manual)**

1. **Ve al Dashboard de Clerk**:
   - Accede a: [dashboard.clerk.com](https://dashboard.clerk.com)
   - Inicia sesión con tu cuenta de Clerk

2. **Encuentra tu aplicación**:
   - Selecciona tu proyecto "EcommerceVet"

3. **Busca tu usuario**:
   - Ve a "Users" en el menú lateral
   - Busca tu usuario por email

4. **Editar Metadata**:
   - Haz clic en tu usuario
   - Ve a la pestaña "Metadata"
   - En "Public metadata" agrega:
   ```json
   {
     "role": "veterinarian"
   }
   ```
   - Haz clic en "Save"

5. **Reinicia la sesión**:
   - Cierra sesión en la aplicación
   - Vuelve a iniciar sesión
   - ¡Ya tendrás acceso de veterinario!

### **Opción 3: Crear Usuario con Email Específico**

Si quieres crear un nuevo usuario que automáticamente sea veterinario:

1. **Registra un nuevo usuario** con un email que contenga:
   - `veterinario` (ej: `veterinario@test.com`)
   - `vet` (ej: `vet@test.com`)
   - `doctor` (ej: `doctor@test.com`)

2. **El sistema automáticamente** asignará el rol de veterinario

---

## 🔍 **Diferencias entre Roles**

### **👤 Cliente (client)**
- Ve solo sus mascotas
- Puede ver historias clínicas de sus mascotas
- Puede agendar citas
- Puede comprar productos
- **URL**: `/historias-clinicas` (vista limitada)

### **🩺 Veterinario (veterinarian)**
- Ve todas las mascotas del sistema
- Puede crear y editar registros médicos
- Puede gestionar alertas para propietarios
- Acceso a estadísticas generales
- **URL**: `/historias-clinicas` (vista completa)

### **🛡️ Admin (admin)**
- Acceso completo al sistema
- Gestión de usuarios
- Configuración del sistema
- **URL**: `/admin` (cuando se implemente)

---

## 🎨 **Cómo Identificar tu Rol Actual**

### **En la Interfaz**:
1. **Página de Historias Clínicas**:
   - **Cliente**: Ve "Mis Mascotas" en el sidebar
   - **Veterinario**: Ve todas las mascotas + botones de edición

2. **Funcionalidades Disponibles**:
   - **Cliente**: Solo lectura de sus datos
   - **Veterinario**: Botones "Nueva Consulta", "Editar", etc.

### **En la Página de Configuración**:
- Ve a `/configurar-rol`
- Muestra tu rol actual con descripción
- Lista las funcionalidades disponibles por rol

---

## 🚀 **Acceso Rápido a Funcionalidades de Veterinario**

Una vez que tengas rol de veterinario:

### **1. Historias Clínicas** (`/historias-clinicas`)
- **Sidebar izquierdo**: Lista de todas las mascotas
- **Tabs principales**: Perfil, Historia Clínica, Alertas
- **Botones de acción**: "Nueva Consulta", "Editar"

### **2. Funcionalidades Específicas**:
- ✅ **Ver todas las mascotas** (no solo las propias)
- ✅ **Crear registros médicos** (diagnósticos, tratamientos)
- ✅ **Gestionar medicamentos** (prescripciones, dosis)
- ✅ **Administrar vacunas** (aplicación, seguimiento)
- ✅ **Crear alertas** (recordatorios para propietarios)
- ✅ **Ver datos del propietario** (contacto, dirección)
- ✅ **Estadísticas generales** (resumen del sistema)

### **3. Interfaz Diferenciada**:
- **Información del propietario** visible en perfiles
- **Botones de edición** en registros médicos
- **Opciones de gestión** en alertas
- **Estadísticas del sistema** completas

---

## 🔧 **Solución de Problemas**

### **No veo las funcionalidades de veterinario**:
1. Verifica tu rol en `/configurar-rol`
2. Asegúrate de haber guardado el metadata en Clerk
3. Cierra sesión y vuelve a entrar
4. Limpia la caché del navegador

### **El metadata no se guarda en Clerk**:
1. Verifica que estés en la aplicación correcta
2. Asegúrate de usar "Public metadata" (no Private)
3. El formato JSON debe ser exacto: `{"role": "veterinarian"}`
4. Haz clic en "Save" después de editar

### **Sigo viendo la vista de cliente**:
1. Verifica que el rol se haya guardado correctamente
2. Espera unos segundos y recarga la página
3. Cierra completamente el navegador y vuelve a abrir
4. Verifica en la consola del navegador si hay errores

---

## 📱 **Prueba las Funcionalidades**

### **Como Veterinario puedes probar**:

1. **Gestión de Mascotas**:
   - Ve la lista completa de mascotas
   - Accede a perfiles de cualquier mascota
   - Ve información de contacto de propietarios

2. **Registros Médicos**:
   - Ve historias clínicas completas
   - Observa los botones de "Nueva Consulta"
   - Explora los detalles de registros existentes

3. **Sistema de Alertas**:
   - Ve alertas de todas las mascotas
   - Observa las opciones de gestión
   - Prueba marcar alertas como completadas

4. **Estadísticas**:
   - Ve resúmenes de salud generales
   - Observa estadísticas de vacunación
   - Explora métricas del sistema

---

## 🎯 **URLs Importantes**

- **Configurar Rol**: `/configurar-rol`
- **Historias Clínicas**: `/historias-clinicas`
- **Dashboard Clerk**: [dashboard.clerk.com](https://dashboard.clerk.com)

---

## ✅ **Verificación Exitosa**

Sabrás que tienes acceso de veterinario cuando:

1. ✅ En `/configurar-rol` aparece "Veterinario" como rol actual
2. ✅ En `/historias-clinicas` ves todas las mascotas (no solo las tuyas)
3. ✅ Aparecen botones de "Nueva Consulta" y "Editar"
4. ✅ Puedes ver información de contacto de propietarios
5. ✅ Tienes acceso a estadísticas generales del sistema

**¡Una vez configurado, tendrás acceso completo a todas las funcionalidades veterinarias!** 🎉