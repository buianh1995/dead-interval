import { satteri } from '@astrojs/markdown-satteri';

function validateLink({url}) {
  if (!url || /[\u0000-\u0020\\]/.test(url) || /^\/\//.test(url) ||
      (/^[a-z][a-z0-9+.-]*:/i.test(url) && !/^(https?:\/\/|mailto:)/i.test(url))) {
    throw new Error('Unsupported URL in archive Markdown: ' + url);
  }
}

export function archiveMarkdown() {
  return satteri({mdastPlugins: [{
    name: 'public-archive-markdown',
    html(node, context) { context.removeNode(node); },
    link: validateLink, image: validateLink, definition: validateLink,
  }]});
}
