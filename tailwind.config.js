/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FONDOS (Atmósfera oscura y profunda)
        background: {
          deep: '#000A0F',      // Fondo principal de la página
          elevated: '#0F1419',  // Navbars, Sidebars
          card: '#1A2332'       // Tarjetas de historias
        },
        // PRIMARIOS (Ocean Blue - Para acciones principales)
        primary: {
          DEFAULT: '#0099FF',   // Botones, Links
          light: '#4FC3F7',     // Hover, Glow effects
          dark: '#0277BD'       // Active states
        },
        // ACENTOS (Para destacar elementos específicos)
        accent: {
          crimson: '#FF6E40',   // Acciones secundarias / Alertas cálidas
          teal: '#1DE9B6',      // Éxito, Premium features
          purple: '#B39DDB'     // Detalles decorativos / Magia
        },
        // TEXTO (Jerarquía visual)
        text: {
          primary: '#FFFFFF',   // Títulos
          secondary: '#B3B3B3', // Párrafos, subtítulos
          tertiary: '#6B7280'   // Placeholders, meta-info
        },
        // ESTADOS
        success: '#26A69A',
        error: '#EF5350',
        warning: '#FFCA28'
      }
    },
  },
  plugins: [],
}
