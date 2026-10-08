/* =====================================================================
   MENU CHEAT — s'active dans les Paramètres du jeu (interrupteur « Cheats »).
   Par défaut, il est activé seulement en local (localhost).
   ===================================================================== */
(() => {
  const M = window.__mine;
  if (!M) return;
  const KEY = 'mine-tresors-v2', BACKUP = 'mine-tresors-backup', INF = 'mine-cheat-energie';

  /* ---------- Style ---------- */
  const css = document.createElement('style');
  css.textContent = `
  #cheatBtn{position:fixed; left:6px; top:45%; opacity:.85; z-index:9999; width:48px; height:48px; border-radius:50%; border:3px solid #fff;
    background:#e0245e; color:#fff; font:900 13px/1 system-ui, sans-serif; box-shadow:0 4px 10px rgba(0,0,0,.4); cursor:pointer}
  #cheatPanel{position:fixed; inset:0; z-index:10000; background:rgba(20,10,30,.6); display:flex; align-items:flex-end; justify-content:center}
  #cheatPanel[hidden]{display:none}
  #cheatPanel .cp{width:min(480px, 100%); max-height:88vh; overflow:auto; background:#fff8ea; border-radius:20px 20px 0 0; padding:14px 16px 20px;
    font:600 14px/1.3 system-ui, sans-serif; color:#3b2245}
  #cheatPanel h2{margin:0 0 4px; font-size:20px; display:flex; justify-content:space-between; align-items:center}
  #cheatPanel h3{margin:14px 0 6px; font-size:13px; text-transform:uppercase; letter-spacing:.05em; color:#e0245e}
  #cheatPanel .row{display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:8px}
  #cheatPanel button{min-height:46px; padding:6px 10px; border:0; border-radius:12px; background:#ffd36b; color:#3b2245;
    font:800 14px/1.15 system-ui, sans-serif; box-shadow:0 3px 0 #d9a53a; cursor:pointer}
  #cheatPanel button:active{transform:translateY(2px); box-shadow:0 1px 0 #d9a53a}
  #cheatPanel button.on{background:#35d49a; box-shadow:0 3px 0 #1fae7a}
  #cheatPanel button.warn{background:#ffb4a8; box-shadow:0 3px 0 #e07f70}
  #cheatPanel .x{min-height:40px; width:40px; padding:0; background:#eee; box-shadow:none; font-size:20px}
  #cheatPanel .lvl{display:flex; gap:8px; margin-bottom:8px}
  #cheatPanel input{flex:1; min-width:0; min-height:46px; border-radius:12px; border:2px solid #d9a53a; padding:0 12px; background:#fff; color:#3b2245; font:800 18px system-ui, sans-serif}
  #cheatPanel .note{margin:4px 0 0; font-size:12px; color:#7a6a80}
  #cheatMsg{position:fixed; left:50%; bottom:70px; transform:translateX(-50%); z-index:10001; background:#3b2245; color:#fff; padding:8px 14px;
    border-radius:12px; font:700 14px system-ui, sans-serif; pointer-events:none; opacity:0; transition:opacity .2s}`;
  document.head.append(css);

  /* ---------- Helpers ---------- */
  const S = () => M.S;
  const $ = id => document.getElementById(id);
  const visibleScreen = () => M.SCREENS.find(n => { const el = $('scr-' + n); return el && !el.hidden; });
  let msgT;
  function msg(text) {
    const el = $('cheatMsg'); el.textContent = text; el.style.opacity = 1;
    clearTimeout(msgT); msgT = setTimeout(() => el.style.opacity = 0, 1600);
  }
  // Refresh the counters and the current screen after a change
  function refresh() {
    M.updateBombs(); M.updateQuick(); M.updateBadge(); M.updateEnergy(true);
    const scr = visibleScreen();
    if (scr && scr !== 'mine') M.go(scr); else M.save();
  }
  const level = () => Math.max(1, Math.min(1000, parseInt($('cheatLvl').value, 10) || 1));
  const randomOf = list => list[Math.floor(Math.random() * list.length)];

  /* ---------- Actions ---------- */
  const A = {
    // Progression
    goLevel() {
      const n = level(), s = S();
      s.level = n; s.reached = Math.max(s.reached, n); s.stayLevel = 0;
      M.genLevel(n); M.buildBoard(true); M.go('mine'); close(); msg(`Niveau ${n}`);
    },
    unlock() {
      const n = level(); S().reached = n; refresh(); msg(`Record : niveau ${n} (checkpoints débloqués)`);
    },
    finishFloor() {
      if (visibleScreen() !== 'mine') return msg('Va d\'abord dans la mine');
      const s = S();
      s.grid.forEach((c, i) => { if (c.t !== 'empty') { s.grid[i] = { t: 'empty' }; M.paintTile(i); } });
      close(); M.checkRewards(); M.save(); msg('Étage dégagé');
    },
    // Resources
    coins() { S().coins += 1000; refresh(); msg('+1000 pièces'); },
    ores() { const o = S().bag.ores; for (const k in o) o[k] += 50; refresh(); msg('+50 de chaque minerai'); },
    energy() { S().energy = M.maxE(); refresh(); msg('Énergie pleine'); },
    infinite() {
      const on = localStorage.getItem(INF) !== '1';
      localStorage.setItem(INF, on ? '1' : '0'); paintToggles(); msg(on ? 'Énergie infinie activée' : 'Énergie infinie désactivée');
    },
    items() { const s = S(); s.bombs += 5; s.radars += 5; s.potions += 5; refresh(); msg('+5 bombes, radars et potions'); },
    upgrades() {
      const s = S();
      for (const k of Object.keys(M.UPGRADES)) s.up[k] = M.UPGRADES[k].cost.length;
      s.bagLvl = M.BAG_UP.length; s.energy = M.maxE(); refresh(); msg('Forge et sac au maximum');
    },
    // Geodes
    geode(g) { S().bag.geodes.push(g); refresh(); msg('+1 ' + M.GEODES[g].name); },
    // Bag
    fillBag() {
      const s = S(), keys = Object.keys(M.ARTS);
      while (s.trip.finds.length < M.bagCap()) s.trip.finds.push({ kind: 'art', key: randomOf(keys) });
      refresh(); msg('Sac rempli');
    },
    emptyBag() { const s = S(); s.trip.finds = []; s.trip.dupes = []; refresh(); msg('Sac vidé'); },
    // Museum
    fullMuseum() {
      const b = S().bag;
      for (const k of Object.keys(M.GEMS)) b.gems[k] = Math.max(1, b.gems[k] || 0);
      for (const k of Object.keys(M.ARTS)) b.arts[k] = Math.max(1, b.arts[k] || 0);
      refresh(); msg('Musée complet (niveau Bronze)');
    },
    emptyMuseum() {
      const b = S().bag;
      for (const k of Object.keys(b.gems)) b.gems[k] = 0;
      for (const k of Object.keys(b.arts)) b.arts[k] = 0;
      refresh(); msg('Musée vidé');
    },
    // Save copies
    backup() { localStorage.setItem(BACKUP, JSON.stringify(S())); msg('Copie de la partie enregistrée'); },
    restore() {
      const b = localStorage.getItem(BACKUP);
      if (!b) return msg('Aucune copie enregistrée');
      localStorage.setItem(KEY, b); location.reload();
    },
    reset() {
      if (!confirm('Effacer complètement la partie ?')) return;
      localStorage.removeItem(KEY); location.reload();
    },
  };

  /* ---------- Panel ---------- */
  const g = M.GEODES;
  const panel = document.createElement('div');
  panel.id = 'cheatPanel'; panel.hidden = true;
  panel.innerHTML = `<div class="cp" role="dialog" aria-label="Menu cheat">
    <h2>Menu cheat <button class="x" data-c="close" aria-label="Fermer">×</button></h2>
    <p class="note">Visible uniquement en local, jamais sur le site en ligne.</p>

    <h3>Progression</h3>
    <div class="lvl"><input id="cheatLvl" type="number" min="1" max="1000" inputmode="numeric" placeholder="Niveau (1 à 1000)"></div>
    <div class="row">
      <button data-c="goLevel">Aller à ce niveau</button>
      <button data-c="unlock">Débloquer jusqu'à ce niveau</button>
      <button data-c="finishFloor">Dégager tout l'étage</button>
    </div>

    <h3>Ressources</h3>
    <div class="row">
      <button data-c="coins">+1000 pièces</button>
      <button data-c="ores">+50 de chaque minerai</button>
      <button data-c="energy">Énergie pleine</button>
      <button data-c="infinite" id="cheatInf">Énergie infinie</button>
      <button data-c="items">+5 bombes, radars, potions</button>
      <button data-c="upgrades">Forge et sac au max</button>
    </div>

    <h3>Géodes</h3>
    <div class="row">${Object.keys(g).map(k => `<button data-c="geode" data-g="${k}">+1 ${g[k].name}</button>`).join('')}</div>

    <h3>Sac et musée</h3>
    <div class="row">
      <button data-c="fillBag">Remplir le sac</button>
      <button data-c="emptyBag">Vider le sac</button>
      <button data-c="fullMuseum">Compléter le musée</button>
      <button data-c="emptyMuseum" class="warn">Vider le musée</button>
    </div>

    <h3>Partie</h3>
    <div class="row">
      <button data-c="backup">Enregistrer une copie</button>
      <button data-c="restore">Revenir à la copie</button>
      <button data-c="reset" class="warn">Recommencer à zéro</button>
    </div>
    <p class="note">Astuce : « Enregistrer une copie » avant de tricher, puis « Revenir à la copie » pour retrouver ta vraie partie.</p>
  </div>`;
  document.body.append(panel);
  const btn = document.createElement('button');
  btn.id = 'cheatBtn'; btn.textContent = 'CHEAT'; btn.setAttribute('aria-label', 'Ouvrir le menu cheat');
  document.body.append(btn);
  const m = document.createElement('div'); m.id = 'cheatMsg'; document.body.append(m);

  function paintToggles() { $('cheatInf').classList.toggle('on', localStorage.getItem(INF) === '1'); }
  function close() { panel.hidden = true; }
  btn.addEventListener('click', () => { $('cheatLvl').value = S().level; paintToggles(); panel.hidden = false; });
  panel.addEventListener('click', e => {
    if (e.target === panel) return close();
    const b = e.target.closest('[data-c]'); if (!b) return;
    if (b.dataset.c === 'close') return close();
    A[b.dataset.c](b.dataset.g);
  });

  // Infinite energy: keep the gauge full while the option is on
  setInterval(() => {
    if (M.cheatsOn() && localStorage.getItem(INF) === '1' && S().energy < M.maxE()) { S().energy = M.maxE(); M.updateEnergy(true); }
  }, 300);
})();
