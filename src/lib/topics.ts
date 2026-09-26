import { topics } from '../config/taxonomy';
import { articles } from './content';
import { knowledgeEntries } from './knowledge';
import { href } from './urls';

export function topicLabel(topic: string) {
  const label = topic.replaceAll('-', ' ');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export async function topicIndex() {
  const [posts, knowledge] = await Promise.all([
    articles(),
    knowledgeEntries(),
  ]);
  return topics.map((id) => {
    const matchingArticles = posts.filter((entry) =>
      entry.data.topics.includes(id),
    );
    const matchingKnowledge = knowledge.filter((entry) =>
      entry.data.topics.includes(id),
    );
    return {
      id,
      title: topicLabel(id),
      url: href(`argomenti/${id}/`),
      articles: matchingArticles,
      knowledge: matchingKnowledge,
      count: matchingArticles.length + matchingKnowledge.length,
    };
  });
}
