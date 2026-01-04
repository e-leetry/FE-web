#!/usr/bin/env node

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: run-with-env <command> [args...]');
  process.exit(1);
}

const envFile = process.env.ENV_FILE || '.env.local';
const envPath = path.resolve(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
  const envRaw = fs.readFileSync(envPath, 'utf8');
  envRaw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }
    const sanitized = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
    const eqIndex = sanitized.indexOf('=');
    if (eqIndex === -1) {
      return;
    }
    const key = sanitized.slice(0, eqIndex).trim();
    let value = sanitized.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  });
}

const child = spawn(args[0], args.slice(1), {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
