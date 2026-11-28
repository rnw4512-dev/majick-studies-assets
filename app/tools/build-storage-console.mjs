// Use Vite's installed esbuild dependency through Vite's public build API.
// One canonical TypeScript implementation; generate a standalone IIFE.
import { build } from 'vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
const result = await build({
  configFile: false, publicDir: false, logLevel: 'error',
  build: {
    write: false, minify: false, target: 'es2022',
    lib: { entry: resolve('src/core/storage-console-launch.ts'), name: 'AetheriaStorageCheck', formats: ['iife'] },
    rollupOptions: { output: { inlineDynamicImports: true } }
  }
})
const outputs = Array.isArray(result) ? result.flatMap(r => r.output) : result.output
const chunks = outputs.filter(o => o.type === 'chunk')
if (chunks.length !== 1 || chunks[0].imports.length || chunks[0].dynamicImports.length) throw Error('Expected one standalone console script')
const code = chunks[0].code
await mkdir('dist', { recursive: true })
await writeFile('dist/storage-check-console.js', code)
if ((await readFile('dist/storage-check-console.js', 'utf8')) !== code) throw Error('Console bundle write mismatch')
console.log('Generated dist/storage-check-console.js from canonical metadata checker.')
