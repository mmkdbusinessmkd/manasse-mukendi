// Local tests only: in-memory PostgreSQL, no Supabase account or customer data.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const {PGlite}=require('@electric-sql/pglite');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const model=require('../lib/admin/model.ts');
assert.equal(model.cents('400,50'),40050);
assert.equal(model.cents('0.01'),1);
assert.ok(Number.isNaN(model.cents('1e3')));
assert.ok(Number.isNaN(model.cents('4.005')));
assert.ok(!model.date.safeParse('2026-02-30').success);
assert.ok(model.date.safeParse('2028-02-29').success);
assert.equal(model.today(new Date('2026-10-06T23:30:00Z')),'2026-10-07');
assert.equal(model.weekEnd('2026-10-06'),'2026-10-11');
assert.equal(model.weekEnd('2026-10-11'),'2026-10-11');
const admin='11111111-1111-4111-8111-111111111111';
const other='22222222-2222-4222-8222-222222222222';
const client='33333333-3333-4333-8333-333333333333';
const client2='44444444-4444-4444-8444-444444444444';
const mission='55555555-5555-4555-8555-555555555555';
const task='66666666-6666-4666-8666-666666666666';
const delivery='77777777-7777-4777-8777-777777777777';
const note='88888888-8888-4888-8888-888888888888';
const p1='99999999-9999-4999-8999-999999999991',p2='99999999-9999-4999-8999-999999999992';
assert.ok(!model.schemas.deliverables.safeParse({client_id:client,mission_id:mission,title:'Test',planned_on:'',delivered_on:'',status:'livre',url:'javascript:alert(1)'}).success);
assert.ok(!model.schemas.clients.safeParse({name:'Test',status:'actif',start_date:'2026-10-10',end_date:'2026-10-01'}).success);
async function main(){
 const db=await PGlite.create();
 try {
  await db.exec(`create role anon nologin; create role authenticated nologin; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; grant usage on schema auth,public to authenticated,anon; grant execute on function auth.uid() to authenticated,anon; insert into auth.users values('${admin}'),('${other}');`);
  await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations/202610060001_freelance.sql'),'utf8'));
  await db.query('insert into private.admin_users(user_id) values($1)',[admin]);
  await assert.rejects(()=>db.query('insert into private.admin_users(user_id) values($1)',[other]));
  async function role(name,uid=''){await db.exec(`reset role; set role ${name}`);await db.query("select set_config('request.jwt.claim.sub',$1,false)",[uid]);}
  await role('authenticated',admin);
  assert.equal((await db.query('select public.is_admin() as allowed')).rows[0].allowed,true);
  await db.query('insert into clients(id,owner_id,name) values($1,$2,$3),($4,$2,$5)',[client,admin,'Client test A',client2,'Client test B']);
  await db.query("insert into missions(id,owner_id,client_id,title,amount_cents,currency,due_date) values($1,$2,$3,'Mission test',40000,'USD','2026-10-01')",[mission,admin,client]);
  await db.query("insert into payments(id,owner_id,client_id,mission_id,amount_cents,currency,paid_on) values($1,$2,$3,$4,15000,'USD','2026-10-02'),($5,$2,$3,$4,10000,'USD','2026-10-03')",[p1,admin,client,mission,p2]);
  const m=(await db.query('select *, due_date::text as due_date from missions')).rows[0];
  const ps=(await db.query('select * from payments')).rows;
  assert.deepEqual(model.missionBalance(m,ps,'2026-10-06'),{paid:25000,remaining:15000,status:'retard'});
  assert.match(model.groupedMoney([{currency:'USD',amount:40000},{currency:'EUR',amount:10000}]),/400.*100/s);
  await assert.rejects(()=>db.query("insert into payments(owner_id,client_id,mission_id,amount_cents,currency,paid_on) values($1,$2,$3,15001,'USD','2026-10-04')",[admin,client,mission]),e=>e.code==='23514');
  await assert.rejects(()=>db.query('update missions set amount_cents=24000 where id=$1',[mission]),e=>e.code==='23514');
  await assert.rejects(()=>db.query("update payments set currency='EUR' where id=$1",[p1]),e=>e.code==='23514');
  await assert.rejects(()=>db.query("insert into payments(owner_id,client_id,mission_id,amount_cents,currency,paid_on) values($1,$2,$3,100,'EUR','2026-10-04')",[admin,client,mission]),e=>e.code==='23503');
  await db.query("insert into tasks(id,owner_id,client_id,mission_id,title) values($1,$2,$3,$4,'Tâche test')",[task,admin,client,mission]);
  await assert.rejects(()=>db.query('update tasks set client_id=$1 where id=$2',[client2,task]),e=>e.code==='23503');
  await db.query("insert into deliverables(id,owner_id,client_id,mission_id,title) values($1,$2,$3,$4,'Livrable test')",[delivery,admin,client,mission]);
  await assert.rejects(()=>db.query("update deliverables set status='livre' where id=$1",[delivery]),e=>e.code==='23514');
  await db.query("update deliverables set status='livre',delivered_on='2026-10-06' where id=$1",[delivery]);
  await db.query("insert into notes(id,owner_id,client_id,mission_id,title,body) values($1,$2,$3,$4,'Note test','Exclusivement fictive')",[note,admin,client,mission]);
  await assert.rejects(()=>db.query('delete from clients where id=$1',[client]),e=>['23503','23001'].includes(e.code));
  await assert.rejects(()=>db.query('delete from missions where id=$1',[mission]),e=>['23503','23001'].includes(e.code));
  const before=(await db.query('select updated_at from clients where id=$1',[client])).rows[0].updated_at;
  await db.query("update clients set company='Entreprise test' where id=$1",[client]);
  const changed=(await db.query("update clients set name='Stale' where id=$1 and updated_at=$2 returning id",[client,before])).rows;
  assert.equal(changed.length,0,'Optimistic concurrency must reject stale updates');
  await assert.rejects(()=>db.query('update clients set owner_id=$1 where id=$2',[other,client]),e=>e.code==='23514');
  await assert.rejects(()=>db.query('select * from private.admin_users'),e=>e.code==='42501');
  await role('authenticated',other);
  assert.equal((await db.query('select public.is_admin() as allowed')).rows[0].allowed,false);
  for(const table of model.entities){
   assert.equal((await db.query(`select * from ${table}`)).rows.length,0,`${table}: other user cannot read`);
   assert.equal((await db.query(`delete from ${table} returning id`)).rows.length,0,`${table}: other user cannot delete`);
   assert.equal((await db.query(`update ${table} set updated_at=now() returning id`)).rows.length,0,`${table}: other user cannot update`);
  }
  await assert.rejects(()=>db.query("insert into clients(owner_id,name) values($1,'Intrusion')",[other]),e=>e.code==='42501');
  await assert.rejects(()=>db.query('insert into private.admin_users(user_id) values($1)',[other]),e=>e.code==='42501');
  await role('anon');
  for(const table of model.entities)await assert.rejects(()=>db.query(`select * from ${table}`),e=>e.code==='42501');
  await assert.rejects(()=>db.query('select public.is_admin()'),e=>e.code==='42501');
  await role('authenticated',admin);
  await db.query('delete from payments where id=$1',[p2]);
  assert.equal(model.missionBalance(m,(await db.query('select * from payments')).rows).remaining,25000);
  for(const table of ['notes','deliverables','tasks','payments','missions','clients'])await db.query(`delete from ${table}`);
  console.log('PASS: local PostgreSQL migration, single-owner RLS, anonymous access denied, foreign keys, balances, overpayment protection, stale edits, CRUD and model validation.');
 } finally {await db.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
