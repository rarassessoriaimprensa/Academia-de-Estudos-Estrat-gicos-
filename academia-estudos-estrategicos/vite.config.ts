import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Academia de Estudos Estratégicos',
        short_name: 'Academia Estratégica',
        description: 'Formação intelectual em teoria militar e filosofia militar.',
        theme_color: '#101f2c',
        background_color: '#f2eee5',
        display: 'standalone',
        start_url: '/',
        icons: []
      }
    })
  ]
})
