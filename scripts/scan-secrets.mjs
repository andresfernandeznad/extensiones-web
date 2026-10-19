#!/usr/bin/env node
// Blocks secrets and sensitive data from entering the repository. No dependencies.
//
// Usage:
//   node scripts/scan-secrets.mjs            Scan every tracked file (CI).
//   node scripts/scan-secrets.mjs --staged   Scan staged changes (pre-commit hook).
//   node scripts/scan-secrets.mjs --history  Scan every commit in the history.
//
// False positive? Add "secret-scan:ignore" on the same line, and explain why in the commit.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const MODE = process.argv.includes('--staged') ? 'staged' : process.argv.includes('--history') ? 'history' : 'tracked';
const CI = process.env.GITHUB_ACTIONS === 'true';
const SELF = 'scripts/scan-secrets.mjs';

// Files that must never be committed, whatever they contain.
const FORBIDDEN_FILES = [
  [/(^|\/)\.env(\.(?!example$)[^/]+)?$/, 'Archivo .env'],
  [/\.(pem|key|p12|pfx|jks|keystore)$/i, 'Clave privada o certificado (incluida la .pem de firma de la extensión)'],
  [/(^|\/)id_(rsa|dsa|ecdsa|ed25519)(\.pub)?$/, 'Clave SSH'],
  [/\.crx$/i, 'Paquete firmado de extensión'],
  [/(^|\/)(credentials|secrets?)(\.[a-z]+)?$/i, 'Archivo de credenciales'],
];

// Content that must never be committed anywhere.
const SECRETS = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'Clave privada'],
  [/\bgh[pousr]_[A-Za-z0-9]{36,}\b/, 'Token de GitHub'],
  [/\bgithub_pat_[A-Za-z0-9_]{22,}\b/, 'Token de GitHub'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'Clave de AWS'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Clave de API de Google'],
  [/\b[sr]k_(live|test)_[A-Za-z0-9]{16,}\b/, 'Clave de Stripe'],
  [/\bxox[abposr]-[A-Za-z0-9-]{10,}/, 'Token de Slack'],
  [/\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, 'JWT (las API keys de Lemon Squeezy lo son)'],
  [/\b(api[_-]?key|secret|password|passwd|token|client[_-]?secret)\b\s*[:=]\s*["'][^"'\s]{12,}["']/i, 'Credencial asignada en el código'],
  [/\bES\d{2}[ ]?(\d{4}[ ]?){5}\b/, 'IBAN'],
  [/\b(?:\d{4}[ -]?){3}\d{4}\b/, 'Posible número de tarjeta'],
];

// Personal identifiers: allowed only inside site/, where the law requires them (LSSI-CE, GDPR art. 13).
const PERSONAL = [
  [/\b\d{8}[A-HJ-NP-TV-Z]\b/, 'DNI/NIF'],
  [/\b[XYZ]\d{7}[A-HJ-NP-TV-Z]\b/, 'NIE'],
];

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
process.chdir(git('rev-parse', '--show-toplevel').trim());

function sources() {
  if (MODE === 'staged') {
    return git('diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z')
      .split('\0').filter(Boolean)
      .map((path) => ({ path, label: path, read: () => git('show', `:${path}`) }));
  }
  if (MODE === 'history') {
    return git('rev-list', '--all').split('\n').filter(Boolean).flatMap((commit) =>
      git('ls-tree', '-r', '--name-only', '-z', commit).split('\0').filter(Boolean)
        .map((path) => ({ path, label: `${commit.slice(0, 7)}:${path}`, read: () => git('show', `${commit}:${path}`) })),
    );
  }
  return git('ls-files', '-z').split('\0').filter(Boolean)
    .map((path) => ({ path, label: path, read: () => readFileSync(path, 'utf8') }));
}

const findings = [];
const seen = new Set();

for (const { path, label, read } of sources()) {
  for (const [re, what] of FORBIDDEN_FILES) {
    if (re.test(path)) findings.push({ label, line: 1, what });
  }
  if (path === SELF || /\.(png|jpe?g|gif|webp|ico|woff2?)$/i.test(path)) continue;

  let text;
  try { text = read(); } catch { continue; }
  const key = `${path}\0${text.length}\0${text.slice(0, 64)}`;
  if (MODE === 'history' && seen.has(key)) continue;
  seen.add(key);

  const rules = path.startsWith('site/') ? SECRETS : [...SECRETS, ...PERSONAL];
  text.split('\n').forEach((line, i) => {
    if (line.includes('secret-scan:ignore')) return;
    for (const [re, what] of rules) {
      if (re.test(line)) findings.push({ label, line: i + 1, what });
    }
  });
}

for (const { label, line, what } of findings) {
  if (CI) console.log(`::error file=${label},line=${line}::${what}`);
  else console.log(`BLOQUEADO  ${label}:${line}  ${what}`);
}

if (findings.length) {
  console.log(`\n${findings.length} posible(s) secreto(s) o dato(s) sensible(s). No se permite el commit.`);
  console.log('Si es una clave real: retírala, revócala y genera otra. Ver docs/seguridad.md.');
  process.exit(1);
}
console.log(`Sin secretos ni datos sensibles (${MODE}).`);
