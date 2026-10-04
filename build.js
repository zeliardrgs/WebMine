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
<style>
:root{padding-top:env(safe-area-inset-top,0px); padding-bottom:env(safe-area-inset-bottom,0px)}
img{max-width:100%}
</style>
</head>
<body>
${game}
</body>
</html>
`;

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), page);
fs.cpSync(path.join(root, 'Assets'), path.join(out, 'Assets'), { recursive: true });
console.log('Built dist/index.html');
