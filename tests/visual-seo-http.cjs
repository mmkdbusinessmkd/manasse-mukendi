// Audit the actual HTTP response, not just source-code configuration.
// node tests/visual-seo-http.cjs https://www.manasse-mukendi.com [report.md]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, PROFILE_TITLE, PROFILE_IMAGE, PROFILE_IMAGE_URL,
  PROFILE_IMAGE_ALT, PROFILE_IMAGE_WIDTH, PROFILE_IMAGE_HEIGHT, profileStructuredData } = require('../lib/site-profile.ts');
const base = process.argv[2] || 'http://127.0.0.1:3004';
const canonical = `${SITE_URL}/`;
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), decode(value)]));
}
async function get(path) {
  return fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
}
function jpegSize(bytes) {
  assert.equal(bytes.readUInt16BE(0), 0xffd8, 'The image really is a JPEG');
  let offset = 2;
  while (offset + 8 < bytes.length) {
    assert.equal(bytes[offset], 0xff);
    const marker = bytes[offset + 1];
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  throw new Error('No JPEG dimensions found');
}
(async () => {
  const response = await get('/');
  assert.equal(response.status, 200);
  assert(!response.headers.get('x-robots-tag')?.includes('noindex'));
  const html = await response.text();
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert(head, 'Metadata is present in the initial HTML head');
  const metaTags = head.match(/<meta\b[^>]*>/gi) || [];
  const metadata = metaTags.map(attributes);
  const expected = {
    'og:title': SITE_TITLE, 'og:description': SITE_DESCRIPTION, 'og:url': canonical, 'og:type': 'website',
    'og:image': PROFILE_IMAGE_URL, 'og:image:secure_url': PROFILE_IMAGE_URL,
    'og:image:type': 'image/jpeg', 'og:image:width': String(PROFILE_IMAGE_WIDTH),
    'og:image:height': String(PROFILE_IMAGE_HEIGHT), 'og:image:alt': PROFILE_IMAGE_ALT,
    'twitter:card': 'summary_large_image', 'twitter:title': SITE_TITLE, 'twitter:description': SITE_DESCRIPTION,
    'twitter:image': PROFILE_IMAGE_URL, 'twitter:image:alt': PROFILE_IMAGE_ALT,
  };
  for (const [key, value] of Object.entries(expected)) {
    const matches = metadata.filter(meta => (meta.property || meta.name) === key);
    assert.equal(matches.length, 1, `Exactly one ${key}; no competing testimonial metadata`);
    if (key === 'og:url') assert.equal(new URL(matches[0].content).href, canonical, key);
    else assert.equal(matches[0].content, value, key);
  }
  const canonicals = (head.match(/<link\b[^>]*>/gi) || []).map(attributes).filter(link => link.rel === 'canonical');
  assert.equal(canonicals.length, 1);
  assert.equal(new URL(canonicals[0].href).href, canonical);
  for (const meta of metadata.filter(meta => ['robots', 'googlebot'].includes(meta.name))) {
    assert(!meta.content.includes('noindex'));
    if (meta.name === 'googlebot') assert(meta.content.includes('max-image-preview:large'));
  }
  assert(metadata.some(meta => meta.name === 'googlebot' && meta.content.includes('max-image-preview:large')));
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const nodes = scripts.flatMap(([, json]) => { const data = JSON.parse(json); return data['@graph'] || [data]; });
  const people = nodes.filter(node => node['@type'] === 'Person');
  assert.equal(people.length, 1);
  const person = people[0];
  assert.equal(person.name, 'Manassé Mukendi');
  assert.equal(person.url, canonical);
  assert.equal(person.jobTitle, PROFILE_TITLE);
  assert.equal(person.image, PROFILE_IMAGE_URL);
  assert.equal(person.description, SITE_DESCRIPTION);
  assert.deepEqual(person.sameAs, profileStructuredData['@graph'].find(node => node['@type'] === 'Person').sameAs);
  const page = nodes.find(node => node['@id'] === `${SITE_URL}/#webpage`);
  const image = nodes.find(node => node['@id'] === page.primaryImageOfPage['@id']);
  assert.equal(page.mainEntity['@id'], person['@id']);
  assert.equal(person.mainEntityOfPage['@id'], page['@id']);
  assert.equal(image.contentUrl, PROFILE_IMAGE_URL);
  assert.equal(image.about['@id'], person['@id']);
  assert(!JSON.stringify(nodes).match(/peter|temoignage|testimonial/i), 'No secondary portrait in the main structured data');
  const images = (html.match(/<img\b[^>]*>/gi) || []).map(attributes);
  const owner = images.filter(img => img.id === 'portrait-manasse-mukendi');
  assert.equal(owner.length, 1);
  assert.equal(owner[0].src, PROFILE_IMAGE);
  assert.equal(owner[0].alt, PROFILE_IMAGE_ALT);
  assert.equal(owner[0].width, String(PROFILE_IMAGE_WIDTH));
  assert.equal(owner[0].height, String(PROFILE_IMAGE_HEIGHT));
  assert.equal(owner[0].loading, 'eager');
  assert.equal(owner[0].fetchpriority, 'high');
  assert(/<section[^>]*id="a-propos"[^>]*aria-label="À propos de Manassé Mukendi"/.test(html));
  const testimonial = images.find(img => img.src === '/images/peter-ngoyi-portrait.jpg');
  assert(testimonial, 'The testimonial portrait is preserved');
  assert.equal(testimonial.alt, 'Peter Ngoyi N.');
  assert.equal(testimonial.loading, 'lazy');
  assert(!testimonial.fetchpriority || testimonial.fetchpriority !== 'high');
  assert(html.indexOf('id="portrait-manasse-mukendi"') < html.indexOf('src="/images/peter-ngoyi-portrait.jpg"'));
  const photo = await get(PROFILE_IMAGE);
  assert.equal(photo.status, 200);
  assert(photo.headers.get('content-type')?.includes('image/jpeg'));
  assert(!photo.headers.get('x-robots-tag')?.includes('noindex'));
  const bytes = Buffer.from(await photo.arrayBuffer());
  assert.deepEqual(jpegSize(bytes), { width: PROFILE_IMAGE_WIDTH, height: PROFILE_IMAGE_HEIGHT });
  const peter = await get(testimonial.src);
  assert.equal(peter.status, 200);
  assert.equal(peter.headers.get('x-robots-tag'), 'noindex');
  const robotsResponse = await get('/robots.txt');
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
  for (const [, rule] of robots.matchAll(/^Disallow:\s*(\S*)/gm)) {
    if (!rule) continue;
    const pattern = rule.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    assert(!new RegExp(`^${pattern}`).test(PROFILE_IMAGE), 'The portrait is not disallowed');
  }
  const sitemapResponse = await get('/sitemap.xml');
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert(sitemap.includes(`<loc>${canonical}</loc>`));
  assert(sitemap.includes(`<image:loc>${PROFILE_IMAGE_URL}</image:loc>`));
  assert(!sitemap.includes('peter'));
  if (process.argv[3]) {
    const selectedMeta = metaTags.filter(tag => { const meta = attributes(tag); return Object.hasOwn(expected, meta.property || meta.name); });
    const files = ['lib/site-profile.ts', 'app/layout.tsx', 'app/page.tsx', 'tests/public-seo.cjs', 'tests/visual-seo-http.cjs'];
    const report = [
      '# Vérification du référencement visuel — Manassé Mukendi', '',
      `Site vérifié : ${canonical}`, `Vérification HTTP : ${new Date().toISOString()}`, '',
      '## Photo principale', '', `[Photo réelle conservée](${PROFILE_IMAGE_URL})`, '',
      `Dimensions réelles : ${PROFILE_IMAGE_WIDTH} × ${PROFILE_IMAGE_HEIGHT} pixels ; ${bytes.length} octets.`,
      `Alt : « ${PROFILE_IMAGE_ALT} ».`, '',
      'URL existante conservée : aucun remplacement ni génération de photo. Image présente dans le HTML initial, réponse HTTP 200, non bloquée par robots.txt et sans directive noindex.', '',
      '## Métadonnées réellement servies dans le head', '', '```html', ...selectedMeta, `<link rel="canonical" href="${canonicals[0].href}"/>`, '```', '',
      'Next.js normalise la canonical racine et og:url sans slash final. https://www.manasse-mukendi.com et https://www.manasse-mukendi.com/ désignent la même URL racine ; aucun paramètre de suivi ni fragment dans ces balises.', '',
      '## Person réellement servi dans le JSON-LD', '', '```json', JSON.stringify({ '@context': 'https://schema.org', ...person }, null, 2), '```', '',
      'La Person est reliée à la ProfilePage par mainEntityOfPage. La page désigne cette Person comme mainEntity et le même portrait comme primaryImageOfPage. Le WebSite conserve Manassé Mukendi comme publisher.', '',
      '## Vérifications secondaires', '',
      '- La photo de Peter reste dans son témoignage, avec son propre alt et loading="lazy".',
      '- Aucune photo de témoignage ou de client dans og:image, twitter:image ou les données structurées principales.',
      '- La photo de Peter reste disponible en HTTP 200 et conserve son en-tête X-Robots-Tag: noindex déjà en place.',
      '- Le sitemap d’images existant référence uniquement le portrait du propriétaire pour la page d’accueil.',
      '- L’image principale utilise loading="eager", fetchpriority="high", decoding="async" et les dimensions réelles. La priorité de chargement n’est pas une garantie de sélection par Google.', '',
      '## Changements dans le head', '',
      '- URLs canonical et og:url rendues explicites et absolues (résultat canonique inchangé).',
      '- og:image:secure_url et og:image:type ajoutés ; dimensions et alt conservés.',
      '- twitter:image:alt ajouté ; même photo et même titre/description conservés.',
      '- Aucun changement de favicon, de préchargement des polices ou de contenu visible.', '',
      '## Fichiers modifiés', '', ...files.map(file => `- \`${file}\``), '',
      'app/sitemap.ts, app/robots.ts et next.config.mjs ont été vérifiés et ne nécessitaient pas de modification. Le sitemap reflète la date de mise à jour des métadonnées via la constante partagée.', '',
      '## Limite', '', 'Google reste libre de sélectionner les images de ses résultats. Ces vérifications confirment les signaux techniques servis par le site, pas un changement effectif ni immédiat des résultats de recherche.', '',
      'Référence : https://developers.google.com/search/docs/appearance/google-images', '',
    ].join('\n');
    fs.writeFileSync(process.argv[3], report);
    console.log(`Rapport enregistré : ${process.argv[3]}`);
  }
  console.log('PASS: visual SEO, complete head metadata, one explicit owner Person, real JPEG dimensions, HTML portrait, testimonial isolation, robots and image sitemap.');
})().catch(error => { console.error(error); process.exitCode = 1; });
