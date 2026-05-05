import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg'],
    manifest: {
      name: 'T.A. Diary',
      short_name: 'T.A. Diary',
      description: 'Offline First Travel Allowance PWA',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/TAPWA/',
      icons: [
        {
          src: 'pwa.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa1.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }

  })],
  base: '/TAPWA/'
})
