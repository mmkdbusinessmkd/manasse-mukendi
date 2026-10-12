// Public-copy regression checks. No network, contact submission or deployment.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      fileName: filename,
    });
    module._compile(outputText, filename);
  };
}
require.extensions['.css'] = module => { module.exports = {}; };
const config = require('../lib/pilot-program.ts');
assert.equal(config.SHOW_PILOT_PROGRAM, false, 'Copy refresh must not reopen the campaign');
const html = renderToStaticMarkup(React.createElement(require('../app/page.tsx').default));
const tags = [...html.matchAll(/<section\b[^>]*>/g)].map(match => match[0]);
assert.equal(tags.length, 8);
assert.deepEqual(tags.map(tag => tag.match(/id="([^"]+)"/)?.[1]).filter(Boolean),
  ['accueil', 'a-propos', 'services', 'realisations', 'temoignages', 'contact']);
const plain = html.replace(/<[^>]*>/g, '');
assert.ok(plain.includes('La communication qui déplace les marques.'));
assert.ok(plain.includes('Votre entreprise a du savoir-faire. Faisons-le savoir.'));
assert.ok(plain.includes('Social Media Manager et consultant'));
assert.ok(!plain.includes('basé à Kinshasa'));
assert.equal((html.match(/class="service-disclosure"/g) || []).length, 5);
assert.equal((html.match(/class="project case-study"/g) || []).length, 4);
for (const name of ['ZOOM TECH', 'EVANTURA', 'SNEL SA', 'SAFIA BELLA']) assert.ok(plain.includes(name));
assert.match(html, /href="#realisations">Voir mes réalisations/);
assert.match(html, /href="#contact">Parlons de votre projet/);
assert.equal((html.match(/<form\b/g) || []).length, 1);
const phone = [...html.matchAll(/<input\b[^>]*>/g)].map(match => match[0]).find(tag => tag.includes('name="phone"'));
assert.ok(phone && phone.includes('required=""') && phone.includes('type="tel"'), 'Phone stays required');
assert.ok(plain.includes('J’ai besoin de conseils pour choisir'));
assert.ok(!html.includes('href="/admin'));
assert.match(html, /class="partner-track"/);
assert.ok(plain.includes('Il sait combiner simplicité, créativité, rapidité et efficacité quand vous travaillez avec lui dans des projets.'));
const meta = fs.readFileSync(require('node:path').join(__dirname, '../app/layout.tsx'), 'utf8');
assert.ok(meta.includes('Manassé Mukendi / Marketing et Communication Digitale'));
console.log('PASS: business-led copy, preserved section order, four featured projects, five services, contact flow, testimonial, campaign state and SEO title.');
