import { getCollection, type CollectionEntry } from 'astro:content';
export const visible = (entry: {
  data: { draft: boolean; test: boolean; publishedDate?: Date };
}) =>
  !entry.data.draft &&
  !entry.data.test &&
  (!entry.data.publishedDate || entry.data.publishedDate <= new Date());
export async function articles() {
  const entries = (await getCollection('articles'))
    .filter(visible)
    .sort(
      (a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf(),
    );
  const slugs = entries.map((entry) => entry.data.slug);
  if (new Set(slugs).size !== slugs.length)
    throw new Error('Slug articolo duplicato');
  return entries;
}
export async function related(entry: CollectionEntry<'articles'>) {
  const all = await articles();
  return all
    .filter((other) => other.id !== entry.id)
    .map((other) => ({
      entry: other,
      score:
        other.data.topics.filter((topic) => entry.data.topics.includes(topic))
          .length +
        (entry.data.relatedContent.some(
          (ref) => ref.collection === 'articles' && ref.id === other.id,
        )
          ? 100
          : 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.entry);
}
