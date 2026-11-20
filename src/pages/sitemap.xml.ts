import { getArchive } from '../lib/archive';
import { absolute, checkPublishingConfig, isPublic } from '../lib/publishing';

export async function GET() {
  checkPublishingConfig();
  const archive = await getArchive();
  const paths = isPublic ? ['/', '/cases/', '/entities/', '/signals/', '/privacy/'] : [];
  if (isPublic) {
    for (const group of ['cases','entities','signals'] as const) {
      for (const {data} of archive[group]) {
        if (data.seo.indexable) paths.push('/' + group + '/' + data.slug + '/');
      }
    }
  }
  const urls = paths.map(path => '<url><loc>' + absolute(path) + '</loc></url>').join('');
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls + '</urlset>', {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
