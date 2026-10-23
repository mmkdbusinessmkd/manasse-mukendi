const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);

const { SITE_URL, PROFILE_IMAGE, PROFILE_IMAGE_WIDTH, PROFILE_IMAGE_HEIGHT, profileStructuredData } = require('../lib/site-profile.ts');
const sitemap = require('../app/sitemap.ts').default();
const robots = require('../app/robots.ts').default();
const { services, serviceAnchor } = require('../lib/public-services.ts');
const { requestServices } = require('../lib/contact-request.ts');
const graph = profileStructuredData['@graph'];
const person = graph.find(item => item['@type'] === 'Person');
const portrait = graph.find(item => item['@type'] === 'ImageObject');
const page = graph.find(item => item['@type'] === 'ProfilePage');
assert.equal(person.name, 'Manassé Mukendi');
assert.equal(person.image['@id'], portrait['@id']);
assert.equal(page.mainEntity['@id'], person['@id']);
assert.equal(page.primaryImageOfPage['@id'], portrait['@id']);
assert.equal(portrait.contentUrl, `${SITE_URL}${PROFILE_IMAGE}`);
assert.equal(PROFILE_IMAGE, '/images/manasse-mukendi-portrait-2026-10.jpg');
assert.equal(portrait.width, PROFILE_IMAGE_WIDTH);
assert.equal(portrait.height, PROFILE_IMAGE_HEIGHT);
assert.equal(PROFILE_IMAGE_WIDTH, 1254);
assert.equal(PROFILE_IMAGE_HEIGHT, 1254);
assert(!fs.readFileSync('app/globals.css', 'utf8').includes('manasse-portrait-2026.png'));
assert(fs.existsSync(`public${PROFILE_IMAGE}`));
assert.equal(sitemap[0].url, `${SITE_URL}/`);
assert(sitemap[0].images.includes(portrait.contentUrl));
assert.equal(robots.sitemap, `${SITE_URL}/sitemap.xml`);
assert(robots.rules.disallow.includes('/admin'));
assert(!JSON.stringify(profileStructuredData).includes('peter'));
const serviceGraph = graph.filter(item => item['@type'] === 'Service');
assert.equal(serviceGraph.length, services.length);
for (const [number, name, description] of services) {
  const entry = serviceGraph.find(item => item['@id'] === `${SITE_URL}/#${serviceAnchor(number)}`);
  assert.equal(entry.name, name);
  assert.equal(entry.description, description);
  assert.equal(entry.provider['@id'], person['@id']);
  assert(requestServices.includes(name), 'All advertised services can be selected in the contact form');
}
assert(!fs.readFileSync('app/globals.css', 'utf8').includes('fonts.googleapis.com'));
for (const font of ['manrope-latin-variable.woff2', 'manrope-latin-ext-variable.woff2']) {
  const bytes = fs.readFileSync(`public/fonts/${font}`);
  assert.equal(bytes.subarray(0, 4).toString(), 'wOF2');
}
assert(fs.readFileSync('app/page.tsx', 'utf8').includes('<img src={PROFILE_IMAGE}'));
(async () => {
  const config = (await import('../next.config.mjs')).default;
  const headers = await config.headers();
  for (const image of ['/images/peter-ngoyi-portrait.jpg', '/images/peter-ngoyi.png', '/images/manasse-portrait-2026.png', '/images/manasse-consultant.webp', '/images/manasse-marketing.jpg']) {
    assert(headers.some(rule => rule.source === image && rule.headers.some(h => h.key === 'X-Robots-Tag' && h.value === 'noindex')));
  }
  assert(!headers.some(rule => rule.source === '/' || rule.source === PROFILE_IMAGE));
  console.log('PASS: current owner portrait, matching dimensions, Person/ProfilePage identities, canonical image sitemap and legacy/testimonial noindex headers.');
})().catch(error => { console.error(error); process.exitCode = 1; });
