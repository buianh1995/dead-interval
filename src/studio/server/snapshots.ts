import { randomBytes } from 'node:crypto';
import { StudioError } from './session';
import type { Snapshot } from '../model';

type Preview = {owner:string; snapshot:Snapshot; expires:number};
const devState = globalThis as typeof globalThis & { deadIntervalStudioPreviews?: Map<string, Preview> };
const items = devState.deadIntervalStudioPreviews ??= new Map();
export function createSnapshot(owner: string, snapshot: Snapshot) {
  const now = Date.now();
  for (const [id,item] of items) if (item.expires <= now) items.delete(id);
  const previous = [...items].filter(([,item]) => item.owner === owner);
  for (const [id] of previous.slice(0, Math.max(0, previous.length - 2))) items.delete(id);
  const id = randomBytes(18).toString('hex');
  items.set(id,{owner,snapshot,expires:now + 5 * 60 * 1000});
  return id;
}
export function getSnapshot(owner:string,id:string) {
  const item = items.get(id);
  if (!item || item.owner !== owner || item.expires <= Date.now()) {
    throw new StudioError(404, 'Bản xem trước không còn khả dụng.');
  }
  return item.snapshot;
}
