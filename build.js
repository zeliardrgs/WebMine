// Builds the static site for Vercel: wraps the game page in a full HTML document
// (the Claude artifact adds this skeleton itself) and copies the assets next to it.
const fs = require('fs');
const path = require('path');

const root = __dirname;
const out = path.join(root, 'dist');
const game = fs.readFileSync(path.join(root, 'mine-aux-tresors.html'), 'utf8');

const page = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#2a1b3d">
<link rel="icon" href="Assets/Tools/Icn_Pickaxe.png">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="Assets/AppIcon/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Mine aux Trésors">
<script>
// Wide screens (desktop, landscape window): play inside a portrait phone frame instead of stretching across the window.
// The page loads itself at ?app in an iframe; <plaintext> swallows the rest of this copy so its game never starts.
if (top === self && !/[?&]app\\b/.test(location.search) && innerWidth > innerHeight && !matchMedia('(pointer:coarse)').matches) {
  document.write('<style>html,body{margin:0;height:100%;background:radial-gradient(90% 70% at 50% 0%,#3b2552,#160d22)}body{display:grid;place-items:center}'
    + 'iframe{display:block;height:min(100vh - 32px,932px);aspect-ratio:430/932;border:0;border-radius:32px;background:#2a1b3d;box-shadow:0 0 0 10px #0c0712,0 24px 60px rgba(0,0,0,.6)}</style>'
    + '<iframe src="?app' + location.search.replace(/^\\?/, '&') + '" title="Mine aux Trésors" onload="this.focus()"></iframe><plaintext hidden>');
}
</script>
<style>
:root{padding-top:env(safe-area-inset-top,0px); padding-bottom:env(safe-area-inset-bottom,0px)}
img{max-width:100%}
</style>
</head>
<body>
${game}
<script>
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
</script>
</body>
</html>
`;

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), page);
fs.cpSync(path.join(root, 'Assets'), path.join(out, 'Assets'), { recursive: true });
fs.copyFileSync(path.join(root, 'config.js'), path.join(out, 'config.js'));
fs.copyFileSync(path.join(root, 'textes-en.js'), path.join(out, 'textes-en.js'));
fs.copyFileSync(path.join(root, 'cheat.js'), path.join(out, 'cheat.js'));   // loaded only when Cheats is switched on in the Settings

// Installable web app: fullscreen hides the phone's status bar and navigation bar once added to the home screen.
const manifest = {
  name: 'Mine aux Trésors',
  short_name: 'Mine aux Trésors',
  lang: 'fr',
  start_url: './',
  scope: './',
  display: 'fullscreen',
  display_override: ['fullscreen', 'standalone'],
  orientation: 'portrait',
  background_color: '#2a1b3d',
  theme_color: '#2a1b3d',
  icons: [
    { src: 'Assets/AppIcon/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
    { src: 'Assets/AppIcon/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
};
fs.writeFileSync(path.join(out, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

// Service worker: precaches the game so it opens offline; the version changes on every build so updates reach installed apps.
const listFiles = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? listFiles(p) : e.name.startsWith('.') ? [] : [p];
});
const precache = ['./', 'config.js', 'textes-en.js', 'cheat.js', 'manifest.webmanifest',
  ...listFiles(path.join(out, 'Assets')).map(f => path.relative(out, f).split(path.sep).map(encodeURIComponent).join('/'))];
const sw = `const CACHE = 'mine-${Date.now()}';
const PRECACHE = ${JSON.stringify(precache)};
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    // Page: network first so new versions show up, cache when offline.
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./', copy)); return r; })
      .catch(() => caches.match('./')));
    return;
  }
  // Assets and fonts: cache first.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});
`;
fs.writeFileSync(path.join(out, 'sw.js'), sw);
console.log('Built dist/index.html');
