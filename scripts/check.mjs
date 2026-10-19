#!/usr/bin/env node
// Pre-deploy checks for the static site in site/. No dependencies.
//
// Errors (block the deploy):
//   - Legal/personal placeholders still present (TODO_NOMBRE, TODO_NIF, ...).
//   - Broken internal links or anchors.
//   - Pages without lang, <title>, exactly one <h1>, or images without alt.
// Warnings (reported, do not block unless --strict):
//   - Store/checkout placeholders (TODO_TIENDA, TODO_*_ID, TODO_*_CHECKOUT).
//   - <!-- TODO: ... --> reminders in the HTML.
//
// Usage: node scripts/check.mjs [--strict]

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const STRICT = process.argv.includes('--strict');
const CI = process.env.GITHUB_ACTIONS === 'true';

// Required before going live: the privacy policy and terms are not valid without them.
const BLOCKING = ['TODO_NOMBRE', 'TODO_NIF', 'TODO_DIRECCION', 'TODO_EMAIL', 'TODO_USUARIO', 'TODO_REPO'];

const errors = [];
const warnings = [];

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

function report(list, file, line, message) {
  list.push({ file: relative(join(ROOT, '..'), file).replaceAll('\\', '/'), line, message });
}

function resolveTarget(file, url) {
  let target = join(dirname(file), decodeURI(url));
  if (url === '' || url.endsWith('/') || url === '.') target = join(target, 'index.html');
  return target;
}

const files = walk(ROOT).filter((f) => /\.(html|css)$/.test(f));
const htmlCache = new Map();
const read = (f) => {
  if (!htmlCache.has(f)) htmlCache.set(f, readFileSync(f, 'utf8'));
  return htmlCache.get(f);
};

for (const file of files) {
  const text = read(file);

  for (const m of text.matchAll(/TODO_[A-Z0-9_]+/g)) {
    const blocking = BLOCKING.includes(m[0]);
    report(blocking ? errors : warnings, file, lineOf(text, m.index), `Placeholder ${m[0]} sin rellenar`);
  }

  if (!file.endsWith('.html')) continue;

  for (const m of text.matchAll(/<!--\s*TODO:?\s*([\s\S]*?)-->/g)) {
    report(warnings, file, lineOf(text, m.index), `Pendiente: ${m[1].trim()}`);
  }

  if (!/<html[^>]*\slang="[a-z]{2}"/.test(text)) report(errors, file, 1, 'Falta el atributo lang en <html>');
  if (!/<title>[^<]+<\/title>/.test(text)) report(errors, file, 1, 'Falta <title>');
  const h1 = (text.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) report(errors, file, 1, `Debe haber exactamente un <h1> (hay ${h1})`);
  for (const m of text.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(m[0])) report(errors, file, lineOf(text, m.index), '<img> sin atributo alt');
  }

  // 404.html is served from any URL, so its links are absolute to the repo path.
  if (file.endsWith('404.html')) continue;

  for (const m of text.matchAll(/(?:href|src)="([^"]*)"/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:)/.test(raw)) continue;
    const [url, anchor] = raw.split('#');
    const target = url === '' ? file : resolveTarget(file, url);
    if (!existsSync(target)) {
      report(errors, file, lineOf(text, m.index), `Enlace roto: ${raw}`);
      continue;
    }
    if (anchor && target.endsWith('.html') && !read(target).includes(`id="${anchor}"`)) {
      report(errors, file, lineOf(text, m.index), `Ancla inexistente: ${raw}`);
    }
  }
}

function print(list, level) {
  for (const { file, line, message } of list) {
    if (CI) console.log(`::${level} file=${file},line=${line}::${message}`);
    else console.log(`${level === 'error' ? 'ERROR' : 'AVISO'}  ${file}:${line}  ${message}`);
  }
}

print(errors, 'error');
print(warnings, 'warning');

const pages = files.filter((f) => f.endsWith('.html')).length;
console.log(`\n${pages} páginas revisadas · ${errors.length} errores · ${warnings.length} avisos`);

if (errors.length || (STRICT && warnings.length)) {
  console.log(errors.length ? 'No se puede publicar: corrige los errores.' : 'Modo --strict: hay avisos pendientes.');
  process.exit(1);
}
console.log('Listo para publicar.');
