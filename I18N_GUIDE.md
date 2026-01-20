# 🌐 Guía de Internacionalización (i18n)

## 📦 Instalación Completada

```bash
npm install vue-i18n@9
```

## 🗂️ Estructura de Archivos

```
src/
├── i18n/
│   ├── index.ts           # Configuración principal
│   └── locales/
│       ├── es.ts          # Traducciones en Español
│       └── en.ts          # Traducciones en English
└── main.ts               # Plugin registrado
```

## ✅ Configuración Completada

### 1. Plugin Registrado en `main.ts`
```typescript
import { i18n } from './i18n';
app.use(i18n);
```

### 2. Idiomas Disponibles
- **Español** (`es`) - Por defecto
- **English** (`en`)

## 🎯 Uso en Componentes

### Opción 1: Composition API (Recomendado)
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <h1>{{ t('home.hero.title') }}</h1>
  <button>{{ t('common.save') }}</button>
</template>
```

### Opción 2: Template Directo (Global Injection activado)
```vue
<template>
  <h1>{{ $t('home.hero.title') }}</h1>
</template>
```

## 🔄 Cambiar Idioma

### Desde SettingsView (YA IMPLEMENTADO)
El selector de idioma en `/settings` cambia automáticamente el idioma cuando seleccionas una opción.

### Programáticamente
```typescript
import { setLocale } from '@/i18n';

setLocale('en');  // Cambiar a inglés
setLocale('es');  // Cambiar a español
```

## 📝 Estructura de Traducciones

### Ejemplo de `es.ts` y `en.ts`
```typescript
export default {
  nav: {
    home: 'Inicio',    // en: 'Home'
    create: 'Crear',   // en: 'Create'
  },
  common: {
    save: 'Guardar',   // en: 'Save'
    cancel: 'Cancelar' // en: 'Cancel'
  },
  home: {
    hero: {
      title: 'Crea Historias Visuales con IA',
      subtitle: 'Convierte tus fantasías en narrativas visuales únicas'
    }
  }
}
```

## 🎨 Componentes Ya Traducidos

✅ **BottomNavigation** - Navegación inferior  
✅ **SettingsView** - Configuración completa  
⏳ Pendientes: HomeView, CreateView, SearchView, etc.

## 📋 Cómo Agregar Nuevas Traducciones

### 1. Agregar en `src/i18n/locales/es.ts`
```typescript
export default {
  // ... traducciones existentes
  myNewSection: {
    title: 'Mi Nuevo Título',
    description: 'Mi descripción'
  }
};
```

### 2. Agregar en `src/i18n/locales/en.ts`
```typescript
export default {
  // ... existing translations
  myNewSection: {
    title: 'My New Title',
    description: 'My description'
  }
};
```

### 3. Usar en componente
```vue
<h1>{{ t('myNewSection.title') }}</h1>
<p>{{ t('myNewSection.description') }}</p>
```

## 🚀 Persistencia

- El idioma seleccionado se guarda en **localStorage**
- Clave: `locale`
- Se restaura automáticamente al recargar la página

## 🔍 Obtener Idioma Actual

```typescript
import { getLocale } from '@/i18n';

const currentLanguage = getLocale(); // 'es' | 'en'
```

## ⚙️ Configuración Avanzada

La configuración está en `src/i18n/index.ts`:

```typescript
export const i18n = createI18n({
  legacy: false,          // Usa Composition API
  locale: savedLocale,    // Idioma por defecto
  fallbackLocale: 'es',   // Idioma de respaldo
  messages,               // Objeto con traducciones
  globalInjection: true   // Permite usar $t en templates
});
```

## 🎯 Próximos Pasos

Para traducir el resto de la aplicación, actualiza estos componentes:

1. `HomeView.vue` - Hero, secciones de trending/new
2. `CreateView.vue` - Formulario de generación
3. `SearchView.vue` - Búsqueda y filtros
4. `ProfileView.vue` - Perfil de usuario
5. `StoryDetailsView.vue` - Detalles de historia
6. `MainLayout.vue` - Navegación desktop

### Ejemplo para HomeView:
```vue
<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <h1>{{ t('home.hero.title') }}</h1>
  <p>{{ t('home.hero.subtitle') }}</p>
  <button>{{ t('home.hero.cta') }}</button>
</template>
```

---

**✅ La funcionalidad de cambio de idioma está 100% operativa.**  
Cambia el idioma en `/settings` y toda la interfaz traducida se actualizará automáticamente.
