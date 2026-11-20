import { defineConfig } from 'astro/config';
import { archiveMarkdown } from './src/lib/markdown.mjs';
import studio from './src/studio/integration.mjs';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  integrations: [studio()],
  trailingSlash: 'always',
  markdown: { processor: archiveMarkdown() },
  vite: { plugins: [tailwind()] },
});
