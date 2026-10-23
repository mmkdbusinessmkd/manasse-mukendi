const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);

const { SITE_URL, PROFILE_IMAGE, profileStructuredData } = require('../lib/site-profile.ts');
const sitemap = require('../app/sitemap.ts').default();
const robots = require('../app/robots.ts').default();
const graph = profileStructuredData['@graph'];
const person = graph.find(item => item['@type'] === 'Person');
const portrait = graph.find(item => item['@type'] === 'ImageObject');
const page = graph.find(item => item['@type'] === 'ProfilePage');
assert.equal(person.name, 'Manassé Mukendi');
assert.equal(person.image['@id'], portrait['@id']);
assert.equal(page.mainEntity['@id'], person['@id']);
assert.equal(page.primaryImageOfPage['@id'], portrait['@id']);
assert.equal(portrait.contentUrl, `${SITE_URL}${PROFILE_IMAGE}`);
assert(fs.existsSync(`public${PROFILE_IMAGE}`));
assert.equal(sitemap[0].url, `${SITE_URL}/`);
assert(sitemap[0].images.includes(portrait.contentUrl));
assert.equal(robots.sitemap, `${SITE_URL}/sitemap.xml`);
assert(robots.rules.disallow.includes('/admin'));
assert(!JSON.stringify(profileStructuredData).includes('peter'));
assert(fs.readFileSync('app/page.tsx', 'utf8').includes('<img src={PROFILE_IMAGE}'));
(async () => {
  const config = (await import('../next.config.mjs')).default;
  const headers = await config.headers();
  for (const image of ['/images/peter-ngoyi-portrait.jpg', '/images/peter-ngoyi.png']) {
    assert(headers.some(rule => rule.source === image && rule.headers.some(h => h.key === 'X-Robots-Tag' && h.value === 'noindex')));
  }
  assert(!headers.some(rule => rule.source === '/' || rule.source === PROFILE_IMAGE));
  console.log('PASS: owner portrait, Person/ProfilePage identities, canonical image sitemap and testimonial-only noindex headers.');
})().catch(error => { console.error(error); process.exitCode = 1; });
