import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import tailwind from '@tailwindcss/vite';

function validateLink(node) {
  const value = node.url;
  if (/^(?:https?:\/\/|mailto:)/i.test(value)) return;
  if (value && !/^[/\\]{2}|[\u0000-\u0020\\]|^[a-z][a-z0-9+.-]*:/i.test(value)) return;
  throw new Error('Unsupported URL in archive Markdown: ' + value);
}

const publicMarkdown = {
  name: 'public-archive-markdown',
  html(node, context) { context.removeNode(node); },
  link: validateLink,
  image: validateLink,
  definition: validateLink,
};

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  markdown: { processor: satteri({ mdastPlugins: [publicMarkdown] }) },
  vite: { plugins: [tailwind()] },
});
