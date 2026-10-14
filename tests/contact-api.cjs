const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const validation = require('../lib/contact-request.ts');
let rpcResult = { data: true, error: null }, calls = 0, alerts = 0;
const context = { exports: {}, process: { env: { SUPABASE_URL: 'https://test.invalid', SUPABASE_SECRET_KEY: 'test-only-not-a-key', VERCEL: '1' } }, URL, TextDecoder, AbortSignal, fetch, require: name => {
  if (name === 'next/server') return { NextResponse: { json: (body, init) => ({ body, ...init }) }, after: () => { alerts++; } };
  if (name === '@supabase/supabase-js') return { createClient: () => ({ rpc: async () => { calls++; return rpcResult; } }) };
  if (name.includes('contact-request')) return validation;
  return require(name);
} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/api/contact/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
const data = { name: 'Test entreprise', email: 'test@example.com', phone: '+243838000000', service: 'Stratégie digitale', message: 'Demande fictive.' };
const payload = { id: '11111111-1111-4111-8111-111111111111', data };
function request(body = payload, origin = 'https://www.manasse-mukendi.com') {
  return new Request('http://internal:3000/api/contact', { method: 'POST', headers: { origin, host: 'www.manasse-mukendi.com', 'content-type': 'application/json', 'x-vercel-forwarded-for': '192.0.2.1' }, body: JSON.stringify(body) });
}
(async () => {
  const send = context.exports.POST;
  assert.equal((await send(request(payload, 'https://attacker.invalid'))).status, 403);
  assert.equal((await send(request({ ...payload, data: { ...data, phone: '' } }))).status, 400);
  assert.equal((await send(request({ ...payload, honey: 'spam' }))).status, 400);
  assert.equal(calls, 0);
  assert.equal((await send(request())).status, 201);
  assert.equal(alerts, 1);
  rpcResult = { data: false, error: null };
  assert.equal((await send(request())).status, 200);
  assert.equal(alerts, 1);
  for (const [code, status] of [['P0429', 429], ['23505', 409], ['unavailable', 503]]) {
    rpcResult = { data: null, error: { code } };
    const result = await send(request());
    assert.equal(result.status, status); assert.notEqual(result.body.success, true);
  }
  console.log('PASS: proxy origin, validation, spam rejection, confirmed storage, idempotency, throttling and failure responses.');
})().catch(e => { console.error(e); process.exitCode = 1; });
