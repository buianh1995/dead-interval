import type { CollectionEntry } from 'astro:content';
import { z } from 'astro/zod';
import { caseSchema, entitySchema, publicScriptSchema } from '../../lib/content-schema';
import { findScript, validateArchive } from '../../lib/archive';
import { collections, idSchema, saveSchema, scriptDraftSchema, type Collection, type Snapshot } from '../model';
import { draftPath, markdownFile, readArchive, readSafe, serializeWrite, writeSafe } from './files';
import { renderMarkdown } from './rendering';
import { StudioError } from './session';

const sharedFields = {title:z.string().max(500).optional(), summary:z.string().max(4000).optional(),
  seoTitle:z.string().max(500).optional(), seoDescription:z.string().max(4000).optional(), seoIndexable:z.boolean().optional()};
const strings = z.array(z.string().max(2000)).max(100);
const caseFields = z.strictObject({...sharedFields, closingQuestion:z.string().max(2000).optional(),
  embargoMessage:z.string().max(2000).optional(), topics:strings.optional(),
  entityIds:z.array(idSchema).max(100).optional(), signalIds:z.array(idSchema).max(100).optional()});
const entityFields = z.strictObject({...sharedFields, designation:z.string().max(2000).optional(),
  observations:strings.optional(), publicObservation:z.string().max(4000).optional()});

export async function listRecords() {
  const {archive} = await readArchive();
  return {
    cases:archive.cases.map(({data})=>({id:data.id,slug:data.slug,title:data.title,state:data.state})),
    entities:archive.entities.map(({data})=>({id:data.id,slug:data.slug,title:data.title,state:data.visibility})),
    signals:archive.signals.filter(({data})=>data.presentation==='standard').map(({data})=>({id:data.id,caseId:data.caseId,title:data.title})),
  };
}
export async function loadRecord(group:Collection,id:string) {
  const {files,archive} = await readArchive();
  const source = (group==='scripts' ? files.cases : files[group]).find(file=>file.entry.data.id===id);
  if (!source) throw new StudioError(404,'Không tìm thấy hồ sơ.');
  const draft = await readSafe(draftPath(group,id));
  const published = group==='scripts' ? files.scripts.find(file=>file.entry.data.caseId===id) : undefined;
  return {data:source.entry.data,body:source.entry.body??'',revision:source.revision,
    sourceFile:source.entry.id, publicScriptFile:published?.entry.id,
    draft:draft.text ? JSON.parse(draft.text) as unknown : null, draftRevision:draft.revision,
    publicScript:published ? {...published.entry.data, bodyMarkdown:published.entry.body} : null,
    publicScriptRevision:published?.revision??null,
    caseTitle:archive.cases.find(({data})=>data.id===id)?.data.title};
}
export async function projectSnapshot(snapshot:Snapshot) {
  const {files,archive} = await readArchive();
  if (snapshot.collection==='scripts') {
    if (Object.keys(snapshot.fields).length) throw new StudioError(422,'Kịch bản không nhận trường hồ sơ.');
    const source = files.cases.find(file=>file.entry.data.id===snapshot.id);
    if (!source) throw new StudioError(404,'Không tìm thấy hồ sơ.');
    const original = source.entry.data;
    // Public-facing SEALED metadata stays intact in the live preview.
    const selected = snapshot.fullPreview && original.state==='sealed' ? openCase(original) : original;
    const excerpt = snapshot.excerpt;
    const published = original.state==='released' ? findScript(archive.scripts,original) : undefined;
    return {kind:'case' as const, source, item:selected, archive,
      body:snapshot.fullPreview ? snapshot.bodyMarkdown : (source.entry.body??''),
      script:excerpt?.bodyMarkdown.trim() ? excerpt : !snapshot.fullPreview && published ?
        {title:published.data.title,bodyMarkdown:published.body??''} : undefined};
  }
  if (snapshot.collection==='cases') {
    const source=files.cases.find(file=>file.entry.data.id===snapshot.id);
    if (!source) throw new StudioError(404,'Không tìm thấy hồ sơ.');
    const original=source.entry.data;
    const {seoTitle,seoDescription,seoIndexable,...fields}=caseFields.parse(snapshot.fields);
    const patch={...fields,seo:{...original.seo,title:seoTitle??original.seo.title,
      description:seoDescription??original.seo.description,indexable:seoIndexable??original.seo.indexable}};
    const item=caseSchema.parse({...original,...patch});
    validateArchive({...archive,cases:archive.cases.map(entry=>entry.data.id===item.id
      ? {...entry,data:item} : entry)});
    const selected=snapshot.fullPreview && item.state==='sealed' ? openCase(item) : item;
    const existing=item.state==='released' ? findScript(archive.scripts,item) : undefined;
    return {kind:'case' as const, source, item:selected, archive, body:selected.state==='sealed' ? '' : snapshot.bodyMarkdown,
      script:existing ? {title:existing.data.title,bodyMarkdown:existing.body??''} : undefined};
  }
  const source=files.entities.find(file=>file.entry.data.id===snapshot.id);
  if (!source) throw new StudioError(404,'Không tìm thấy thực thể.');
  const original=source.entry.data;
  const {seoTitle,seoDescription,seoIndexable,...fields}=entityFields.parse(snapshot.fields);
  const item=entitySchema.parse({...original,...fields,seo:{...original.seo,title:seoTitle??original.seo.title,
    description:seoDescription??original.seo.description,indexable:seoIndexable??original.seo.indexable}});
  if (item.visibility==='redacted' && item.seo.indexable) throw new StudioError(422,'Thực thể bị che yêu cầu noindex.');
  if (snapshot.fullPreview && item.visibility==='redacted') {
    const {publicObservation,...base}=item;
    return {kind:'entity' as const,source,archive,item:entitySchema.parse({...base,visibility:'public',
      designation:'Local draft',observations:[publicObservation]}),body:snapshot.bodyMarkdown};
  }
  return {kind:'entity' as const,source,archive,item,body:item.visibility==='redacted' ? '' : snapshot.bodyMarkdown};
}

