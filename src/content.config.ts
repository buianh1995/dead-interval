import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const key = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const quote = z.strictObject({ text, attribution: text.optional() });
const seo = z.strictObject({
  title: text, description: text, indexable: z.boolean(),
  ogImage: text.regex(/^\/og\/[a-z0-9-]+\.jpg$/).optional(), ogImageAlt: text.optional(),
}).refine(value => Boolean(value.ogImage) === Boolean(value.ogImageAlt));
const artPath = text.regex(/^\/art\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(?:avif|webp|jpg|png)$/);
const image = z.strictObject({
  src: artPath,
  variants: z.array(z.strictObject({ src: artPath, width: z.number().int().positive() })).optional(),
  alt: z.string(), caption: text.optional(),
  focus: z.strictObject({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).optional(),
});
const art = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('placeholder'), motif: z.enum(['perfusion','spiral','containment','submersion']) }),
  z.strictObject({ kind: z.literal('concept'), image }),
  z.strictObject({ kind: z.literal('keyframe'), image }),
]);
const entry = { id: key, slug: key, title: text, summary: text, seo };
const caseBase = {
  ...entry, number: text.regex(/^C-\d{2,}$/), order: z.number().int().positive(), art,
  topics: z.array(text).min(1), entityIds: z.array(key), signalIds: z.array(key).min(1),
  shareQuote: quote.optional(),
};
const sequence = text.regex(/^[1-9]\d{0,14}$/);
const puzzle = z.strictObject({
  kind: z.literal('missing-sequence'), id: key, prompt: text, answer: sequence,
  evidenceSignalIds: z.tuple([key,key]), neighborSequences: z.tuple([sequence,sequence]),
  hints: z.tuple([text,text]), rewardSignalId: key,
}).refine(p => Number(p.neighborSequences[0]) + 1 === Number(p.answer) &&
  Number(p.answer) + 1 === Number(p.neighborSequences[1]), 'The sequence must have exactly one missing value');
const openFields = { closingQuestion: text, puzzle: puzzle.optional(), gallery: z.array(image).optional() };
const release = z.strictObject({
  provider: z.literal('youtube'), videoId: text.regex(/^[\w-]{11}$/),
  releasedAt: z.iso.datetime(), poster: image, durationSeconds: z.number().int().positive().optional(),
});
const caseSchema = z.discriminatedUnion('state', [
  z.strictObject({ ...caseBase, ...openFields, state: z.literal('in-development') }),
  z.strictObject({ ...caseBase, state: z.literal('sealed'), embargoMessage: text }),
  z.strictObject({ ...caseBase, ...openFields, state: z.literal('released'), release, scriptId: key.optional() }),
]);
const entityBase = { ...entry, art, kind: z.enum(['human','ai','wetware','unknown']) };
const entitySchema = z.discriminatedUnion('visibility', [
  z.strictObject({ ...entityBase, visibility: z.literal('public'), designation: text, observations: z.array(text).min(1) }),
  z.strictObject({ ...entityBase, visibility: z.literal('redacted'), publicObservation: text }),
]);
const signalBase = {
  ...entry, caseId: key, format: z.enum(['log','memo','transcript','interruption']),
  archiveStamp: text, publishedOn: z.iso.date(),
};
const signalSchema = z.discriminatedUnion('presentation', [
  z.strictObject({ ...signalBase, presentation: z.literal('standard'), shareQuote: quote.optional() }),
  z.strictObject({ ...signalBase, presentation: z.literal('puzzle-reward') }),
]);
const markdown = (name: string) => glob({ base: './src/content/' + name, pattern: '*.md' });
export const collections = {
  cases: defineCollection({ loader: markdown('cases'), schema: caseSchema }),
  entities: defineCollection({ loader: markdown('entities'), schema: entitySchema }),
  signals: defineCollection({ loader: markdown('signals'), schema: signalSchema }),
  scripts: defineCollection({ loader: markdown('scripts'), schema: z.strictObject({
    id: key, caseId: key, title: text, kind: z.enum(['script','excerpt','transcript']),
  }) }),
};
