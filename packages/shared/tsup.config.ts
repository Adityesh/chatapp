import type { Options } from 'tsup';

export const tsup: Options = {
  entry: ['src/index.ts'], // Your main entry point
  format: ['esm', 'cjs'], // Output both ESM and CommonJS
  dts: true, // Generate declaration files (.d.ts)
  splitting: false, // Don't split chunks
  sourcemap: true, // Generate sourcemaps
  clean: true, // Clean the dist folder before building
  outDir: 'dist',
};