function openCase(item:Extract<CollectionEntry<'cases'>['data'],{state:'sealed'}>) {
  const {embargoMessage,...base}=item;
  return caseSchema.parse({...base,state:'in-development',closingQuestion:embargoMessage});
}

export function parseTarget(collection:string|undefined,id:string|undefined) {
  return {collection:collections.parse(collection),id:idSchema.parse(id)};
}

export async function saveRecord(input:unknown) {
  const command = saveSchema.parse(input);
  return serializeWrite(async ()=>{
    const {snapshot,intent,revision,scriptDraft} = command;
    if (intent==='saveDraft') {
      await loadRecord(snapshot.collection,snapshot.id);
      let data:unknown = snapshot;
      if (snapshot.collection==='scripts') {
        const checked=scriptDraftSchema.parse(scriptDraft);
        data=checked;
        if (checked.caseId!==snapshot.id || checked.id!==snapshot.id) {
          throw new StudioError(422,'Kịch bản phải gắn với đúng hồ sơ.');
        }
      } else if (scriptDraft) throw new StudioError(422,'Dữ liệu bản nháp không hợp lệ.');
      const draftRevision=await writeSafe(draftPath(snapshot.collection,snapshot.id),
        JSON.stringify(data,null,2)+'\n',command.draftRevision??null);
      return {draftRevision};
    }
    if (scriptDraft) throw new StudioError(422,'Chỉ gửi các trường đã chọn để công bố.');
    const projected=await projectSnapshot({...snapshot,fullPreview:false});
    if (projected.source.revision!==revision) throw new StudioError(409,'Tệp đã thay đổi. Hãy tải bản mới và đối chiếu nội dung.');
    if (intent==='publishExcerpt') {
      if (snapshot.collection!=='scripts' || projected.kind!=='case' || projected.item.state!=='released' || !snapshot.excerpt ||
          snapshot.bodyMarkdown.trim()) throw new StudioError(422,'Chỉ được ghi phần đã duyệt của hồ sơ Released.');
      const {archive,item}=projected;
      const existing=findScript(archive.scripts,item);
      const fileId=existing?.id??item.id;
      const {bodyMarkdown,...approved}=snapshot.excerpt;
      const data=publicScriptSchema.parse({id:existing?.data.id??('script-'+item.id),caseId:item.id,...approved});
      await renderMarkdown(bodyMarkdown);
      validateArchive({...archive,scripts:[...archive.scripts.filter(entry=>entry.data.caseId!==item.id),
        {data,id:fileId,collection:'scripts',body:bodyMarkdown}]});
      const publicScriptRevision=await writeSafe(['src','content','scripts',fileId+'.md'],
        markdownFile(data,bodyMarkdown),command.publicScriptRevision??null);
      return {publicScriptRevision};
    }
    if (snapshot.collection==='scripts' || snapshot.excerpt) throw new StudioError(422,'Hãy dùng thao tác ghi trích đoạn.');
    const locked=projected.kind==='case' ? projected.item.state==='sealed' : projected.item.visibility==='redacted';
    if (locked && snapshot.bodyMarkdown.trim()) throw new StudioError(422,'Thân bài nội bộ chỉ được lưu nháp.');
    await renderMarkdown(projected.body);
    if (projected.kind==='case') {
      validateArchive({...projected.archive,cases:projected.archive.cases.map(entry=>entry.data.id===snapshot.id ?
        {...entry,data:projected.item,body:projected.body}:entry)});
    } else {
      validateArchive({...projected.archive,entities:projected.archive.entities.map(entry=>entry.data.id===snapshot.id ?
        {...entry,data:projected.item,body:projected.body}:entry)});
    }
    return {revision:await writeSafe(projected.source.parts,markdownFile(projected.item,projected.body),revision)};
  });
}
