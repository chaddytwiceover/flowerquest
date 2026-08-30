import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

test('vercel.json does not contain wildcard CORS headers', () => {
  const vercelJsonPath = join(process.cwd(), 'vercel.json');
  const vercelConfig = JSON.parse(readFileSync(vercelJsonPath, 'utf8'));

  if (!vercelConfig.headers) return;

  for (const headerGroup of vercelConfig.headers) {
    if (!headerGroup.headers) continue;
    for (const header of headerGroup.headers) {
      if (header.key === 'Access-Control-Allow-Origin') {
        assert.notStrictEqual(
          header.value,
          '*',
          'Access-Control-Allow-Origin should not be set to "*"'
        );
      }
      if (header.key === 'Access-Control-Allow-Headers') {
        assert.notStrictEqual(
          header.value,
          '*',
          'Access-Control-Allow-Headers should not be set to "*"'
        );
      }
    }
  }
});
