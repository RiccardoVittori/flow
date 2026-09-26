import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const privatePath = /(^|\/)(curriculum|immagini-reali)(\/|$)/i;
const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);
assert(
  !tracked.some((file) => privatePath.test(file)),
  'Private sources tracked or staged',
);
for (const directory of ['public', process.env.CHECK_DIR || 'dist']) {
  const files = fs
    .readdirSync(directory, { recursive: true })
    .filter((file) => fs.statSync(path.join(directory, file)).isFile());
  for (const file of files) {
    assert(
      !privatePath.test(file.replaceAll('\\', '/')),
      'Private source directory in public artifact',
    );
    assert(
      !/curriculum|\bcv\b/i.test(file),
      'Possible private CV in public artifact',
    );
    assert(
      !/\.pdf$/i.test(file),
      'PDF publication requires an explicit provenance review',
    );
  }
}
console.log(
  'Private directories absent from Git index and public artifact; no public PDF.',
);
