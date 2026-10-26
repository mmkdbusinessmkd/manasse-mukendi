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
  assert.equal((html.match(/<details class="case-details case-summary"/g) || []).length, 11, 'Project explanations are native disclosures, available without running JavaScript');
  assert.equal((html.match(/<dl class="service-scope"/g) || []).length, 6, 'Service deliverables are server-rendered');
  assert(html.includes('Visiter la boutique en ligne'), 'The delivered website has a real, crawlable link outside the JavaScript-only modal');
  assert(html.includes('<a class="case-public-link" href="https://esengotech.com/"'));
  assert(html.includes('gestion des réseaux sociaux'));
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(json, 'Structured data is server-rendered');
  const graph = JSON.parse(json[1])['@graph'];
  const portraitPath = '/images/manasse-mukendi-portrait-2026-10.jpg';
  const portraitUrl = `https://www.manasse-mukendi.com${portraitPath}`;
  const portrait = graph.find(node => node['@type'] === 'ImageObject');
  assert.equal(portrait.contentUrl, portraitUrl);
  assert.equal(portrait.width, 1254);
  assert.equal(portrait.height, 1254);
  for (const field of ['property="og:image"', 'name="twitter:image"']) {
    assert(html.includes(`${field} content="${portraitUrl}"`), 'Link previews use the current owner photo');
  }
  assert(html.includes(`src="${portraitPath}"`), 'The visible portrait matches the search image');
  const photo = await get(portraitPath);
  assert.equal(photo.status, 200);
  assert(photo.headers.get('content-type').includes('image/jpeg'));
  assert(!photo.headers.get('x-robots-tag')?.includes('noindex'));
  const oldPhoto = await get('/images/manasse-portrait-2026.png');
  assert.equal(oldPhoto.headers.get('x-robots-tag'), 'noindex');
  assert((await (await get('/sitemap.xml')).text()).includes(portraitUrl));
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
