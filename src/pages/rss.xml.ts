import rss from '@astrojs/rss';
import { articles } from '../lib/content';
import { absolute } from '../lib/urls';
export async function GET() {
  return rss({
    title: 'Il taccuino FLOW',
    description:
      'Natura, conoscenza, esplorazione. Le pagine del progetto FLOW.',
    site: absolute(),
    items: (await articles()).map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedDate,
      link: absolute(`taccuino/${entry.data.slug}/`),
    })),
    customData: '<language>it</language>',
  });
}
