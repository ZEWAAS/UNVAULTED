// vueform.config.js
import en from '@vueform/vueform/locales/en'
import tailwind from '@vueform/vueform/dist/tailwind' // <--- WICHTIG: Importiere das Theme
import { defineConfig } from '@vueform/vueform'

export default defineConfig({
  theme: tailwind, // <--- WICHTIG: Setze das Theme hier
  locales: { en },
  locale: 'en',
})