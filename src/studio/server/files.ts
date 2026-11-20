import { createHash, randomUUID } from 'node:crypto';
import { lstat, mkdir, open, readFile, readdir, realpath, rename, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseDocument } from 'yaml';
import type { ZodType } from 'astro/zod';
import type { CollectionEntry } from 'astro:content';
import { caseSchema, entitySchema, publicScriptSchema, signalSchema } from '../../lib/content-schema';
import { validateArchive } from '../../lib/archive';
import { StudioError } from './session';
import type { Collection } from '../model';

const workspace = await realpath(process.cwd());
const samePath = (a:string,b:string) => process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
const missing = (e:unknown) => (e as NodeJS.ErrnoException).code === 'ENOENT';
async function safePath(parts:string[], createParent = false) {
  for (const segment of parts) {
    if (!/^(?:\.?[a-zA-Z0-9][a-zA-Z0-9._-]*)$/.test(segment) || segment.endsWith('.') ||
        /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(segment)) {
      throw new StudioError(400,'Đường dẫn không hợp lệ.');
    }
  }
  let current = workspace;
  for (const [index, segment] of parts.entries()) {
    current = join(current, segment);
    const parent = index < parts.length - 1;
    try {
      const stat = await lstat(current);
      if (stat.isSymbolicLink() || !samePath(await realpath(current),current) ||
          (parent ? !stat.isDirectory() : !stat.isFile())) throw new StudioError(400,'Đường dẫn không an toàn.');
    } catch (error) {
      if (!missing(error)) throw error;
      if (parent && createParent) {
        try { await mkdir(current); } catch (e) { if ((e as NodeJS.ErrnoException).code !== 'EEXIST') throw e; }
        if ((await lstat(current)).isSymbolicLink() || !samePath(await realpath(current),current)) {
          throw new StudioError(400,'Thư mục không an toàn.');
        }
      } else if (parent) return resolve(workspace,...parts);
    }
  }
  return current;
}
export async function readSafe(parts:string[]) {
  const filename = await safePath(parts);
  try {
    const bytes = await readFile(filename);
    return {text:new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes),
      revision:createHash('sha256').update(bytes).digest('hex')};
  } catch(error) {
    if (missing(error)) return {text:null,revision:null};
    throw error;
  }
}

export function parseFile(text:string,schema:ZodType,label:string) {
  const match = text.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new StudioError(422,label + ': thiếu frontmatter hợp lệ.');
  const document = parseDocument(match[1]);
  if (document.errors.length) throw new StudioError(422,label + ': ' + document.errors[0].message);
  const result = schema.safeParse(document.toJS({ maxAliasCount: 0 }));
  if (!result.success) {
    const errors = result.error.issues.map(issue => issue.path.join('.') + ' ' + issue.message);
    throw new StudioError(422, label + ': ' + errors.join('\n'));
  }
  return { data: result.data, body: match[2] };
}
const schemas = {cases:caseSchema, entities:entitySchema, signals:signalSchema, scripts:publicScriptSchema};
type Group = keyof typeof schemas;
async function readGroup<K extends Group>(group:K) {
  const marker = await safePath(['src','content',group,'.gitkeep']);
  const directory = resolve(marker,'..');
  const entries = await readdir(directory,{withFileTypes:true});
  return Promise.all(entries.filter(entry => entry.name.endsWith('.md')).map(async entry => {
    const parts = ['src','content',group,entry.name];
    const {text,revision} = await readSafe(parts);
    if (text === null || revision === null) throw new StudioError(409,'Tệp đã thay đổi khi đọc.');
    const record = parseFile(text,schemas[group],entry.name);
    const parsed = {...record,id:entry.name.slice(0,-3),collection:group};
    return {entry:parsed as CollectionEntry<K>, parts,revision};
  }));
}
export async function readArchive() {
  const [cases,entities,signals,scripts] = await Promise.all([
    readGroup('cases'),readGroup('entities'),readGroup('signals'),readGroup('scripts'),
  ]);
  const files = {cases,entities,signals,scripts};
  const archive = validateArchive({cases:cases.map(x=>x.entry),entities:entities.map(x=>x.entry),
    signals:signals.map(x=>x.entry),scripts:scripts.map(x=>x.entry)});
  return {files,archive};
}
export const draftPath = (group:Collection,id:string) => ['.studio','drafts',group,id+'.json'];

const devWrites = globalThis as typeof globalThis & { deadIntervalStudioPending?: Promise<void> };
export function serializeWrite<T>(task:()=>Promise<T>) {
  const result = (devWrites.deadIntervalStudioPending ?? Promise.resolve()).then(task);
  devWrites.deadIntervalStudioPending = result.then(()=>undefined,()=>undefined);
  return result;
}
export async function writeSafe(parts:string[], text:string, revision:string|null) {
  const target = await safePath(parts,true);
  const temporaryParts = [...parts.slice(0,-1), randomUUID()+'.studio-tmp'];
  const temporary = await safePath(temporaryParts);
  const handle = await open(temporary,'wx',0o600);
  try {
    try { await handle.writeFile(text,'utf8'); await handle.sync(); }
    finally { await handle.close(); }
    if ((await readSafe(parts)).revision !== revision) throw new StudioError(409,'Tệp đã thay đổi. Hãy tải bản mới và đối chiếu nội dung.');
    await rename(temporary,target);
    return (await readSafe(parts)).revision;
  } finally {
    try { await unlink(temporary); } catch(e) { if (!missing(e)) console.warn('Studio: không dọn được tệp tạm.'); }
  }
}
export function markdownFile(data:object,body:string) {
  const header = Object.entries(data).map(([key,value])=>key+': '+JSON.stringify(value)).join('\n');
  const markdown = body.trim() ? (body.endsWith('\n') ? body : body + '\n') : '';
  return '---\n' + header + '\n---\n' + markdown;
}
