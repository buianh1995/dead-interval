import { absolute, isPublic } from '../lib/publishing';
export function GET() {
  const sitemap = isPublic ? 'Sitemap: ' + absolute('/sitemap.xml') + '\n' : '';
  return new Response('User-agent: *\nAllow: /\n' + sitemap, {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
}
