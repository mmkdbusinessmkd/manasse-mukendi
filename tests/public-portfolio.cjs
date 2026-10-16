const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const page = fs.readFileSync('app/page.tsx', 'utf8');
const strategy = fs.readFileSync('lib/snel-strategy.ts', 'utf8').replace('export const', 'const');
const data = page.slice(page.indexOf('const projects:'), page.indexOf('function AnonymousProjectCover'));
const script = ts.transpileModule(`${strategy}\n${data}\nJSON.stringify(projects);`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;
const projects = JSON.parse(vm.runInNewContext(script));
assert.equal(projects.length, 10, 'Preserve all projects');
assert.deepEqual(projects.slice(0, 4).map(p => p.client), ['ZOOM TECH', 'EVANTURA', 'SAFIA BELLA', 'FLMDA RDC']);
assert.equal(projects.filter(p => p.anonymous).length, 2);
assert(projects.slice(-2).every(p => p.anonymous && p.image === '' && p.confidentiality), 'Anonymous projects must be last, without branded image sources');
assert(!/snel/i.test(JSON.stringify(projects)), 'No identifying name or asset URL in public project data');
assert(!/SNEL/.test(page), 'No visible SNEL mention in the page');
assert(page.includes('p.anonymous ? <AnonymousProjectCover'), 'Use anonymous cover in listing');
assert(page.includes('selectedProject.anonymous ? <AnonymousProjectCover'), 'Use anonymous cover in modal');
assert(/projects\.slice\(0,\s*4\)/.test(page), 'Keep four projects initially visible');
console.log('Public portfolio: ordering, anonymization, covers and initial selection verified.');
