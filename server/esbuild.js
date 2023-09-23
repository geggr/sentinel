const esbuild = require('esbuild')

const fs = require('node:fs')

esbuild.build({
    platform: 'node',
    target: 'esnext',
    bundle: true,
    entryPoints: [
        'src/server.ts'
    ],
    outdir: 'dist',
})
.then(() => {
    fs.cp('./prisma', './dist/prisma', { recursive: true }, (error) => {
        if(error) Promise.reject(error)
    })

    fs.cp('./public', './dist/public', { recursive: true }, (error) => {
        if (error) Promise.reject(error)
    })
})
.catch((error) => {
    console.error(`Unexpected error: ${error.name}`)
    console.error(error)
})