# DreamDuel — Frontend Web

Generador de imágenes con IA. El usuario describe la imagen (y opcionalmente sube una imagen de referencia), introduce un crédito comprado en Gumroad y descarga el resultado.

**Stack:** Vue 3 · TypeScript · Vite · Tailwind CSS · vue-router · vue-i18n (español / inglés)

## Inicio rápido

Requiere Node.js 20.19+ o 22.12+.

```bash
npm install
cp .env.example .env   # opcional: por defecto usa el backend de producción
npm run dev            # http://localhost:5173
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Chequeo de tipos + build de producción en `dist/` |
| `npm run type-check` | Solo chequeo de tipos (`vue-tsc`) |
| `npm run lint` | ESLint |
| `npm run preview` | Sirve el build de producción localmente |

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend **incluyendo** `/api` (ej. `https://dreamduel-backend-web.onrender.com/api`) |
| `VITE_GUMROAD_CHECKOUT_URL` | Página de compra de créditos en Gumroad |

## Estructura

```
src/
├── views/            # Páginas: Home, ImageGenerator, Gallery, Settings, Legal
├── layouts/          # MainLayout (navbar + navegación inferior en móvil)
├── components/       # BottomNavigation
├── services/         # generationService: subida, generación y descarga de imágenes
├── utils/            # Checkout de Gumroad y ID de sesión anónima
├── locales/          # Traducciones es / en
├── router/           # Rutas
├── config.ts         # Configuración leída de variables de entorno
└── i18n.ts           # Configuración de idioma y setLocale()
```

## Rutas

| Ruta | Vista |
|---|---|
| `/` | Landing |
| `/images` | Generador de imágenes (acepta `?prompt=` para precargar el texto) |
| `/gallery` | Galería (próximamente) |
| `/settings` | Idioma y enlaces legales |
| `/terms`, `/privacy` | Términos y política de privacidad |

## API utilizada

| Método | Endpoint | Uso |
|---|---|---|
| `POST` | `/upload/image` | Subida temporal de la imagen de referencia (`multipart/form-data`) |
| `POST` | `/generate` | Genera la imagen; valida el `licenseKey` de Gumroad (403 si es inválido o sin créditos) |
| `GET` | `/generate/download?url=` | Proxy de descarga para evitar CORS |

## Despliegue

Vercel, con `vercel.json` redirigiendo todas las rutas a `index.html`. El CI de GitHub Actions ejecuta lint y build en cada push y pull request.
