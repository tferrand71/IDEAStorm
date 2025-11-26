import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/IDEAStorm/', // <--- AJOUTE CETTE LIGNE (Attention aux majuscules exactes de ton repo)
})