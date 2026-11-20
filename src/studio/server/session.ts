import { randomBytes } from 'node:crypto';
import type { APIContext } from 'astro';

export const origin = 'http://127.0.0.1:4322';
type Session = {nonce: string; expires: number};
// Astro reloads its dev modules when the editor writes public content.
const devState = globalThis as typeof globalThis & { deadIntervalStudioSessions?: Map<string, Session> };
const sessions = devState.deadIntervalStudioSessions ??= new Map();
const cookie = 'dead_interval_studio';
export class StudioError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export const privateHeaders = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
};
export function checkLocal(ctx: Pick<APIContext,'url'|'request'>) {
  if (!import.meta.env.DEV || process.env.DEAD_INTERVAL_STUDIO !== '1' ||
      ctx.url.origin !== origin || ctx.request.headers.get('host') !== '127.0.0.1:4322') {
    throw new StudioError(404, 'Studio không khả dụng.');
  }
}
export function session(ctx: Pick<APIContext,'url'|'request'|'cookies'>, create = false) {
  checkLocal(ctx);
  const now = Date.now();
  for (const [id,state] of sessions) if (state.expires <= now) sessions.delete(id);
  const existing = ctx.cookies.get(cookie)?.value;
  if (existing) {
    const state = sessions.get(existing);
    if (state) return {id: existing, nonce: state.nonce};
  }
  if (!create) throw new StudioError(403, 'Phiên Studio đã hết hạn. Hãy tải lại trang.');
  if (sessions.size >= 32) throw new StudioError(429, 'Có quá nhiều phiên Studio.');
  const id = randomBytes(24).toString('hex');
  const nonce = randomBytes(24).toString('hex');
  sessions.set(id, {nonce, expires: now + 8 * 60 * 60 * 1000});
  ctx.cookies.set(cookie, id, {httpOnly: true, sameSite: 'strict', path: '/studio/'});
  return {id, nonce};
}
export async function readMutation(ctx: APIContext, nonce: string) {
  if (ctx.request.headers.get('origin') !== origin || ctx.request.headers.get('x-studio-token') !== nonce) {
    throw new StudioError(403, 'Yêu cầu ghi không thuộc phiên Studio.');
  }
  if (ctx.request.headers.get('content-type')?.split(';')[0] !== 'application/json') {
    throw new StudioError(415, 'Studio chỉ nhận JSON.');
  }
  const limit = 512 * 1024;
  const reader = ctx.request.body?.getReader();
  if (!reader) throw new StudioError(400, 'Thiếu nội dung.');
  const decoder = new TextDecoder('utf-8',{fatal:true});
  let bytes = 0;
  let text = '';
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw new StudioError(413, 'Nội dung vượt giới hạn 512 KB.');
      }
      text += decoder.decode(chunk.value,{stream:true});
    }
    return JSON.parse(text + decoder.decode()) as unknown;
  } catch (error) {
    if (error instanceof StudioError) throw error;
    throw new StudioError(400, 'JSON hoặc UTF-8 không hợp lệ.');
  } finally {
    reader.releaseLock();
  }
}
