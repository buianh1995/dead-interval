import { z } from 'astro/zod';

export const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100);
export const collections = z.enum(['cases','entities','scripts']);
export type Collection = z.infer<typeof collections>;
const markdown = z.string().max(120_000);
const title = z.string().max(500);
export const excerptSchema = z.strictObject({title, kind:z.enum(['excerpt','script','transcript']), bodyMarkdown:markdown});
const scene = z.strictObject({
  id:idSchema, heading:title, objective:markdown.optional(), narrationMarkdown:markdown,
  dialogue:z.array(z.strictObject({speaker:title,line:markdown})).optional(),
  performanceNotes:markdown.optional(), soundNotes:markdown.optional(), authorNotes:markdown.optional(),
});
const scriptBase = {schemaVersion:z.literal(1), id:idSchema, caseId:idSchema, workingTitle:title,
  updatedAt:z.iso.datetime(), authorNotes:markdown.optional(), excerptCandidate:excerptSchema.optional()};
export const scriptDraftSchema = z.discriminatedUnion('format',[
  z.strictObject({...scriptBase,format:z.literal('markdown'),bodyMarkdown:markdown}),
  z.strictObject({...scriptBase,format:z.literal('scenes'),scenes:z.array(scene).min(1)}),
]);
export type ScriptDraft = z.infer<typeof scriptDraftSchema>;
export const snapshotSchema = z.strictObject({
  collection:collections, id:idSchema, fields:z.record(z.string(),z.unknown()),
  bodyMarkdown:markdown, fullPreview:z.boolean().default(false), excerpt:excerptSchema.optional(),
});
export type Snapshot = z.infer<typeof snapshotSchema>;
const revision = z.string().regex(/^[a-f0-9]{64}$/).nullable();
export const saveSchema = z.strictObject({
  intent:z.enum(['saveDraft','applyRecord','publishExcerpt']),
  revision, draftRevision:revision.optional(), publicScriptRevision:revision.optional(),
  snapshot:snapshotSchema, scriptDraft:scriptDraftSchema.optional(),
});
