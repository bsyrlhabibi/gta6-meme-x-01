// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry itself is a post on X; this program's only job is to hand the
// house that post's address. It copies POST.json from the repository root
// (the bot directory) into the output directory, byte for byte, so the gate
// can read it there and look the post up on X.
//
// Run it the way the grader does:
//
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Outside the grader's container, MAKEFUN_BOT_DIR stands in for /bot and
// MAKEFUN_OUTPUT_DIR for /output. The program touches nothing else: no
// network, no clock, no state — the copy is plain bytes, so two runs of it
// write exactly the same output.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

if (!existsSync(source)) {
  console.error(`error: POST.json not found in the bot directory (${source})`);
  process.exit(1);
}

// Fail loudly here, not at the gate: POST.json must be a small JSON object
// carrying the post's address in a "url" string. Anything else is refused
// by the house unread, so there is no point copying it over.
const raw = readFileSync(source, 'utf8');
if (Buffer.byteLength(raw) > 16384) {
  console.error('error: POST.json is over the 16384-byte limit the gate reads');
  process.exit(1);
}
let post: unknown;
try {
  post = JSON.parse(raw);
} catch {
  console.error('error: POST.json is not valid JSON');
  process.exit(1);
}
if (typeof post !== 'object' || post === null || typeof (post as { url?: unknown }).url !== 'string') {
  console.error('error: POST.json must be a JSON object with a "url" string naming the post on X');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`error: could not copy POST.json to ${target}: ${(err as Error).message}`);
  process.exit(1);
}
