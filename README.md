# � DreamDuel - Plataforma de Historias Visuales con IA

> Crea, descubre y comparte historias visuales generadas por inteligencia artificial

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)](https://tailwindcss.com/)

---

## 📋 Descripción

DreamDuel es una plataforma web inspirada en Wattpad y Webtoon que permite a los usuarios crear historias visuales utilizando inteligencia artificial. Los usuarios pueden generar imágenes a partir de texto, personalizar personajes, y compartir sus creaciones con la comunidad.

### ✨ Características Principales

- 🎭 **Creación de Historias** - Crea historias con múltiples escenas e imágenes generadas por IA
- 🎨 **Estilos Visuales** - Anime, Realista, Noir, Acuarela, Cómic, Fantasía
- 👥 **Personajes Personalizados** - Sube imágenes de personajes para mantener consistencia
- 💎 **Sistema Premium** - Generaciones ilimitadas, sin marcas de agua, estilos exclusivos
- 🔒 **Privacidad** - Historias públicas o privadas
- ❤️ **Interacciones Sociales** - Likes, guardados, seguir usuarios
- 🔍 **Búsqueda Avanzada** - Por género, tags, autor
- 📊 **Analytics** - Tracking de métricas y comportamiento de usuarios
- 🎁 **Sistema de Referidos** - Invita amigos y gana créditos gratis
- 🔐 **Autenticación** - Login con email, usuario, Google y Apple

---

## 🚀 Inicio Rápido

### **Prerrequisitos**

- Node.js 18+ 
- npm o pnpm

### **Instalación**

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### **Scripts Disponibles**

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
```

---

## 🏗️ Arquitectura

### **Clean Architecture + Domain-Driven Design**

```
src/
├── domain/               # Entidades y lógica de negocio
│   ├── stories/
│   │   ├── entities/     # Story, Character
│   │   ├── repositories/ # Interfaces
│   │   └── value-objects/
│   └── users/
│       ├── entities/     # User
│       └── repositories/
├── application/          # Casos de uso
│   └── stories/
│       ├── CreateStory.usecase.ts
│       ├── GetStories.usecase.ts
│       └── LikeStory.usecase.ts
├── infrastructure/       # Implementaciones técnicas
│   ├── services/        # HTTP, Auth, Upload, AI, Payments
│   ├── repositories/    # API y Mock implementations
│   └── config/          # Configuración
├── presentation/        # UI Components (Vue)
│   ├── views/          # Páginas
│   ├── components/     # Componentes reutilizables
│   └── layouts/        # Layouts
├── stores/             # Pinia State Management
└── router/             # Vue Router
```

---

## 🎨 Sistema de Diseño

### **Paleta de Colores "Ocean Midnight"**

#### Fondos
- **Deep**: `#000A0F` - Fondo principal
- **Elevated**: `#0F1419` - Navbars, Sidebars
- **Card**: `#1A2332` - Tarjetas

#### Primarios
- **Primary**: `#0099FF` - Botones, Links
- **Primary Light**: `#33AAFF` - Hover
- **Accent Purple**: `#7C3AED` - Detalles mágicos
- **Accent Teal**: `#14B8A6` - Success, Premium
- **Accent Gold**: `#F59E0B` - Destacados
- **Accent Crimson**: `#EF4444` - Alertas

#### Texto
- **Primary**: `#FFFFFF` - Títulos
- **Secondary**: `#B3B3B3` - Párrafos
- **Tertiary**: `#6B7280` - Meta-info

---

## 📱 Vistas Principales

### **1. HomeView** - Descubrimiento
- Hero section con historia destacada
- Carrusel de historias en tendencia
- Carrusel de historias nuevas
- Responsive design completo

### **2. CreateView** - Generación de Historias
- Formulario intuitivo para describir historia
- Selección de estilos visuales (6 opciones)
- Selección de géneros (6 opciones)
- Upload de personajes personalizados
- Toggle público/privado
- Límites por plan (Free: 2 personajes, Premium: 10)

### **3. ReaderView** - Lectura Estilo Webtoon
- Scroll vertical inmersivo
- Imágenes optimizadas y responsive
- Barra de acciones (like, share, visibilidad)
- Sistema de blur para usuarios free
- Descargas con/sin marca de agua según plan

### **4. ProfileView** - Perfil de Usuario
- Cambio de foto de perfil por imagen
- Edición de biografía
- Sistema de créditos (3 imágenes gratis cada 12h)
- Código de referidos con contador
- Badge premium
- Mis historias / Guardadas / Likes
- Estadísticas (historias, likes, seguidores)

### **5. SearchView** - Búsqueda Avanzada
- Búsqueda por texto
- Filtros por tags
- Filtros por estilo visual
- Ordenamiento (recientes, populares, likes)

### **6. StoryDetailsView** - Detalles de Historia
- Portada optimizada (responsive)
- Información del autor
- Sinopsis y tags
- Estadísticas (vistas, likes, comentarios)
- Botón principal de lectura

### **7. LoginView / RegisterView** - Autenticación
- Login con email o username
- Autenticación con Google
- Autenticación con Apple (reemplazó Facebook)
- Sistema de validación
- Recuperación de contraseña

### **8. SettingsView** - Configuración
- Edición de perfil
- Cambio de contraseña
- Notificaciones
- Sección premium
- Logout

### **9. PricingView** - Planes Premium
- Plan Free vs Premium
- Precios mensuales y anuales
- Comparativa de características
- FAQs

---

## 💎 Sistema Premium

### **Características Premium:**

✅ **Generaciones ilimitadas** - Sin límite diario  
✅ **Sin marcas de agua** - Descargas limpias  
✅ **Estilos exclusivos** - Acceso a estilos premium  
✅ **Hasta 10 personajes** (vs 2 en free)  
✅ **Imágenes sin blur** - Calidad completa  
✅ **Sin anuncios** - Experiencia premium  
✅ **Descargas HD** - Alta calidad  

### **Planes:**

- **Mensual**: $9.99/mes
- **Anual**: $89.99/año (25% descuento)

---

## 🔌 Integración con Backend

### **✅ Frontend 100% Listo para Backend**

Todos los servicios están implementados y listos para conectar:

#### **Servicios Disponibles** (`/src/infrastructure/services/`)

| Servicio | Descripción |
|----------|-------------|
| **HttpClient** | Cliente HTTP con timeout y retry |
| **AuthService** | Login, registro, OAuth (Google/Apple), recuperación de contraseña |
| **UserService** | Perfil, avatar, seguidores, créditos |
| **UploadService** | Upload de imágenes a cloud storage |
| **AIGenerationService** | Generación de imágenes con IA, batch, regeneración |
| **PaymentService** | Stripe, suscripciones, facturas, portal |
| **CommentService** | CRUD de comentarios, likes, reportes |
| **AnalyticsService** | Tracking de eventos y métricas (PQL) |

#### **Configuración Rápida:**

1. **Configurar `.env`**
```env
VITE_API_URL=https://tu-backend.com
VITE_GOOGLE_CLIENT_ID=tu_google_client_id
VITE_APPLE_CLIENT_ID=tu_apple_client_id
VITE_STRIPE_PUBLISHABLE_KEY=tu_stripe_key
```

2. **Cambiar Repositorio Mock por API**
En `/src/infrastructure/di/container.ts`:
```typescript
// Cambiar de Mock a API Real
return new ApiStoryRepository();
```

3. **Implementar Endpoints** (ver sección abajo)

---

## 📡 Endpoints Requeridos en Backend

### **Autenticación**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/google
POST   /api/auth/apple
POST   /api/auth/password-reset
```

### **Usuarios**
```
GET    /api/users/me
GET    /api/users/:id
PUT    /api/users/:id
PUT    /api/users/:id/avatar
POST   /api/users/:id/follow
GET    /api/users/me/credits
POST   /api/users/me/credits/use
```

### **Historias**
```
GET    /api/stories
GET    /api/stories/trending
GET    /api/stories/:id
POST   /api/stories
PUT    /api/stories/:id
DELETE /api/stories/:id
GET    /api/stories/search
POST   /api/stories/:id/like
POST   /api/stories/:id/save
POST   /api/stories/:id/view
```

### **Generación IA**
```
POST   /api/generate
POST   /api/generate/batch
GET    /api/generate/:id/status
POST   /api/generate/:id/regenerate
```

### **Pagos (Stripe)**
```
GET    /api/payments/plans
POST   /api/payments/subscribe
GET    /api/payments/subscription/status
POST   /api/payments/subscription/cancel
GET    /api/payments/invoices
POST   /api/payments/portal
```

### **Upload**
```
POST   /api/upload (multipart/form-data)
```

### **Analytics**
```
POST   /api/analytics/event
GET    /api/analytics/user/metrics
GET    /api/analytics/story/:storyId
```

---

## 💾 Base de Datos - Funcionalidades Implementadas

### **Tablas Principales Requeridas:**

**USUARIOS:**
- Registro, login, OAuth (Google/Apple)
- Perfil (username, email, avatar, bio)
- Sistema premium (isPremium, fechas de suscripción)
- Sistema de créditos (3 imágenes gratis cada 12h)
- Código de referidos único
- Seguidores/seguidos

**HISTORIAS:**
- CRUD completo
- Visibilidad (público/privado)
- Escenas con texto e imágenes
- Autor, portada, sinopsis, tags
- Estadísticas (vistas, likes, comentarios)

**INTERACCIONES:**
- Likes en historias
- Guardados/favoritos
- Seguir usuarios
- Comentarios (pendiente UI)

**SISTEMA PREMIUM:**
- Planes (mensual/anual)
- Estado de suscripción
- Historial de pagos
- Método de pago

**ANALYTICS:**
- Tracking de eventos
- Métricas de usuario (PQL)
- Clics en blur, descargas, generaciones
- Usuarios de alta intención

---

## 🛠️ Tecnologías

- **Vue 3** - Framework progresivo con Composition API
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Pinia** - State management oficial de Vue
- **Vue Router** - Routing SPA
- **Tailwind CSS** - Utility-first CSS
- **Heroicons** - Iconografía
- **Clean Architecture** - Arquitectura escalable

---

## 📦 Build y Deploy

### **Build de Producción**

```bash
npm run build
```

Los archivos se generan en `/dist`

### **Deploy Recomendado**

- **Vercel** (recomendado para Vue/Vite)
- **Netlify**
- **AWS S3 + CloudFront**
- **DigitalOcean App Platform**

---

## 🎯 Estado del Proyecto

### **✅ Completado:**
- ✅ Toda la UI y componentes
- ✅ Sistema de autenticación completo
- ✅ Sistema premium funcional
- ✅ CRUD de historias
- ✅ Sistema de créditos y referidos
- ✅ Likes, guardados, seguir usuarios
- ✅ Búsqueda y filtros
- ✅ Analytics y tracking
- ✅ Todos los servicios HTTP listos
- ✅ Cambio de visibilidad optimizado
- ✅ Cambio de foto de perfil
- ✅ Login con email o username
- ✅ OAuth con Google y Apple
- ✅ Responsive completo
- ✅ Imágenes optimizadas

### **⏳ Requiere Backend:**
- Generación real de imágenes con IA
- Storage de imágenes en cloud (Cloudinary/S3)
- Sistema de pagos con Stripe
- Base de datos PostgreSQL/MySQL
- Webhooks de pago

---

## 📚 Uso de Servicios

```typescript
// En cualquier componente Vue
import { 
  authService, 
  userService, 
  aiGenerationService 
} from '@/infrastructure/services';

// Login
const auth = authService();
await auth.login({ 
  emailOrUsername: 'user@email.com', 
  password: '123456' 
});

// Obtener perfil
const user = userService();
const profile = await user.getCurrentUser();

// Generar imagen
const ai = aiGenerationService();
const result = await ai.generateImage({
  prompt: 'A magical forest at sunset',
  style: 'fantasy'
});
```

---

## 🤝 Convenciones

- **Naming**: camelCase para funciones/variables, PascalCase para componentes
- **Imports**: Absolute paths con `@/`
- **Componentes**: Script Setup Composition API
- **Estilos**: Tailwind utility classes
- **Commits**: Conventional Commits (feat:, fix:, docs:)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ para creadores de historias**

## 🎨 Sistema de Diseño

### Paleta de Colores "Ocean Midnight"

#### Fondos (Atmósfera oscura y profunda)
- **Deep**: `#000A0F` - Fondo principal de la página
- **Elevated**: `#0F1419` - Navbars, Sidebars
- **Card**: `#1A2332` - Tarjetas de historias

#### Primarios (Ocean Blue - Acciones principales)
- **Primary**: `#0099FF` - Botones, Links
- **Primary Light**: `#4FC3F7` - Hover, Efectos de brillo
- **Primary Dark**: `#0277BD` - Estados activos

#### Acentos
- **Crimson**: `#FF6E40` - Acciones secundarias / Alertas cálidas
- **Teal**: `#1DE9B6` - Éxito, características Premium
- **Purple**: `#B39DDB` - Detalles decorativos / Magia

#### Texto (Jerarquía visual)
- **Primary**: `#FFFFFF` - Títulos
- **Secondary**: `#B3B3B3` - Párrafos, subtítulos
- **Tertiary**: `#6B7280` - Placeholders, meta-info

## 🚀 Stack Tecnológico

- **Framework**: Vue 3 (Composition API con `<script setup>`)
- **Lenguaje**: TypeScript (Configuración estricta)
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Iconos**: Heroicons

## 📂 Arquitectura del Proyecto

```
src/
├── models/          # Interfaces TypeScript
│   └── Story.ts     # Modelo de datos de historias
├── services/        # Capa de lógica de negocio
│   └── storyService.ts
├── stores/          # Estado global con Pinia
│   └── storyStore.ts
├── layouts/         # Layouts reutilizables
│   └── MainLayout.vue
├── views/           # Páginas principales
│   ├── HomeView.vue
│   ├── CreateView.vue
│   └── ReaderView.vue
├── components/      # Componentes reutilizables
│   └── StoryCard.vue
├── router/          # Configuración de rutas
│   └── index.ts
└── utils/           # Utilidades
    └── animations.ts
```

## 🎯 Características Principales

### 1. Home (Discovery)
- **Hero Section**: Banner destacado con la historia más popular
- **Carruseles**: Listas horizontales de historias en tendencia y nuevas
- **Animaciones**: Efectos hover y transiciones suaves

### 2. Create (Generator)
- **Input Inteligente**: Textarea para describir la historia deseada
- **Selectores Visuales**: Chips para elegir estilo (Anime, Realista, Noir, etc.)
- **Géneros**: Selección de categoría (Romance, Acción, Misterio, etc.)
- **Botón CTA**: "MATERIALIZAR" con efectos visuales impactantes

### 3. Reader (Webtoon Style)
- **Scroll Vertical**: Estilo Webtoon para lectura inmersiva
- **Imágenes Full Width**: Centradas con máximo 3xl
- **Texto Superpuesto**: Con gradiente para legibilidad
- **Barra de Acciones**: Like, Share, y botón de retroceso

## 🛠️ Instalación y Desarrollo

### Requisitos Previos
- Node.js 18+ 
- npm o pnpm

### Comandos Disponibles
```bash
# Desarrollo
npm run dev

# Compilación para Producción
npm run build

# Preview de Producción
npm run preview
```

## 📱 Vistas Implementadas

### HomeView
- Hero con historia destacada
- Sección "En Tendencia" 
- Sección "Recién Llegadas"
- Navegación por carrusel

### CreateView
- Formulario de generación de historias
- Selección de estilo visual (6 opciones)
- Selección de género (6 opciones)
- Validación de entrada
- Estado de carga durante generación

### ReaderView
- Lectura vertical tipo Webtoon
- Barra de acciones fija
- Sistema de likes
- Información del autor
- Card de finalización

## 🎨 Componentes Clave

### StoryCard
Tarjeta de historia con:
- Imagen de portada (aspect ratio 2:3)
- Título y autor
- Estadísticas (vistas y likes)
- Tags
- Efectos hover con escala y sombra

### MainLayout
- Navbar con efecto Glass (backdrop-blur)
- Logo animado
- Links de navegación
- Avatar de usuario
- Fixed positioning

## 🔮 Próximos Pasos

1. **Integración con Backend**: Conectar con API real de generación de IA
2. **Autenticación**: Sistema de login/registro
3. **Perfil de Usuario**: Página de perfil con historias propias
4. **Comentarios**: Sistema de comentarios en historias
5. **Búsqueda**: Filtros avanzados por género, estilo, etc.
6. **PWA**: Convertir a Progressive Web App
7. **Animaciones**: Añadir más micro-interacciones

## 📝 Notas Técnicas

- **Clean Architecture**: Separación clara entre UI, lógica de negocio y datos
- **Type Safety**: TypeScript estricto para evitar errores en tiempo de ejecución
- **Responsive**: Diseño adaptable a mobile, tablet y desktop
- **Performance**: Lazy loading de imágenes y code splitting
- **Accesibilidad**: Uso semántico de HTML y contraste de colores

---

**Desarrollado con ❤️ usando Vue 3 + TypeScript + Tailwind CSS**
