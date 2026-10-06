// Local regression checks; no network request, deployment or PDF publication.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  module._compile(outputText, filename);
};

const { snelStrategy: project } = require('../lib/snel-strategy.ts');
assert.equal(project.client, 'SNEL SA');
assert.equal(project.cover, true);
assert.equal(project.role, 'Conception complète de la stratégie de communication digitale.');
assert.equal(project.resultLabel, 'LIVRABLE STRATÉGIQUE');
assert.ok(!project.measured, 'A strategy must not be presented as measured campaign results.');
assert.match(project.confidentiality, /Seule la couverture/);
assert.ok(!/(https?:|\.pdf|USD|\d|%)/i.test(JSON.stringify(project)), 'No source PDF, external link, internal budget or numerical targets.');
assert.deepEqual(Object.keys(project).sort(), ['name','client','type','sector','context','role','intervention','resultLabel','result','confidentiality','image','cover'].sort());

const asset = path.join(__dirname, '..', 'public', project.image);
const image = fs.readFileSync(asset);
assert.equal(image.toString('ascii', 0, 4), 'RIFF');
assert.equal(image.toString('ascii', 8, 12), 'WEBP');
assert.ok(image.length < 180000, 'The single-page preview should remain lightweight.');

const source = fs.readFileSync(path.join(__dirname, '../app/page.tsx'), 'utf8');
const projectList = source.slice(source.indexOf('const projects: Project[]'), source.indexOf('const contactFields'));
assert.equal((projectList.split('  snelStrategy,')[0].match(/name:/g) || []).length, 2, 'The strategy is the third featured project.');
assert.ok(projectList.indexOf('Fête du travail') > projectList.indexOf('Septembre, c’est la rentrée'), 'The earlier SNEL visual stays available after the featured four.');
assert.match(source, /projects\.slice\(0, 4\)/);
assert.match(source, /selectedProject\.role/);
assert.match(source, /selectedProject\.confidentiality/);
assert.match(source, /p\.cover \? " project-document"/);
const about = source.slice(source.indexOf('<section className="about about-short"'), source.indexOf('<section className="services'));
assert.match(about, /Depuis 2024/);
assert.match(about, /Social Media Management/);
assert.match(about, /about-references/);
assert.ok(!/basé à|\[Kinshasa\]/i.test(about));
console.log('PASS: third featured strategy, preserved earlier SNEL visual, approved biography, cover-only WebP, no source PDF or numerical targets.');
