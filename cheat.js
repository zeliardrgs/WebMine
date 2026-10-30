/* =====================================================================
   MENU CHEAT — s'active dans les Paramètres du jeu (interrupteur « Cheats »).
   Par défaut, il est activé seulement en local (localhost).
   ===================================================================== */
(() => {
  const M = window.__mine;
  if (!M) return;
  const KEY = 'mine-tresors-v3', BACKUP = 'mine-tresors-backup', INF = 'mine-cheat-energie';
  const PF = M.CFG.pets.fees, PC = M.CFG.pets.categories;

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
  #cheatPanel input,#cheatPanel select{flex:1; min-width:0; min-height:46px; border-radius:12px; border:2px solid #d9a53a; padding:0 12px; background:#fff; color:#3b2245; font:800 18px system-ui, sans-serif}
  #cheatPanel .note{margin:4px 0 8px; font-size:12px; color:#7a6a80}
  #cheatPanel h2 span{flex:1; margin:0 8px}
  #cheatPanel .x[hidden]{display:none}
  #cheatPanel .cats{display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:8px}
  #cheatPanel .cats button{min-height:76px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; background:#fff; box-shadow:0 3px 0 #d9a53a; border:2px solid #ffd36b}
  #cheatPanel .cats button span{font-size:24px; line-height:1}
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

  // Skips the guided first steps (config.js > progression > guide, levels 1 to 16): every first-steps tutorial
  // is marked as seen, the buildings of the planned returns are open, and the player starts just after the guide.
  function ftueDone(s) {
    const guide = M.CFG.progression.guide, after = guide.fin + 1;
    for (const k of ['toucher', 'creuser', 'tresor', 'sac', 'suivant', 'energie', 'sacPlein', 'continuer', 'echanger', 'surface', 'descendre',
      'prime', 'museeRetour', 'ascenseur', 'forge', 'atelier', 'eq-premier', 'sacBoutique', 'sacAcheter', 'objectifs', 'guideFin']) s.tutoSeen[k] = true;
    for (const r of guide.retours) s.tutoSeen['retour-' + r] = s.tutoSeen['redescendre-' + r] = true;
    for (let l = 1; l <= guide.fin; l++) s.tutoSeen[l] = s.guarDone[l] = true;
    for (const k of ['museum', 'forge', 'atelier', 'shop']) s.buildings[k] = s.tutoSeen['bld-' + k] = true;
    s.bldNew = {}; s.newBuildings = [];
    s.introDone = true; s.bagSeen = true; s.guideBack = guide.fin;
    s.reached = Math.max(s.reached, after);
    if (s.level < after) { s.level = after; s.stayLevel = 0; M.genLevel(after); }
  }

  /* ---------- Actions ---------- */
  const A = {
    // Progression
    // Floor types of the Pioneers' mine: the current level's, and the 10 of its cycle
    floorTypes() {
      const s = S(), lv = s.level, n = Math.floor((lv - 1) / 10) * 10;
      if (!M.etOn(lv)) return msg('Pas de types d\'étages ici (Mine des pionniers seulement)');
      const names = t => (M.CFG.etages.types[t] || {}).nom || t;
      const info = M.etInfo(lv), list = Array.from({ length: 10 }, (_, i) => (n + i + 1) + ' ' + names(M.etType(n + i + 1))).join(' · ');
      // What hides each treasure of this floor (étape 2 : recouvrements)
      const COV = { ouvert: 'Ouvert', indice: 'Indice', mixte: 'Mixte', cache: 'Caché', scelle: 'Scellé' };
      const covers = (s.covers || []).map(c => '- ' + ((c.kind === 'geode' ? M.GEODES : M.ARTS)[c.key] || {}).name + ' : ' + (COV[c.cov] || c.cov)).join('\n');
      alert('Niveau ' + lv + ' : ' + names(info.type) + ' (' + info.grille.join(' × ') + ', ' + info.tresors.join(' à ') + ' trésor(s))'
        + (covers ? '\n\nTrésors de cet étage :\n' + covers + '\nÉnergie demandée : ' + Math.round(s.levelCost || 0) : '') + '\n\nCe cycle : ' + list);
    },
    // Étage Lucky: the current level becomes one (and « Lucky à la prochaine descente » for the real draw)
    luckyNow() { close(); if (!M.makeLucky()) msg('Va d\'abord dans la Mine des pionniers'); },
    luckyNext() { S().forceLucky = true; M.save(); msg('La prochaine descente donnera un étage Lucky (si l\'étage le permet)'); },
    goLevel() {
      const n = level(), s = S();
      s.level = n; s.reached = Math.max(s.reached, n); s.stayLevel = 0;
      M.genLevel(n); M.buildBoard(true); M.go('mine'); close(); msg(`Niveau ${n}`);
    },
    unlock() {
      const n = level(); S().reached = n; refresh(); msg(`Record : niveau ${n} (checkpoints débloqués)`);
    },
    // Skips the guided first steps (config.js > progression > guide, levels 1 to 16): every first-steps tutorial
    // is marked as seen, the buildings of the planned returns are open, and the player starts just after the guide.
    // Reloads the page so no tutorial hand stays on screen.
    skipFtue() {
      const s = S(); ftueDone(s);
      s.screen = 'village';
      localStorage.setItem(KEY, JSON.stringify(s)); location.reload();
    },
    // TEST GROTTE DES MARÉES — À RETIRER AVANT LA MISE EN LIGNE
    // Opens the second mine without playing its 100 levels: first steps skipped, record at the last level of the
    // Mine des pionniers and its guardian beaten. « Descendre » in the village then offers the Grotte des Marées.
    openMine2() {
      const s = S(), gate = M.CFG.biomes.niveauDeblocage || M.CFG.biomes.niveauxParBiome;
      if ((s.guideBack || 0) < M.CFG.progression.guide.fin) ftueDone(s);
      s.reached = Math.max(s.reached, gate);
      (s.guardDone = s.guardDone || {})[gate] = true;
      s.screen = 'village';
      localStorage.setItem(KEY, JSON.stringify(s)); location.reload();
    },
    // Every piece of every treasure in fragments, straight to the Museum: « Reconstituer » shows on each
    allPieces() {
      const b = S().bag.arts;
      for (const o of Object.values(M.ARTS)) if (o.pieces) for (const p of o.pieces) b[p] = Math.max(b[p] || 0, (b[o.key] || 0) + 1);
      refresh(); msg('Tous les morceaux au Musée');
    },
    // Back to no piece and no treasure in fragments put together (the first-piece tutorial and the level 15 piece come back)
    resetPieces() {
      const s = S(), b = s.bag.arts, len = M.CFG.biomes.niveauxParBiome;
      for (const o of Object.values(M.ARTS)) if (o.pieces) { b[o.key] = 0; for (const p of o.pieces) b[p] = 0; }
      delete s.tutoSeen.morceau;
      for (const g of M.CFG.progression.tresorsGarantis) if (g.mine) delete s.guarDone[(g.mine - 1) * len + g.niveau];
      refresh(); msg('Morceaux remis à zéro');
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
    // Miner level (energy and bag come from its rewards, to claim in Progression)
    xp() { M.gainXP(500); refresh(); msg('+500 XP de mineur'); },
    // Just enough XP for the next level, then the home screen: the gauge fills up and the badge's stone appears
    nextLevel() {
      const s = S(), p = M.plInfo(); s.pxp = (s.pxp || 0) + (p.need - p.xp);
      panel.hidden = true; M.go('village'); M.save();
    },
    minerMax() {
      const s = S(), n = M.CFG.progressionJoueur.niveaux.length + 1;
      while (M.plInfo().lv < n) s.pxp = (s.pxp || 0) + 1000;
      for (let l = 2; l <= n; l++) (s.pclaim = s.pclaim || {})[l] = true;
      s.energy = M.maxE(); refresh(); msg('Niveau ' + n + ' : toutes les récompenses récupérées (énergie et sac au max)');
    },
    // Mountain altar
    altarOpen() { S().buildings.altar = true; refresh(); msg('Autel ouvert au village'); },
    altarRunes() {
      const s = S(); s.buildings.altar = true;
      for (const k of Object.keys(M.RUNES)) s.altar.runes[k] = M.CFG.autel.niveauMax || 10;
      s.altar.n = Math.max(s.altar.n, 60); refresh(); msg('Toutes les runes au niveau max');
    },
    altarReset() { const s = S(); s.altar = { n: 0, runes: {} }; delete s.tutoSeen.priere; refresh(); msg('Autel remis à zéro'); },
    // Player profile (config.js > profil): every avatar, frame and title, the free renames, the profile screen
    cosAll() {
      const s = S(), C = s.cosmetics = s.cosmetics || {}, PF = M.CFG.profil;
      for (const kind of ['avatars', 'cadres', 'titres']) C[kind] = Object.keys(PF[kind]).filter(k => !PF[kind][k].defaut);
      refresh(); msg('Tous les avatars, cadres et titres débloqués');
    },
    cosReset() {
      const s = S(); s.cosmetics = {};
      Object.assign(s.profile = s.profile || {}, { avatar: 'mineur', cadre: 'bois', titre: 'apprenti' });
      refresh(); msg('Cosmétiques retirés, profil remis par défaut');
    },
    renamesFree() { (S().profile = S().profile || {}).renames = 0; refresh(); msg('Les 2 changements de nom gratuits sont revenus'); },
    renamesUsed() { (S().profile = S().profile || {}).renames = M.CFG.profil.renommagesGratuits; refresh(); msg('Changements gratuits épuisés : le prochain coûte ' + M.CFG.profil.prixRenommage + ' perles'); },
    profileOpen() { panel.hidden = true; M.go('profile'); },
    // Equipment (the gear opens with the Forge: "Débloquer jusqu'au niveau 11" then go back to the village)
    gems() { const g = S().gear; g.gems += 500; M.refreshGear(); refresh(); msg('+500 perles'); },
    keys() { const k = S().gear.keys; for (const c in k) k[c] += 5; M.refreshGear(); refresh(); msg('+5 clés de chaque coffre'); },
    gearItem(rar) {
      const s = S(), open = Object.keys(M.ARCH).filter(M.archOpen), list = open.length ? open : Object.keys(M.ARCH);
      s.buildings.forge = s.buildings.shop = true;
      s.gear.items.push(M.newItem(randomOf(list), rar)); M.refreshGear(); refresh(); msg('+1 objet ' + M.EQC.raretes[rar].nom);
    },
    gearTrio() {
      const s = S(), open = Object.keys(M.ARCH).filter(M.archOpen), ak = randomOf(open.length ? open : Object.keys(M.ARCH));
      s.buildings.forge = s.buildings.shop = true;
      for (let n = 0; n < 3; n++) s.gear.items.push(M.newItem(ak, 'commun'));
      M.refreshGear(); refresh(); msg('+3 objets Commun identiques (à fusionner)');
    },
    gearAll() {
      const s = S(); s.buildings.forge = s.buildings.shop = true;
      for (const ak of Object.keys(M.ARCH)) s.gear.items.push(M.newItem(ak, 'commun'));
      M.refreshGear(); refresh(); msg('+1 objet de chaque modèle');
    },
    gearReset() {
      if (!confirm('Effacer tout l\'équipement, les clés et les perles ?')) return;
      const s = S(); s.gear = Object.assign(s.gear, { items: [], eq: {}, gems: 0, pity: {}, firstFree: false, firstUp: false, merges: 0 });
      for (const k in s.gear.keys) s.gear.keys[k] = 0;
      delete s.tutoSeen['eq-premier']; delete s.tutoSeen['eq-fusion'];
      M.refreshGear(); refresh(); msg('Équipement remis à zéro (tutoriel compris)');
    },
    // Fairies (one of each colour at most: once the player has them all, a fairy gives pearls)
    fairy() { M.giveFairy('hasard'); close(); },
    // A fairy of this category the player does not have yet
    fairyCat(cat) {
      const s = S(), left = Object.keys(PF).filter(k => PF[k].categorie === cat && !s.pets.some(p => p.key === k));
      if (!left.length) return msg(`Tu as déjà toutes les fées ${PC[cat].nom}`);
      M.giveFairy(randomOf(left)); close();
    },
    fairyAll() {
      const s = S(); let id = s.pets.reduce((m, p) => Math.max(m, p.id), 0), n = 0;
      for (const k of Object.keys(PF)) if (!s.pets.some(p => p.key === k)) { s.pets.push({ id: ++id, kind: 'fee', key: k }); n++; }
      if (!s.petOn && s.pets.length) s.petOn = s.pets[0].id;
      M.paintPet(); refresh(); msg(n ? `+${n} fée${n > 1 ? 's' : ''} : toutes les fées` : 'Tu as déjà toutes les fées');
    },
    fairyNone() {
      if (!confirm('Retirer toutes les fées ?')) return;
      const s = S(); s.pets = []; s.petOn = null; M.paintPet(); refresh(); msg('Plus aucune fée');
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
    // MINE HANTÉE (tests, à retirer avant la mise en ligne)
    // The event's clock: a chosen day (J1 to J16) and hour; minutes keep running. Kept until « Vraie date ».
    hwClock() {
      if (!M.hw) return msg('Pas de Mine Hantée dans config.js');
      const d = +$('cheatHwDay').value, h = +$('cheatHwHour').value;
      // (hours set on the date itself: the night of the time change has 23 or 25 hours)
      const t = new Date(M.hw.date(d - 1)); t.setHours(h, new Date().getMinutes()); const target = t.getTime();
      localStorage.setItem(M.hw.CLOCK_KEY, String(target - Date.now()));
      hwDone(`Jour ${d}, ${h} h`);
    },
    hwRealClock() { localStorage.removeItem(M.hw.CLOCK_KEY); hwDone('Vraie date et vraie heure'); },
    hwFree() { M.hw.refresh(); S().hallo.free += 3; hwDone('+3 Tickets gratuits (perdus à minuit)'); },
    hwPaid() { S().hallo.paid += 3; hwDone('+3 Tickets achetés (gardés jusqu\'à la fin)'); },
    hwCandy() { S().hallo.candy += 100; hwDone('+100 Candy Corn'); },
    hwFirst() { const s = S(); s.hallo.first = false; delete s.tutoSeen['hw-guide']; hwDone('La 1re descente guidée revient'); },
    // Every item of the Halloween collection twice (2 stars): one more of each gives the 3rd star and the Cape
    hwCol2() {
      const b = S().bag.arts, set = M.CFG.mineHantee.collectionCape;
      for (const k of Object.keys(M.ARTS)) if (M.ARTS[k].set === set && !M.ARTS[k].of) b[k] = 2;
      hwDone('Collection Halloween à 2 étoiles (la 3e donne la Cape)');
    },
    hwStarts() { const h = S().hallo; h.bosses = h.bosses || {}; for (const l of [10, 20]) h.bosses[l] = { won: true }; h.best = Math.max(h.best || 1, 21); hwDone('Citrouilles 10 et 20 battues : départs 11 et 21 ouverts'); },
    // Step 3: the candy hour now (same day), straight down to the boss, the boss almost beaten / back to full life
    hwHour() {
      const d = Math.max(1, M.hw.day()), h = M.CFG.mineHantee.heureDesBonbons.de;
      const t = new Date(M.hw.date(d - 1)); t.setHours(h, 1); localStorage.setItem(M.hw.CLOCK_KEY, String(t.getTime() - Date.now()));
      hwDone(`Jour ${d}, ${h} h 01 : heure des bonbons`);
    },
    hwDeep() {
      if (S().haunt) return msg('Remonte d\'abord de la Mine Hantée');
      const h = S().hallo, l = Math.ceil(Math.max(h.best || 1, 10) / 10) * 10; h.best = Math.max(h.best || 1, l); close(); M.hw.start(l);
    },
    hwBossLow() {
      const b = S().haunt && (S().hallo.bosses || {})[S().level]; if (!b || b.hp <= 0) return msg('Pas de Citrouille géante sur ce niveau (descends à un checkpoint : 10, 20, 30…)');
      b.hp = M.CFG.mine.degatsPioche || 10; M.hw.bossPaint(); M.save(); msg('Citrouille géante : plus qu\'un coup !');
    },
    hwBossReset() { S().hallo.bosses = {}; M.save(); msg('Toutes les Citrouilles remises à zéro (jamais vaincues)'); },
    hwReset() {
      if (!confirm('Remettre la Mine Hantée à zéro (Tickets, Candy Corn, départs) ?')) return;
      const s = S(); s.hallo = { candy: 0, free: 0, freeDay: 0, evening: false, ads: 0, adsDay: 0, paid: 0, first: false, best: 1, seen: false };
      s.pets = s.pets.filter(p => !['citrouille', 'chauveSouris'].includes(p.key)); if (!s.pets.some(p => p.id === s.petOn)) s.petOn = s.pets.length ? s.pets[0].id : null;
      delete s.tutoSeen['hw-guide']; hwDone('Mine Hantée remise à zéro');
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
  // Categories: the home page shows one tile per category, a tile opens its sub-menu (« ‹ » goes back)
  const CATS = [
    ['niveaux', '⛏️', 'Niveaux et mine'], ['pionniers', '🍀', 'Mine des pionniers'], ['ressources', '💰', 'Ressources'],
    ['mineur', '⭐', 'Mineur et Autel'], ['profil', '🪪', 'Profil'], ['equipement', '🛡️', 'Équipement'], ['fees', '🧚', 'Fées'], ['geodes', '💎', 'Géodes'],
    ['sac', '🎒', 'Sac et Musée'], ['marees', '🌊', 'Grotte des Marées'], ...(M.hw ? [['hantee', '🎃', 'Mine Hantée']] : []), ['partie', '💾', 'Partie'],
  ];
  panel.innerHTML = `<div class="cp" role="dialog" aria-label="Menu cheat">
    <h2><button class="x" data-c="home" id="cheatBack" aria-label="Retour" hidden>‹</button><span id="cheatTitle">Menu cheat</span>
      <button class="x" data-c="close" aria-label="Fermer">×</button></h2>

    <div class="cat" data-cat="home">
      <p class="note">Visible uniquement en local, jamais sur le site en ligne.</p>
      <div class="cats">${CATS.map(([id, ic, nom]) => `<button data-open="${id}"><span>${ic}</span>${nom}</button>`).join('')}</div>
    </div>

    <div class="cat" data-cat="niveaux" hidden>
    <div class="lvl"><input id="cheatLvl" type="number" min="1" max="1000" inputmode="numeric" placeholder="Niveau (1 à 1000)"></div>
    <div class="row">
      <button data-c="goLevel">Aller à ce niveau</button>
      <button data-c="unlock">Débloquer jusqu'à ce niveau</button>
      <button data-c="finishFloor">Dégager tout l'étage</button>
      <button data-c="skipFtue">Passer la FTUE</button>
    </div>
    </div>

    <div class="cat" data-cat="pionniers" hidden>
    <div class="row">
      <button data-c="floorTypes">Types d'étages</button>
      <button data-c="luckyNow">Étage Lucky maintenant</button>
      <button data-c="luckyNext">Lucky à la prochaine descente</button>
    </div>
    </div>

    <div class="cat" data-cat="marees" hidden>
    <p class="note">Tests, à retirer avant la mise en ligne.</p>
    <div class="row">
      <button data-c="openMine2">Débloquer la Grotte des Marées</button>
      <button data-c="allPieces">Tous les morceaux au Musée</button>
      <button data-c="resetPieces" class="warn">Remettre les morceaux à zéro</button>
    </div>
    <p class="note">Niveaux de la mine 2 dans « Aller à ce niveau » : ajoute 100 (niveau 15 de la mine 2 = 115).</p>
    </div>

    ${M.hw ? `<div class="cat" data-cat="hantee" hidden>
    <p class="note">Tests, à retirer avant la mise en ligne.</p>
    <p class="note" id="cheatHwNow"></p>
    <div class="lvl">
      <select id="cheatHwDay" aria-label="Jour de l'événement">${Array.from({ length: M.CFG.mineHantee.calendrier.fin + 2 }, (_, i) => i).map(d => `<option value="${d}">${d ? 'Jour ' + d : 'Avant (J0)'}</option>`).join('')}</select>
      <select id="cheatHwHour" aria-label="Heure">${Array.from({ length: 24 }, (_, h) => `<option value="${h}">${h} h</option>`).join('')}</select>
    </div>
    <div class="row">
      <button data-c="hwClock">Changer le jour et l'heure</button>
      <button data-c="hwRealClock">Vraie date</button>
      <button data-c="hwFree">+3 Tickets gratuits</button>
      <button data-c="hwPaid">+3 Tickets achetés</button>
      <button data-c="hwCandy">+100 Candy Corn</button>
      <button data-c="hwCol2">Collection Halloween à 2 étoiles</button>
      <button data-c="hwStarts">Battre les Citrouilles 10 et 20</button>
      <button data-c="hwFirst">Rejouer la 1re descente</button>
      <button data-c="hwHour">Heure des bonbons maintenant</button>
      <button data-c="hwDeep">Descendre à la prochaine Citrouille</button>
      <button data-c="hwBossLow">Boss : plus qu'un coup</button>
      <button data-c="hwBossReset">Citrouilles remises à zéro</button>
      <button data-c="hwReset" class="warn">Remettre l'event à zéro</button>
    </div>
    </div>` : ''}

    <div class="cat" data-cat="ressources" hidden>
    <div class="row">
      <button data-c="coins">+1000 pièces</button>
      <button data-c="ores">+50 de chaque minerai</button>
      <button data-c="energy">Énergie pleine</button>
      <button data-c="infinite" id="cheatInf">Énergie infinie</button>
      <button data-c="items">+5 bombes, radars, potions</button>
    </div>
    </div>

    <div class="cat" data-cat="mineur" hidden>
    <div class="row">
      <button data-c="nextLevel">Passer au niveau suivant</button>
      <button data-c="xp">+500 XP de mineur</button>
      <button data-c="minerMax">Niveau du mineur au max (énergie, sac)</button>
      <button data-c="altarOpen">Ouvrir l'Autel</button>
      <button data-c="altarRunes">Toutes les runes au max</button>
      <button data-c="altarReset" class="warn">Remettre l'Autel à zéro</button>
    </div>
    </div>

    <div class="cat" data-cat="profil" hidden>
    <div class="row">
      <button data-c="profileOpen">Ouvrir le profil</button>
      <button data-c="cosAll">Débloquer tous les cosmétiques</button>
      <button data-c="renamesFree">Rendre les noms gratuits</button>
      <button data-c="renamesUsed">Épuiser les noms gratuits</button>
      <button data-c="cosReset" class="warn">Retirer les cosmétiques</button>
    </div>
    <p class="note">Les fées comptent aussi comme avatars : « Toutes les fées » dans Fées.</p>
    </div>

    <div class="cat" data-cat="equipement" hidden>
    <div class="row">
      <button data-c="gems">+500 perles</button>
      <button data-c="keys">+5 clés de chaque</button>
      <button data-c="gearTrio">+3 identiques (fusion)</button>
      <button data-c="gearAll">+1 de chaque modèle</button>
      ${M.RAR_KEYS.map(r => `<button data-c="gearItem" data-g="${r}">+1 ${M.EQC.raretes[r].nom}</button>`).join('')}
      <button data-c="gearReset" class="warn">Remettre l'équipement à zéro</button>
    </div>
    </div>

    <div class="cat" data-cat="fees" hidden>
    <div class="row">
      <button data-c="fairy">+1 fée au hasard</button>
      ${Object.keys(PC).map(c => `<button data-c="fairyCat" data-g="${c}">+1 fée ${PC[c].nom}</button>`).join('')}
      <button data-c="fairyAll">Toutes les fées</button>
      <button data-c="fairyNone" class="warn">Retirer toutes les fées</button>
    </div>
    </div>

    <div class="cat" data-cat="geodes" hidden>
    <div class="row">${Object.keys(g).map(k => `<button data-c="geode" data-g="${k}">+1 ${g[k].name}</button>`).join('')}</div>
    </div>

    <div class="cat" data-cat="sac" hidden>
    <div class="row">
      <button data-c="fillBag">Remplir le sac</button>
      <button data-c="emptyBag">Vider le sac</button>
      <button data-c="fullMuseum">Compléter le musée</button>
      <button data-c="emptyMuseum" class="warn">Vider le musée</button>
    </div>
    </div>

    <div class="cat" data-cat="partie" hidden>
    <div class="row">
      <button data-c="backup">Enregistrer une copie</button>
      <button data-c="restore">Revenir à la copie</button>
      <button data-c="reset" class="warn">Recommencer à zéro</button>
    </div>
    <p class="note">Astuce : « Enregistrer une copie » avant de tricher, puis « Revenir à la copie » pour retrouver ta vraie partie.</p>
    </div>
  </div>`;
  document.body.append(panel);
  const btn = document.createElement('button');
  btn.id = 'cheatBtn'; btn.textContent = 'CHEAT'; btn.setAttribute('aria-label', 'Ouvrir le menu cheat');
  document.body.append(btn);
  const m = document.createElement('div'); m.id = 'cheatMsg'; document.body.append(m);

  function paintToggles() { $('cheatInf').classList.toggle('on', localStorage.getItem(INF) === '1'); paintHwClock(); }
  // Mine Hantée: the event's day and hour shown in the panel (and preselected)
  function paintHwClock() {
    if (!M.hw) return;
    const t = new Date(M.hw.now()), d = M.hw.day(), fake = !!localStorage.getItem(M.hw.CLOCK_KEY);
    $('cheatHwNow').textContent = `Horloge de l'event : jour ${d}, ${t.getHours()} h ${String(t.getMinutes()).padStart(2, '0')}` + (fake ? ' (horloge de test)' : ' (vraie date)');
    $('cheatHwDay').value = String(Math.max(0, Math.min(M.CFG.mineHantee.calendrier.fin + 1, d)));
    $('cheatHwHour').value = String(t.getHours());
  }
  // After a change to the event: tickets of the (new) day, counters, the page on screen
  function hwDone(text) {
    M.hw.refresh(); paintHwClock(); M.hw.paintVillage();
    const scr = visibleScreen();
    if (scr === 'haunt' || scr === 'events' || scr === 'village') M.go(scr); else M.save();
    msg(text);
  }
  function close() { panel.hidden = true; }
  // Shows one category (or the home page); the last one opened comes back when the menu reopens
  const LAST = 'mine-cheat-categorie';
  function openCat(id) {
    if (!CATS.some(c => c[0] === id)) id = 'home';
    panel.querySelectorAll('.cat').forEach(el => el.hidden = el.dataset.cat !== id);
    const c = CATS.find(c => c[0] === id);
    $('cheatTitle').textContent = c ? c[1] + ' ' + c[2] : 'Menu cheat';
    $('cheatBack').hidden = !c;
    panel.querySelector('.cp').scrollTop = 0;
    try { sessionStorage.setItem(LAST, id); } catch (e) {}
  }
  btn.addEventListener('click', () => {
    $('cheatLvl').value = S().level; paintToggles();
    let last = 'home'; try { last = sessionStorage.getItem(LAST) || 'home'; } catch (e) {}
    openCat(last); panel.hidden = false;
  });
  panel.addEventListener('click', e => {
    if (e.target === panel) return close();
    const o = e.target.closest('[data-open]'); if (o) return openCat(o.dataset.open);
    const b = e.target.closest('[data-c]'); if (!b) return;
    if (b.dataset.c === 'close') return close();
    if (b.dataset.c === 'home') return openCat('home');
    A[b.dataset.c](b.dataset.g);
  });

  // Infinite energy: keep the gauge full while the option is on
  setInterval(() => {
    if (M.cheatsOn() && localStorage.getItem(INF) === '1' && S().energy < M.maxE()) { S().energy = M.maxE(); M.updateEnergy(true); }
  }, 300);
})();
