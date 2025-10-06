# Formotex

## Sistema de Inventario de Equipos Informáticos

Sistema de gestión de inventario especializado en mantenimiento y distribución de equipos informáticos para organizaciones.

## Inicio

### Prerrequisitos

- **Node.js**: v18+ (recomendado v20+)
- **pnpm**: v8+
- **Docker & Docker Compose**: Para PostgreSQL

### 1. Clonar y configurar

```bash
git clone <repository-url>
cd formotex
pnpm install
```

### 2. Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=inventario

# JWT
JWT_SECRET=tu-jwt-secret-super-seguro-aqui
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
```

### 3. Iniciar Base de Datos

```bash
# Iniciar PostgreSQL con Docker Compose
docker-compose up -d

# Verificar que esté corriendo
docker-compose ps
```

### 4. Ejecutar el Proyecto

```bash
# Modo desarrollo 
pnpm run dev
```

### 5. Poblar Base de Datos (Opcional)

```bash
# Ejecutar seed para datos iniciales
pnpm run seed
```

El servidor estará disponible en: **http://localhost:3000**

## Scripts

```bash
pnpm run dev      # Desarrollo con hot-reload
pnpm run build    # Compilar TypeScript
pnpm start        # Ejecutar versión compilada
pnpm run check    # Verificar errores TypeScript
pnpm run seed     # Poblar BD con datos iniciales
pnpm run typeorm  # CLI de TypeORM
```

## API Endpoints

### Autenticación
```
POST /auth/login     # Iniciar sesión
POST /auth/register  # Registrar usuario (solo admins)
```

### Equipos
```
GET    /devices           # Listar equipos (response compacto)
GET    /devices/:id       # Obtener equipo (response completo)
POST   /devices           # Crear equipo
PUT    /devices/:id       # Actualizar equipo
DELETE /devices/:id       # Eliminar equipo
```

### Modelos de Equipos
```
GET    /device-models     # Listar modelos
POST   /device-models     # Crear modelo
PUT    /device-models/:id # Actualizar modelo
DELETE /device-models/:id # Eliminar modelo
```

### Estados/Etiquetas
```
GET    /status-labels     # Listar estados
POST   /status-labels     # Crear estado
PUT    /status-labels/:id # Actualizar estado
DELETE /status-labels/:id # Eliminar estado
```

### Asignaciones
```
GET    /device-assignments              # Listar todas las asignaciones
GET    /device-assignments/active       # Asignaciones activas
GET    /device-assignments/history      # Historial completo
GET    /device-assignments/device/:id   # Asignaciones de un equipo
GET    /device-assignments/user/:id     # Asignaciones de un usuario
POST   /device-assignments              # Crear asignación
PUT    /device-assignments/:id/end      # Finalizar asignación
```

### Entidades Principales

- **Device**: Equipos con asset tag, serial, modelo, estado, ubicación
- **DeviceModel**: Catálogo de modelos (Dell Latitude, HP ProBook, etc.)
- **StatusLabel**: Estados del equipo (Stock, Uso, Mantenimiento, Retirado)
- **DeviceAssignment**: Historial de asignaciones usuario-equipo
- **User**: Usuarios del sistema con roles (admin/user)