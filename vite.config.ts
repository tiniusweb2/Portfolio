import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import preprocess from 'svelte-preprocess'

export default defineConfig({
  plugins: [
    svelte({
      preprocess: preprocess()
    })
  ],
  resolve: {
    alias: {
      '$lib': path.resolve('./src/lib'),
      '$components': path.resolve('./src/components'),
      '$styles': path.resolve('./src/styles'),
      '$types': path.resolve('./src/types')
    }
  }
}) 