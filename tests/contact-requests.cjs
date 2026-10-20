// No external services or real messages: validation, links, API and PostgreSQL ACL tests.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { randomUUID } = require('node:crypto');
const { PGlite } = require('@electric-sql/pglite');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { requestSchema, replyLinks, normalizePhone, WEBSITE_SERVICE } = require('../lib/contact-request.ts');
const fixture = { name: 'Entreprise test', email: 'demo@example.com', phone: '+243 838 000 000', service: 'Stratégie digitale', message: 'Message de test fictif.' };
assert.equal(requestSchema.parse({ ...fixture, service: WEBSITE_SERVICE }).service, WEBSITE_SERVICE, 'Website requests must pass server validation');
assert.equal(normalizePhone('0033 6 12 34 56 78'), '+33612345678');
assert.equal(normalizePhone('0838000000'), '');
assert.equal(normalizePhone('+243123?text=hello'), '');
assert.ok(!requestSchema.safeParse({ ...fixture, email: 'x\r\nBcc:injection@example.com' }).success);
assert.ok(!requestSchema.safeParse({ ...fixture, message: '' }).success);
assert.ok(!requestSchema.safeParse({ ...fixture, service: 'unknown' }).success);
assert.ok(!requestSchema.safeParse({ ...fixture, service: 'Candidature – Programme 30 jours' }).success);
const data = requestSchema.parse(fixture);
assert.equal(data.phone, '+243838000000');
assert.ok(replyLinks(data).whatsapp.startsWith('https://wa.me/243838000000?text='));
assert.ok(replyLinks(data).email.startsWith('mailto:demo%40example.com?subject='));
assert.equal(replyLinks({ ...data, phone: 'invalid' }).whatsapp, null);
const admin = '11111111-1111-4111-8111-111111111111', other = '22222222-2222-4222-8222-222222222222';
async function main() {
  const db = await PGlite.create();
  try {
    await db.exec(`create role anon nologin; create role authenticated nologin; create role service_role nologin; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; grant usage on schema auth,public to authenticated,anon,service_role; grant execute on function auth.uid() to authenticated,anon; insert into auth.users values('${admin}'),('${other}');`);
    await db.exec(fs.readFileSync('supabase/migrations/202610060001_freelance.sql', 'utf8'));
    await db.exec(fs.readFileSync('supabase/migrations/202610120001_contact_requests.sql', 'utf8'));
    await db.query('insert into private.admin_users(user_id) values($1)', [admin]);
    const role = async (name, uid = '') => { await db.exec(`reset role; set role ${name}`); await db.query("select set_config('request.jwt.claim.sub',$1,false)", [uid]); };
    const receive = (id, hash = 'a'.repeat(64), ip = 'b'.repeat(64), email = 'c'.repeat(64)) => db.query('select public.receive_contact_request($1,$2,$3,$4,$5) as created', [id, hash, ip, email, data]);
    const id = randomUUID();
    for (const [r, uid] of [['anon',''], ['authenticated', other], ['authenticated', admin]]) {
      await role(r, uid); await assert.rejects(() => receive(id), e => e.code === '42501');
    }
    await role('service_role');
    assert.equal((await receive(id)).rows[0].created, true);
    assert.equal((await receive(id)).rows[0].created, false, 'Idempotent retry');
    await assert.rejects(() => receive(id, 'd'.repeat(64)), e => e.code === '23505');
    await receive(randomUUID()); await receive(randomUUID());
    await assert.rejects(() => receive(randomUUID()), e => e.code === 'P0429', 'Shared persistent email rate limit');
    await role('anon');
    await assert.rejects(() => db.query('select * from contact_requests'), e => e.code === '42501');
    await role('authenticated', other);
    assert.equal((await db.query('select * from contact_requests')).rows.length, 0);
    assert.equal((await db.query("update contact_requests set status='archive' returning id")).rows.length, 0);
    await role('authenticated', admin);
    const rows = (await db.query('select * from contact_requests')).rows;
    assert.equal(rows.length, 3); assert.equal(rows[0].owner_id, admin);
    const version = rows.find(r => r.id === id).updated_at;
    await db.query("update contact_requests set status='contacte',notes='Réponse envoyée par le propriétaire' where id=$1", [id]);
    assert.equal((await db.query("update contact_requests set status='archive' where id=$1 and updated_at=$2 returning id", [id, version])).rows.length, 0);
    await assert.rejects(() => db.query("update contact_requests set status='inventé' where id=$1", [id]), e => e.code === '23514');
    await assert.rejects(() => db.query("update contact_requests set email='changed@example.com' where id=$1", [id]), e => e.code === '42501');
    await assert.rejects(() => db.query('delete from contact_requests'), e => e.code === '42501');
    await assert.rejects(() => db.query('select * from private.contact_request_limits'), e => e.code === '42501');
    console.log('PASS: validation, international WhatsApp links, inbox migration, owner-only reads/updates, immutable visitor content, stale edits, duplicate prevention and durable throttling.');
  } finally { await db.close(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
