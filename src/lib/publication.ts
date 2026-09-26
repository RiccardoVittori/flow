export const visible = (
  entry: {
    data: { draft: boolean; test: boolean; publishedDate?: Date };
  },
  now = new Date(),
) =>
  !entry.data.draft &&
  !entry.data.test &&
  (!entry.data.publishedDate || entry.data.publishedDate <= now);
