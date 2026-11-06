const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const { portfolioFilters, isProjectVisible, matchesProjectFilter, projectService } = require('../lib/portfolio-navigation.ts');
const { requestServices, WEBSITE_SERVICE } = require('../lib/contact-request.ts');
const projects = [
  { type: 'Site & application web', website: 'https://esengotech.com/' },
  { type: 'Social Media' }, { type: 'Social Media' }, { type: 'Social Media' },
  { type: 'Social Media' }, { type: 'Publicité' }, { type: 'Stratégie digitale' }, { type: 'Communication' },
];
assert.equal(projects.filter((p, i) => isProjectVisible(p, i, 'selection', false)).length, 4);
assert.equal(projects.filter((p, i) => isProjectVisible(p, i, 'selection', true)).length, projects.length);
assert.equal(projects.filter((p, i) => isProjectVisible(p, i, 'social', false)).length, 4);
assert.equal(projects.filter(p => matchesProjectFilter(p, 'web')).length, 1);
assert.equal(projects.filter(p => matchesProjectFilter(p, 'strategy')).length, 1);
assert.equal(projectService(projects[0]), WEBSITE_SERVICE);
for (const p of projects) assert(requestServices.includes(projectService(p)), 'A similar-project CTA must select an existing service');
assert.equal(new Set(portfolioFilters.map(f => f.id)).size, portfolioFilters.length);
const page = fs.readFileSync('app/page.tsx', 'utf8');
assert(page.includes('aria-pressed={projectFilter === filter.id}'));
assert(page.includes('threshold: 0, rootMargin: "0px 0px -24px 0px"'), 'Tall mobile sections must not disappear after expansion');
assert(page.includes('setRequestedService(projectService(selectedProject))'));
const form = fs.readFileSync('app/components/ContactForm.tsx', 'utf8');
assert(form.includes('aria-label="Étapes de votre demande"'));
assert(form.includes('receipt ? 3 : draft ? 2 : 1'), 'Confirmation is reached only after a server receipt');
assert(form.includes('control.focus()'), 'Validation directs the visitor to the incorrect field');
assert(form.includes('onClick={send}'), 'Review must not submit automatically');
const hero = fs.readFileSync('app/components/HomeHero.tsx', 'utf8');
assert(hero.includes('src={PROFILE_IMAGE} alt={PROFILE_IMAGE_ALT}'), 'Use the real owner photo already used in SEO');
assert(hero.includes('aria-hidden="true"'), 'The decorative globe does not replace the portrait identity');
assert(!hero.includes('350+') && !hero.includes('Award-Winning'), 'Do not copy invented awards or reviews from the reference');
console.log('PASS: four featured projects, category filtering, service preselection, tall-section visibility, review steps and validation focus.');
