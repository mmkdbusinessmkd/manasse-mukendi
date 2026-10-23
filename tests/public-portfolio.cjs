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
assert.equal(projects.length, 11, 'Add Esengo Tech while preserving all projects');
assert.deepEqual(projects.slice(0, 4).map(p => p.client), ['ESENGO TECH', 'ZOOM TECH', 'EVANTURA', 'SAFIA BELLA']);
assert(projects.some(p => p.client === 'IMMO KONNECT'), 'Keep Immo Konnect in the expanded portfolio');
const esengo = projects[0];
assert.equal(esengo.website, 'https://esengotech.com/');
assert(esengo.mobileImage && fs.existsSync(`public${esengo.mobileImage}`), 'Keep a real mobile screenshot alongside the desktop preview');
assert(fs.existsSync('public/images/projects/laptop-smartphone-mockup.jpg'));
assert.equal(esengo.deliverables.length, 2, 'Show both the shop and the private management workspace');
assert(!esengo.measured, 'Do not imply measured commercial results');
assert(!/codex-clipboard|admin\/dashboard/i.test(JSON.stringify(esengo)), 'Never link private dashboard screenshots');
assert(page.includes('["Esengo Tech", "/images/logos/esengo-tech.png"]'));
assert(fs.existsSync('public/images/logos/esengo-tech.png'));
assert(page.includes('rel="noopener noreferrer"'), 'External case-study link opens safely');
assert.equal(projects.filter(p => p.client === 'SNEL SA').length, 2);
assert(projects.slice(-2).every(p => p.client === 'SNEL SA'), 'Keep both SNEL projects at the end');
assert.deepEqual(projects.slice(-2).map(p => p.image), ['/images/projects/snel-strategie-couverture.webp', '/images/projects/snel-fete-travail.jpg']);
assert(projects.every(p => p.image && fs.existsSync(`public${p.image}`)), 'Original images must exist for all projects');
assert(!page.includes('AnonymousProjectCover'), 'Restore actual visuals in listing and modal');
assert(page.includes('hidden={!showAllProjects && i >= 4}'), 'Keep four projects initially visible while serving all project content');
console.log('Public portfolio: Esengo Tech featured, partner logo, private data excluded, all existing projects preserved.');
