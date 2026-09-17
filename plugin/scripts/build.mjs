import { context } from 'esbuild'

const watch = process.argv.includes('--watch')
const production = process.argv.includes('--production')

const base = {
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  external: ['vscode'],
  bundle: true,
  sourcemap: !production,
  minify: production,
  logLevel: 'info',
}

/** @type {import('esbuild').BuildOptions[]} */
const options = [
  {
    ...base,
    entryPoints: ['src/extension.ts'],
    outfile: 'dist/extension.js',
  },
  {
    ...base,
    entryPoints: ['src/internal.ts'],
    outfile: 'dist/internal.js',
  },
]

if (watch) {
  for (const option of options) {
    const ctx = await context(option)
    await ctx.watch()
  }
  console.log('watching ...')
} else {
  const { build } = await import('esbuild')
  await Promise.all(options.map((option) => build(option)))
}
