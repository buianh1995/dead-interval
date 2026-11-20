import type { APIContext } from 'astro';
import { z } from 'astro/zod';
import { snapshotSchema } from '../model';
import { listRecords, loadRecord, parseTarget, projectSnapshot, saveRecord } from '../server/records';
import { renderMarkdown } from '../server/rendering';
import { privateHeaders, readMutation, session, StudioError } from '../server/session';
import { createSnapshot } from '../server/snapshots';

export const prerender = false;
const json = (data:unknown,status=200) => Response.json(data,{status,headers:privateHeaders});
function failure(e:unknown) {
  if (e instanceof StudioError) return json({error:e.message},e.status);
  if (e instanceof z.ZodError) return json({error:e.issues.map(issue=>issue.path.join('.')+' '+issue.message).join('\n')},422);
  const systemError=(e as NodeJS.ErrnoException).code;
  if (systemError) return json({error:'Không thể đọc hoặc ghi tệp. Hãy kiểm tra quyền và khóa tệp, rồi thử lại.'},503);
  return json({error:e instanceof Error ? e.message : 'Lỗi Studio.'},422);
}
export async function GET(ctx:APIContext) {
  try {
    session(ctx);
    if (!ctx.url.pathname.startsWith('/studio/api/records')) return json({error:'Phương thức không hỗ trợ.'},405);
    if (!ctx.params.collection) return json(await listRecords());
    const {collection,id}=parseTarget(ctx.params.collection,ctx.params.id);
    return json(await loadRecord(collection,id));
  } catch (e) { return failure(e); }
}
export async function POST(ctx:APIContext) {
  try {
    const {id,nonce}=session(ctx);
    const data=await readMutation(ctx,nonce);
    if (ctx.url.pathname==='/studio/api/save/') return json(await saveRecord(data));
    if (ctx.url.pathname!=='/studio/api/preview/') return json({error:'Phương thức không hỗ trợ.'},405);
    const snapshot=snapshotSchema.parse(data);
    const projected=await projectSnapshot(snapshot);
    await renderMarkdown(projected.body);
    if (projected.kind==='case' && projected.script) await renderMarkdown(projected.script.bodyMarkdown);
    return json({url:'/studio/preview/'+createSnapshot(id,snapshot)+'/'});
  } catch(e) { return failure(e); }
}
