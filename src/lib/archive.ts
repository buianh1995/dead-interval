import { getCollection } from 'astro:content';
import { existsSync, readdirSync } from 'node:fs';
import type { CollectionEntry } from 'astro:content';
import { site } from '../data/site';

function requireData(condition: unknown, entry: string, message: string): asserts condition {
  if (!condition) throw new Error(entry + ': ' + message);
}

function unique(values: readonly (string | number)[], entry: string, field: string) {
  requireData(new Set(values).size === values.length, entry, 'Duplicate ' + field);
}

type Art = CollectionEntry<'cases'>['data']['art'];
type Image = Exclude<Art, {kind: 'placeholder'}>['image'];

function checkImage(image: Image, slug: string) {
  const variants = image.variants ?? [];
  unique(variants.map(item => item.width), slug, 'image variant widths');
  for (const src of [image.src, ...variants.map(item => item.src)]) {
    requireData(existsSync('public' + src), slug, 'Missing image ' + src);
  }
}

export async function getArchive() {
  const [cases, entities, signals, scripts] = await Promise.all([
    getCollection('cases'), getCollection('entities'), getCollection('signals'), readdirSync('src/content/scripts').some(name => name.endsWith('.md')) ? getCollection('scripts') : Promise.resolve([]),
  ]);
  return validateArchive({cases,entities,signals,scripts});
}

export function findScript(scripts: CollectionEntry<'scripts'>[], item: Extract<CaseEntry['data'],{state:'released'}>) {
  return scripts.find(({data}) => data.caseId === item.id && (!item.scriptId || data.id === item.scriptId));
}

export function validateArchive({cases,entities,signals,scripts}: Pick<ArchiveInput,'cases'|'entities'|'signals'|'scripts'>) {
  unique([...cases, ...entities, ...signals, ...scripts].map(entry => entry.data.id), 'Archive', 'id');
  for (const group of [cases, entities, signals]) {
    unique(group.map(entry => entry.data.slug), 'Archive', 'slug within collection');
  }
  unique(cases.map(entry => entry.data.number), 'Cases', 'number');
  unique(cases.map(entry => entry.data.order), 'Cases', 'order');

  const rewards = new Set<string>();
  for (const entry of cases) {
    const item = entry.data;
    const sealed = item.state === 'sealed';
    requireData(sealed ? !entry.body?.trim() && !item.seo.indexable : entry.body?.trim(), item.slug,
      'Sealed entries require teaser-only content and noindex. Open entries require Markdown.');
    unique(item.signalIds, item.slug, 'signalIds');
    unique(item.entityIds, item.slug, 'entityIds');
    for (const id of item.entityIds) {
      requireData(entities.some(entity => entity.data.id === id), item.slug, 'Unknown entity ' + id);
    }
    for (const id of item.signalIds) {
      requireData(signals.some(({data}) => data.id === id && data.caseId === item.id && data.presentation === 'standard'),
        item.slug, 'Invalid standard signal ' + id);
    }
    if (!sealed && item.puzzle) {
      const puzzle = item.puzzle;
      unique(puzzle.evidenceSignalIds, item.slug, 'evidence signals');
      requireData(puzzle.evidenceSignalIds.every(id => item.signalIds.includes(id)), item.slug, 'Puzzle evidence must belong to the case');
      requireData(!rewards.has(puzzle.rewardSignalId) && signals.some(({data}) =>
        data.id === puzzle.rewardSignalId && data.caseId === item.id && data.presentation === 'puzzle-reward'),
        item.slug, 'Invalid or repeated puzzle reward');
      rewards.add(puzzle.rewardSignalId);
    }
    const images = item.art.kind === 'placeholder' ? [] : [item.art.image];
    if (!sealed) images.push(...(item.gallery ?? []));
    if (item.state === 'released') {
      images.push(item.release.poster);
      if (item.scriptId) requireData(scripts.some(({data}) => data.id === item.scriptId && data.caseId === item.id),
        item.slug, 'Invalid scriptId');
    }
    for (const image of images) checkImage(image, item.slug);
  }
  for (const {data,body} of entities) {
    requireData(data.visibility === 'redacted' ? !body?.trim() && !data.seo.indexable : body?.trim(),
      data.slug, 'Invalid visibility, body or indexing combination');
    requireData(cases.some(item => item.data.entityIds.includes(data.id)), data.slug, 'Entity has no case');
    if (data.art.kind !== 'placeholder') checkImage(data.art.image, data.slug);
  }
  for (const {data,body} of signals) {
    requireData(body?.trim(), data.slug, 'Markdown is required');
    requireData(data.presentation === 'standard'
      ? cases.some(item => item.data.id === data.caseId && item.data.signalIds.includes(data.id))
      : !data.seo.indexable && !data.seo.ogImage && rewards.has(data.id), data.slug, 'Invalid signal relationship or SEO');
  }
  unique(scripts.map(({data}) => data.caseId), 'Scripts', 'caseId');
  for (const {data,body} of scripts) {
    requireData(body?.trim() && cases.some(entry => entry.data.state === 'released' &&
      entry.data.id === data.caseId && (!entry.data.scriptId || entry.data.scriptId === data.id)), data.id, 'Script must belong to its released case');
  }
  for (const {data} of [...cases, ...entities, ...signals]) {
    if (data.seo.ogImage) requireData(existsSync('public' + data.seo.ogImage), data.slug, 'Missing social image');
  }
  const featured = cases.find(item => item.data.id === site.featuredCaseId);
  requireData(featured && featured.data.state !== 'sealed', 'Site', 'Invalid featuredCaseId');
  return {
    cases: cases.sort((a,b) => a.data.order - b.data.order), entities, scripts, featured,
    signals: signals.sort((a,b) => b.data.publishedOn.localeCompare(a.data.publishedOn) || a.data.id.localeCompare(b.data.id)),
  };
}

type ArchiveInput = { cases: CaseEntry[]; entities: EntityEntry[]; signals: CollectionEntry<'signals'>[]; scripts: CollectionEntry<'scripts'>[] };
export type Archive = Awaited<ReturnType<typeof getArchive>>;
export type CaseEntry = CollectionEntry<'cases'>;
export type EntityEntry = CollectionEntry<'entities'>;
