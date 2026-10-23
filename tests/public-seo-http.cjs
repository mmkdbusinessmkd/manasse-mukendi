// Run against a built preview: node tests/public-seo-http.cjs http://127.0.0.1:3004
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://127.0.0.1:3004';
async function get(path) {
  return fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
}
(async () => {
  const response = await get('/');
  assert.equal(response.status, 200);
  const html = await response.text();
  const articles = html.match(/<article\b[^>]*class="project case-study"[^>]*>/g) || [];
  assert.equal(articles.length, 11, 'All projects are delivered without a click');
  assert.equal(articles.filter(tag => /\shidden(?:=|\s|>)/.test(tag)).length, 7, 'Only four cards start visible');
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(json, 'Structured data is server-rendered');
  const graph = JSON.parse(json[1])['@graph'];
  const services = graph.filter(node => node['@type'] === 'Service');
  assert.equal(services.length, 6);
  for (const service of services) {
    const id = new URL(service.url).hash.slice(1);
    assert(html.includes(`id="${id}"`), 'Service identifiers resolve to visible service disclosures');
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.equal(new URL(canonical[1]).href, 'https://www.manasse-mukendi.com/');
  assert(html.includes('href="/fonts/manrope-latin-variable.woff2"'));
  const font = await get('/fonts/manrope-latin-variable.woff2');
  assert.equal(font.status, 200);
  assert.equal(Buffer.from(await font.arrayBuffer()).subarray(0, 4).toString(), 'wOF2');
  const admin = await get('/admin/connexion');
  const adminHtml = await admin.text();
  assert(/name="robots" content="[^"]*noindex/.test(adminHtml), 'The private login stays excluded');
  const missing = await get('/verification-seo-page-inexistante');
  assert.equal(missing.status, 404, 'Unknown paths must not return a soft 404');
  console.log('PASS: served HTML, 11 crawlable project cards / 4 visible, 6 service entities, canonical, local font, private noindex and true 404.');
})().catch(error => { console.error(error); process.exitCode = 1; });
