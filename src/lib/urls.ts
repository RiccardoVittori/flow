export function href(path = ''): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
export function absolute(path = ''): string {
  return new URL(href(path), import.meta.env.SITE).href;
}
