import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src', 'setinel.client.ts'),
            name: 'Sentinel Client',
            fileName: 'sentinel.client',
        },
        outDir: '../server/public',
    },
    esbuild: {
        platform: 'browser',
        minifyIdentifiers: false,
        keepNames: true,
    },
})
