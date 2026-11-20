import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

if (process.argv.length !== 2) throw new Error('Studio uses the fixed local address 127.0.0.1:4322.');
const cli = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const child = spawn(process.execPath, [cli, 'dev', '--host', '127.0.0.1', '--port', '4322'], {
  stdio: 'inherit',
  env: { ...process.env, DEAD_INTERVAL_STUDIO: '1' },
});
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
