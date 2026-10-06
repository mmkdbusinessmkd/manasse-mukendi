// Run against a local production build WITHOUT Supabase environment configuration.
const assert=require('node:assert/strict');
async function main(){
 const base='http://localhost:3001';
 for(const route of ['/admin','/admin/clients','/admin/paiements/nouveau','/admin/recherche?q=fixture','/admin/calendrier']){
  const r=await fetch(base+route,{redirect:'manual'});
  assert.equal(r.status,307,route);
  assert.equal(new URL(r.headers.get('location'),base).pathname,'/admin/connexion');
  assert.match(r.headers.get('cache-control'),/no-store/);
  assert.match(r.headers.get('x-robots-tag'),/noindex/);
 }
 const login=await fetch(base+'/admin/connexion');
 assert.equal(login.status,200);
 const html=await login.text();
 assert.match(html,/Espace en préparation/);
 assert.match(html,/disabled/);
 if(process.env.ADMIN_EMAIL) assert.ok(!html.includes(process.env.ADMIN_EMAIL),'Owner email must not be exposed');
 assert.ok(!html.includes('/_vercel/insights/script.js'),'No analytics on private pages');
 const publicPage=await fetch(base+'/');
 assert.equal(publicPage.status,200);
 assert.ok(!(await publicPage.text()).includes('href="/admin'),'No public admin navigation');
 console.log('PASS: anonymous routes redirect, no-store/noindex headers, login disabled before setup, no personal email/private analytics, public site accessible.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
