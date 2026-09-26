import { getCollection } from 'astro:content';
import { articles, visible } from './content';

export async function readingPaths() {
  const [paths, posts] = await Promise.all([
    getCollection('paths'),
    articles(),
  ]);
  return paths
    .filter((entry) => visible(entry))
    .map((entry) => {
      const ids = entry.data.stops.map((stop) => stop.article.id);
      if (new Set(ids).size !== ids.length)
        throw new Error(`Tappa duplicata: ${entry.id}`);
      const stops = entry.data.stops.map((stop) => {
        const article = posts.find((post) => post.id === stop.article.id);
        if (!article)
          throw new Error(`Tappa non pubblicabile: ${stop.article.id}`);
        return { article, question: stop.question };
      });
      return {
        entry,
        stops,
        minutes: stops.reduce(
          (sum, stop) => sum + stop.article.data.readingTime,
          0,
        ),
      };
    });
}
