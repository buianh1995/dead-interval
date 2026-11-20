import { archiveMarkdown } from '../../lib/markdown.mjs';

const renderer = archiveMarkdown().createRenderer({});
export async function renderMarkdown(body:string) {
  return (await (await renderer).render(body)).code;
}
