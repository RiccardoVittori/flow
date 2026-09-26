import { getCollection } from 'astro:content';
import { visible } from './content';
import { href } from './urls';
export const knowledgeCollections = [
  'species',
  'glossary',
  'places',
  'books',
  'experiences',
] as const;
export async function knowledgeEntries() {
  return (
    await Promise.all(
      knowledgeCollections.map(async (collection) =>
        (await getCollection(collection)).filter((entry) => visible(entry)),
      ),
    )
  ).flat();
}
export async function relatedKnowledge(
  topics: string[],
  explicit: { collection: string; id: string }[],
) {
  const all = await knowledgeEntries();
  for (const ref of explicit.filter((ref) => ref.collection !== 'articles')) {
    if (
      !all.some(
        (entry) => entry.collection === ref.collection && entry.id === ref.id,
      )
    )
      throw new Error(
        `Relazione non pubblicabile: ${ref.collection}/${ref.id}`,
      );
  }
  return all
    .filter(
      (entry) =>
        explicit.some(
          (ref) => ref.collection === entry.collection && ref.id === entry.id,
        ) || entry.data.topics.some((topic) => topics.includes(topic)),
    )
    .map((entry) => ({
      title: entry.data.title,
      url: href(`atlante/${entry.collection}/${entry.data.slug}/`),
      kind: entry.collection,
    }));
}
