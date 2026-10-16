const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const page = fs.readFileSync('app/page.tsx', 'utf8');
const strategy = fs.readFileSync('lib/snel-strategy.ts', 'utf8').replace('export const', 'const');
const data = page.slice(page.indexOf('const projects:'), page.indexOf('const certifications'));
const script = ts.transpileModule(`${strategy}\n${data}\nJSON.stringify(projects);`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;
const projects = JSON.parse(vm.runInNewContext(script));
assert.equal(projects.length, 10, 'Preserve all projects');
assert.deepEqual(projects.slice(0, 4).map(p => p.client), ['ZOOM TECH', 'EVANTURA', 'SAFIA BELLA', 'IMMO KONNECT']);
assert.equal(projects.filter(p => p.client === 'SNEL SA').length, 2);
assert(projects.slice(-2).every(p => p.client === 'SNEL SA'), 'Keep both SNEL projects at the end');
assert.deepEqual(projects.slice(-2).map(p => p.image), ['/images/projects/snel-strategie-couverture.webp', '/images/projects/snel-fete-travail.jpg']);
assert(projects.every(p => p.image && fs.existsSync(`public${p.image}`)), 'Original images must exist for all projects');
assert(!page.includes('AnonymousProjectCover'), 'Restore actual visuals in listing and modal');
assert(/projects\.slice\(0,\s*4\)/.test(page), 'Keep four projects initially visible');
console.log('Public portfolio: original SNEL visuals last, Immo Konnect featured, four initial projects verified.');
