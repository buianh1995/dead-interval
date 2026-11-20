const entry = name => new URL('./routes/' + name, import.meta.url);
export default function studio() {
  return {
    name: 'dead-interval-studio',
    hooks: {
      'astro:config:setup': ({ command, injectRoute, updateConfig, config }) => {
        const deny = config.vite.server?.fs?.deny ?? ['.env', '.env.*', '*.{crt,pem}', '**/.git/**'];
        updateConfig({ vite: { server: { fs: { deny: [...deny, '**/.studio/**', '**/*.studio-tmp'] } } } });
        if (command !== 'dev' || process.env.DEAD_INTERVAL_STUDIO !== '1') return;
        updateConfig({
          server: { host: '127.0.0.1', port: 4322 },
          vite: { server: { strictPort: true, cors: false, watch: { ignored: ['**/.studio/**', '**/*.studio-tmp'] } } },
        });
        for (const [pattern, file] of [
          ['/studio', 'editor.astro'],
          ['/studio/api/records', 'api.ts'],
          ['/studio/api/records/[collection]/[id]', 'api.ts'],
          ['/studio/api/preview', 'api.ts'],
          ['/studio/api/save', 'api.ts'],
          ['/studio/preview/[id]', 'preview.astro'],
        ]) injectRoute({ pattern, entrypoint: entry(file), prerender: false });
      },
    },
  };
}
