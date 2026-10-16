const assert = require('node:assert/strict');
const fs = require('node:fs');

async function main() {
  const manifest = JSON.parse(fs.readFileSync('public/mon-activite.webmanifest', 'utf8'));
  assert.equal(manifest.start_url, '/admin');
  assert.equal(manifest.id, '/admin');
  assert.equal(manifest.scope, '/admin');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.name, 'Mon activité — Manassé Mukendi');
  for (const icon of manifest.icons) {
    const png = fs.readFileSync(`public${icon.src}`);
    assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, icon.sizes);
  }
  const component = fs.readFileSync('app/admin/InstallApp.tsx', 'utf8');
  assert.match(component, /beforeinstallprompt/);
  assert.match(component, /appinstalled/);
  assert.match(component, /removeEventListener/);
  assert.match(component, /if \(installed\) return null/);
  assert.doesNotMatch(component, /serviceWorker|localStorage|caches\.open/);
  assert.doesNotMatch(fs.readFileSync('app/layout.tsx', 'utf8'), /mon-activite.webmanifest/);

  if (process.env.TEST_BASE_URL) {
    const base = process.env.TEST_BASE_URL;
    const response = await fetch(base + '/mon-activite.webmanifest');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), manifest);
    for (const icon of manifest.icons) {
      const r = await fetch(base + icon.src);
      assert.equal(r.status, 200);
      assert.match(r.headers.get('content-type'), /image\/png/);
    }
    for (const path of ['/admin', '/admin/factures', '/admin/clients']) {
      const r = await fetch(base + path, { redirect: 'manual' });
      assert.equal(r.status, 307);
      assert.equal(new URL(r.headers.get('location'), base).pathname, '/admin/connexion');
      assert.match(r.headers.get('cache-control'), /no-store/);
    }
    const login = await fetch(base + '/admin/connexion');
    assert.match(login.headers.get('cache-control'), /no-store/);
    const html = await login.text();
    assert.match(html, /rel="manifest" href="\/mon-activite.webmanifest"/);
    assert.match(html, /Installer l’application/);
    const home = await (await fetch(base + '/')).text();
    assert.doesNotMatch(home, /rel="manifest"|Installer l’application/);
  }
  console.log('PASS: personalized manifest, exact icon sizes, private-only UI, no offline storage; HTTP protections verified when TEST_BASE_URL is provided.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
