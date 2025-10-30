import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            onwarn(warning, warn) {
                // Suppress TypeScript warnings during build
                if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
                if (warning.code === 'UNRESOLVED_IMPORT') return
                warn(warning)
            }
        }
    },
    esbuild: {
        // Ignore TypeScript errors during build
        logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
})
