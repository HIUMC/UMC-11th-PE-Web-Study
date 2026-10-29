import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

// Only frontend assets are served. API calls go directly to Spring Boot.
const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
]);
const server = createServer(async (request, response) => {
  const asset = assets.get(new URL(request.url, 'http://localhost:5173').pathname);
  if (!asset || !['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(404).end('Not found');
    return;
  }
  try {
    const body = await readFile(new URL(asset[0], import.meta.url));
    response.writeHead(200, { 'Content-Type': asset[1], 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(500).end('Unable to load frontend asset');
  }
});
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE'
    ? 'Port 5173 is already in use. Stop the existing frontend before starting this app.'
    : error.message);
  process.exitCode = 1;
});
// Fixed port matches the existing backend CORS allowlist.
server.listen(5173, 'localhost', () => console.log('UMC Cinema → http://localhost:5173'));
