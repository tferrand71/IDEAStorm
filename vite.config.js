import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/IDEAStorm/', // <--- INDISPENSABLE POUR QUE ÇA MARCHE EN LIGNE
})