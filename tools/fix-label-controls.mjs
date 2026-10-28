// Links every <label> to the control directly below it (adds for= / id=) so forms are accessible.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const CONTROL = /^\s*<(input|textarea|select)\b/;
const LABEL = /^(\s*)<label\b([^>]*)>(.*?)<\/label>\s*$/;
const BLOCK_OPEN = /^\s*(?:\}\s*)?@(?:if|for|else|switch|case|default|empty|defer|placeholder|loading|error)\b.*\{\s*$/;

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (entry === 'node_modules' || entry === 'dist') continue;
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (path.endsWith('.html')) yield path;
  }
}

const slug = (text) =>
  text
    .replace(/\{\{.*?\}\}/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'field';

/** The control's opening tag may span several lines; returns [startLine, endLine]. */
function tagRange(lines, start) {
  let end = start;
  while (end < lines.length && !lines[end].includes('>')) end++;
  return [start, end];
}

let fixed = 0;
const skipped = [];

for (const file of htmlFiles(process.argv[2] ?? 'libs')) {
  const raw = readFileSync(file, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const lines = raw.split(/\r?\n/);
  const component = basename(file).replace(/\.component\.html$|\.html$/, '');
  const used = new Set([...raw.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  const stack = [];
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*\}/.test(line)) stack.pop();
    if (BLOCK_OPEN.test(line)) stack.push(/@for\b/.test(line) ? 'for' : 'other');

    const label = LABEL.exec(line);
    if (!label || /\sfor=|\[for\]|\[attr\.for\]/.test(label[2]) || !CONTROL.test(lines[i + 1] ?? '')) continue;

    if (stack.includes('for')) {
      skipped.push(`${file}:${i + 1} (inside @for — give it a unique id by hand)`);
      continue;
    }

    const [from, to] = tagRange(lines, i + 1);
    const tagText = lines.slice(from, to + 1).join(' ');
    let id = /\sid="([^"]+)"/.exec(tagText)?.[1];

    if (!id) {
      const base = `${component}-${slug(label[3])}`;
      id = base;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
      used.add(id);
      lines[from] = lines[from].replace(CONTROL, (m) => `${m} id="${id}"`);
    }

    lines[i] = line.replace('<label', `<label for="${id}"`);
    fixed++;
    changed = true;
  }

  if (changed) writeFileSync(file, lines.join(eol));
}

console.log(`Linked ${fixed} labels to their controls.`);
if (skipped.length) console.log(`Skipped ${skipped.length}:\n${skipped.join('\n')}`);