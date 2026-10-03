// Run with: node tests/pilot-program.cjs. No network request or email is sent.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Transpile the real components in memory for isolated SSR regression checks.
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
const Home = require('../app/page.tsx').default;
const { PilotProgramFields } = require('../app/components/PilotProgram.tsx');
const sectionOrder = html => [...html.matchAll(/<section\b[^>]*>/g)].map(match => match[0]);
const enabled = config.SHOW_PILOT_PROGRAM;
try {
  config.SHOW_PILOT_PROGRAM = true;
  const active = renderToStaticMarkup(React.createElement(Home));
  assert.ok(active.includes('Candidatures ouvertes'));
  assert.ok(active.includes(config.PILOT_PROGRAM_OPTION));
  assert.equal((active.match(/<form\b/g) || []).length, 1);
  assert.ok(!active.includes('name="entreprise"'), 'Extra fields stay hidden before selection');
  config.SHOW_PILOT_PROGRAM = false;
  const inactive = renderToStaticMarkup(React.createElement(Home));
  assert.ok(!inactive.includes('programme-30-jours'));
  assert.ok(!inactive.includes(config.PILOT_PROGRAM_OPTION));
  assert.ok(!inactive.includes('name="entreprise"'));
  assert.ok(inactive.includes('name="message"'));
  assert.deepEqual(sectionOrder(active), sectionOrder(inactive), 'Existing sections keep their order');
  const fields = renderToStaticMarkup(React.createElement(PilotProgramFields));
  const names = [...fields.matchAll(/name="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(names, ['entreprise', 'secteur', 'site_ou_reseaux', 'probleme_communication', 'motivation_programme']);
  assert.ok(fields.includes('ne garantit pas une place'));
  console.log('PASS: campaign on/off, unchanged sections, one form, five named fields and selection notice.');
} finally {
  config.SHOW_PILOT_PROGRAM = enabled;
}
