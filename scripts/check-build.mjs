import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { base, site } from '../site.config.mjs';
const root = path.resolve(process.env.CHECK_DIR || 'dist');
const files = fs
  .readdirSync(root, { recursive: true })
  .filter((file) => file.endsWith('.html'));
let checked = 0;
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  assert(
    !html.includes('TEST —') &&
      !html.includes('github_pat_') &&
      !html.includes('ghp_'),
    `Excluded content in ${file}`,
  );
  assert(html.includes('rel="canonical"'), `Canonical absent ${file}`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = new URL(
      match[1].replaceAll('&amp;', '&'),
      new URL(base + file.replaceAll('\\', '/'), site),
    );
    if (url.origin !== new URL(site).origin) continue;
    assert(
      url.pathname.startsWith(base),
      `Wrong base ${url.pathname} from ${file}`,
    );
    const relative = decodeURIComponent(url.pathname.slice(base.length));
    const target = path.join(root, relative);
    assert(fs.existsSync(target), `Missing ${url.pathname} from ${file}`);
    if (
      url.hash &&
      (target.endsWith('.html') || fs.statSync(target).isDirectory())
    ) {
      const targetHtml = fs.readFileSync(
        fs.statSync(target).isDirectory()
          ? path.join(target, 'index.html')
          : target,
        'utf8',
      );
      assert(
        targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `Missing fragment ${url.href}`,
      );
    }
    checked++;
  }
  for (const match of html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/gs,
  ))
    JSON.parse(match[1]);
}
for (const required of [
  'rss.xml',
  'robots.txt',
  'sitemap-index.xml',
  'sitemap-0.xml',
  '404.html',
  'pagefind/pagefind.js',
  'social.jpg',
])
  assert(fs.existsSync(path.join(root, required)), `Missing ${required}`);
assert(!fs.existsSync(path.join(root, 'lab')), 'Showcase in production');
console.log(
  `${files.length} HTML pages; ${checked} local links/assets/fragments verified; metadata, JSON-LD, exclusions and feeds checked.`,
);
