# 🌊 DreamDuel Web - Ocean Midnight

Una plataforma social de vanguardia para crear, descubrir y leer historias visuales generadas por IA. Inspirada en Wattpad y Webtoon, con un diseño "Ocean Midnight" elegante y profundo.

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
