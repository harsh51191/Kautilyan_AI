#!/usr/bin/env node
/**
 * Invoke Vercel-style API handlers locally (used by serve.py).
 * Usage: node scripts/invoke-api.js <path> <method> [querystring]
 * Request body on stdin (JSON for POST).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function loadEnvFile() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const ROUTES = {
  '/api/submit-assessment': '../api/submit-assessment.js',
  '/api/get-report': '../api/get-report.js',
};

function readStdin() {
  return new Promise(function (resolve) {
    const chunks = [];
    process.stdin.on('data', function (c) {
      chunks.push(c);
    });
    process.stdin.on('end', function () {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    if (process.stdin.isTTY) resolve('');
  });
}

function parseQuery(qs) {
  const out = {};
  if (!qs) return out;
  const params = new URLSearchParams(qs.startsWith('?') ? qs.slice(1) : qs);
  params.forEach(function (value, key) {
    if (out[key] === undefined) out[key] = value;
    else if (Array.isArray(out[key])) out[key].push(value);
    else out[key] = [out[key], value];
  });
  return out;
}

function createMockRes() {
  const state = { statusCode: 200, headers: {}, body: '' };
  return {
    statusCode: 200,
    status: function (code) {
      state.statusCode = code;
      this.statusCode = code;
      return this;
    },
    setHeader: function (name, value) {
      state.headers[name] = value;
    },
    end: function (data) {
      state.body = data == null ? '' : String(data);
    },
    getState: function () {
      return state;
    },
  };
}

async function main() {
  loadEnvFile();

  const apiPath = process.argv[2] || '';
  const method = (process.argv[3] || 'GET').toUpperCase();
  const queryString = process.argv[4] || '';
  const rel = ROUTES[apiPath];

  if (!rel) {
    process.stdout.write(
      JSON.stringify({ status: 404, headers: {}, body: JSON.stringify({ error: 'Not found' }) })
    );
    process.exit(0);
    return;
  }

  const handlerPath = path.join(__dirname, rel);
  const handlerMod = require(handlerPath);
  const handler = handlerMod.default || handlerMod;

  const rawBody = await readStdin();
  let body = rawBody;
  if (rawBody && method === 'POST') {
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      body = rawBody;
    }
  }

  const req = {
    method: method,
    url: apiPath + (queryString ? '?' + queryString.replace(/^\?/, '') : ''),
    headers: { 'content-type': 'application/json' },
    body: body,
    query: parseQuery(queryString),
  };

  const res = createMockRes();

  try {
    await handler(req, res);
  } catch (err) {
    console.error('[invoke-api]', err);
    res.status(500);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message || 'Handler error' }));
  }

  const state = res.getState();
  process.stdout.write(
    JSON.stringify({
      status: state.statusCode,
      headers: state.headers,
      body: state.body,
    })
  );
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
