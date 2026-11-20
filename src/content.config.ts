import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { caseSchema, entitySchema, signalSchema, publicScriptSchema } from './lib/content-schema';
const markdown = (name: string) => glob({ base: './src/content/' + name, pattern: '*.md' });
export const collections = {
  cases: defineCollection({ loader: markdown('cases'), schema: caseSchema }),
  entities: defineCollection({ loader: markdown('entities'), schema: entitySchema }),
  signals: defineCollection({ loader: markdown('signals'), schema: signalSchema }),
  scripts: defineCollection({ loader: markdown('scripts'), schema: publicScriptSchema }),
};
