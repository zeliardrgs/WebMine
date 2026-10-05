/* =====================================================================
   MINE AUX TRÉSORS — RÉGLAGES DU JEU
   ---------------------------------------------------------------------
   Toutes les valeurs d'équilibrage sont ici. Tu peux les modifier
   librement, puis recharger la page du jeu pour voir l'effet.

   Quelques règles pour ne rien casser :
   - Ne change que les nombres (et les textes entre guillemets).
   - Garde les virgules à la fin des lignes, et les crochets [ ] / accolades { }.
   - Les durées sont en millisecondes : 1000 = 1 seconde.
   - Les pourcentages sont écrits en décimal : 0.12 = 12 %.
   ===================================================================== */

window.CONFIG = {

  /* ---------------------------------------------------------------
     ÉNERGIE
     --------------------------------------------------------------- */
  energie: {
    // Énergie maximum au début du jeu
    maxDepart: 60,

    // Énergie max gagnée à chaque niveau de l'amélioration "Réserve d'énergie" (Forge)
    bonusParAmelioration: 10,

    // Recharge automatique avec le temps : +1 point toutes les X millisecondes.
    // 0 = pas de recharge automatique (l'énergie ne revient qu'au village ou avec une potion).
    rechargeAutoMs: 0,

    // Recharge complète quand le joueur remonte au village (true = oui, false = non)
    rechargeAuVillage: true,

    // Recharge complète en descendant à l'étage suivant (true = oui, false = non)
    rechargeEtageSuivant: false,
  },

  /* ---------------------------------------------------------------
     DÉPART D'UNE NOUVELLE PARTIE
     --------------------------------------------------------------- */
  depart: {
    pieces: 50,     // pièces au départ
    bombes: 0,      // bombes au départ
    radars: 0,      // radars au départ
    potions: 0,     // potions d'énergie au départ
  },

  /* ---------------------------------------------------------------
     SAC À DOS
     Chaque trésor et chaque géode prend 1 case. Les minerais ne vont pas
     dans le sac (ils sont illimités). Le sac se vide au retour au village.
     --------------------------------------------------------------- */
  sac: {
    // Nombre de cases au début du jeu
    casesDepart: 4,

    // Agrandissements achetables à la Boutique, dans l'ordre :
    // "cases" = taille du sac après l'achat, "pieces" = prix
    agrandissements: [
      { cases: 6, pieces: 80 },
      { cases: 8, pieces: 160 },
      { cases: 10, pieces: 300 },
      { cases: 12, pieces: 500 },
    ],
  },

  /* ---------------------------------------------------------------
     CHECKPOINTS (ASCENSEUR)
     Profondeurs (en mètres) où le joueur peut redescendre directement depuis
     le village. Un checkpoint se débloque dès que le joueur atteint cette
     profondeur. Utiliser un checkpoint est gratuit.
     Chaque étage fait 10 m : utilise des multiples de 10.
     --------------------------------------------------------------- */
  checkpoints: {
    profondeurs: [10, 50, 90, 130, 190, 260],
  },

  /* ---------------------------------------------------------------
     MINE : SOLIDITÉ DES ROCHES ET MINERAIS
     --------------------------------------------------------------- */
  mine: {
    // Nombre de coups de pioche (niveau 1) pour casser chaque type de bloc
    coupsPierre: 3,
    coupsPierreMinerai: 3,
    coupsMagmaRefroidi: 5,

    // Chance qu'une pierre contienne du minerai (0.26 = 26 %)
    chanceMinerai: 0.26,

    // Fréquence relative de chaque minerai (plus le nombre est grand, plus il est courant)
    frequenceMinerais: { fer: 55, cuivre: 32, or: 13 },

    // Quantité obtenue en cassant une pierre à minerai : [minimum, maximum]
    quantiteMinerais: { fer: [1, 3], cuivre: [1, 2], or: [1, 1] },
  },

  /* ---------------------------------------------------------------
     GÉODES
     4 géodes, une par rareté. Les gemmes ne se trouvent plus dans la mine :
     elles sortent uniquement des géodes, ouvertes à l'Atelier.
     Une géode donne une gemme tirée au hasard parmi TOUTES les gemmes de sa rareté.
     --------------------------------------------------------------- */
  geodes: {
    // Fréquence d'apparition de chaque géode dans la mine
    // (plus le nombre est grand, plus elle apparaît souvent)
    frequence: { blanche: 60, rose: 25, doree: 12, cristal: 3 },
  },

  /* ---------------------------------------------------------------
     ÉCONOMIE : VENTE DES DOUBLONS ET PRIMES
     --------------------------------------------------------------- */
  economie: {
    // Prix de vente d'un doublon, selon la rareté du trésor (en pièces)
    venteDoublons: { common: 8, rare: 20, epic: 40, legendary: 80 },

    // Prime pour une NOUVELLE découverte (la première fois qu'on trouve ce trésor), selon sa rareté (en pièces)
    primeDecouverte: { common: 10, rare: 25, epic: 50, legendary: 100 },

    // Niveaux de série au Musée : une série complétée 1, 2 puis 3 fois passe Bronze, Argent puis Or.
    // Le prix de revente des doublons de la série augmente alors de ce pourcentage (0.10 = +10 %).
    bonusNiveauSerie: { bronze: 0.10, argent: 0.25, or: 0.50 },
  },

  /* ---------------------------------------------------------------
     COLLECTIONS DU MUSÉE
     Rareté : 'common', 'rare', 'epic' ou 'legendary'.
     "prime" = pièces gagnées la PREMIÈRE fois que la série est complétée.
     Tu peux changer les noms, les raretés, les primes et les phases.
     Ne change pas les mots avant les deux-points (quartz:, fossiles:…) :
     ce sont les identifiants utilisés par le jeu et par les images.
     --------------------------------------------------------------- */
  collections: {
    // Les "phases" sont des zones de profondeur. Profondeur (en mètres) où commence chaque phase :
    //        phase 0, 1,  2,  3,   4,   5,   6
    phases: [10, 20, 50, 90, 130, 190, 260],

    // Chance d'apparition d'un artefact dans la mine selon sa rareté
    // (plus le nombre est grand, plus il apparaît souvent)
    frequenceArtefacts: { common: 12, rare: 6, epic: 3, legendary: 2 },

    // GEMMES : elles sortent uniquement des géodes (une géode donne une gemme de sa rareté)
    gemmes: {
      claires: { nom: 'Gemmes claires', prime: 100, objets: {
        quartz:      { nom: 'Quartz',       rarete: 'common' },
        aigueMarine: { nom: 'Aigue-marine', rarete: 'common' },
        topazeBleue: { nom: 'Topaze bleue', rarete: 'common' },
        diamantBrut: { nom: 'Diamant brut', rarete: 'rare' },
      } },
      roses: { nom: 'Gemmes roses', prime: 200, objets: {
        quartzRose:    { nom: 'Quartz rose',   rarete: 'common' },
        rhodochrosite: { nom: 'Rhodochrosite', rarete: 'common' },
        kunzite:       { nom: 'Kunzite',       rarete: 'rare' },
        saphirRose:    { nom: 'Saphir rose',   rarete: 'epic' },
      } },
      dorees: { nom: 'Gemmes dorées', prime: 400, objets: {
        citrine:         { nom: 'Citrine',          rarete: 'rare' },
        ambre:           { nom: 'Ambre',            rarete: 'rare' },
        topazeImperiale: { nom: 'Topaze impériale', rarete: 'epic' },
        heliodore:       { nom: 'Héliodore',        rarete: 'legendary' },
      } },
      royales: { nom: 'Gemmes royales', prime: 400, objets: {
        rubis:        { nom: 'Rubis',         rarete: 'rare' },
        emeraude:     { nom: 'Émeraude',      rarete: 'epic' },
        saphirEtoile: { nom: 'Saphir étoilé', rarete: 'epic' },
        diamantPur:   { nom: 'Diamant pur',   rarete: 'legendary' },
      } },
    },

    // ARTEFACTS : trouvés dans la grille de la mine.
    // "phases" = dans quelles phases la série peut apparaître.
    // "sol" = ce qui recouvre l'artefact : 'terre', 'pierre', 'magma', ou 'tout' (n'importe quoi).
    // Un objet peut avoir ses propres "phases" (ex. une pièce ou une clé par zone).
    artefacts: {
      fossiles: { nom: 'Fossiles de surface', prime: 50, phases: [0, 1], sol: 'terre', objets: {
        coquillage: { nom: 'Coquillage fossile', rarete: 'common' },
        feuille:    { nom: 'Feuille fossile',    rarete: 'common' },
        ammonite:   { nom: 'Petite ammonite',    rarete: 'common' },
      } },
      celestes: { nom: 'Cartes célestes', prime: 50, phases: [1, 2], sol: 'tout', objets: {
        lion:     { nom: 'Plaque du Lion',     rarete: 'common' },
        taureau:  { nom: 'Plaque du Taureau',  rarete: 'common' },
        scorpion: { nom: 'Plaque du Scorpion', rarete: 'common' },
        dragon:   { nom: 'Plaque du Dragon',   rarete: 'rare' },
      } },
      outils: { nom: 'Outils du mineur oublié', prime: 100, phases: [2], sol: 'pierre', objets: {
        lampe:   { nom: 'Lampe rouillée',          rarete: 'common' },
        gourde:  { nom: 'Vieille gourde',          rarete: 'common' },
        casque:  { nom: 'Casque cabossé',          rarete: 'common' },
        pioche:  { nom: 'Pioche du premier mineur', rarete: 'rare' },
      } },
      tablette: { nom: 'Tablette ancienne', prime: 100, phases: [3, 4], sol: 'pierre',
        // Texte affiché quand la tablette est complète
        legende: "« Sous la montagne dort le trésor du Roi Mineur. Cinq clés, cachées de plus en plus profond, ouvrent son coffre. »",
        objets: {
          fragmentGauche:  { nom: 'Fragment gauche',  rarete: 'common' },
          fragmentCentral: { nom: 'Fragment central', rarete: 'common' },
          fragmentDroit:   { nom: 'Fragment droit',   rarete: 'common' },
        } },
      feu: { nom: 'Pierres de feu', prime: 200, phases: [4], sol: 'magma', objets: {
        obsidienne:   { nom: 'Obsidienne',     rarete: 'common' },
        pierreDeLave: { nom: 'Pierre de lave', rarete: 'common' },
        coeurDeBraise: { nom: 'Cœur de braise', rarete: 'epic' },
      } },
      abysses: { nom: 'Trésors des abysses', prime: 200, phases: [5], sol: 'tout', objets: {
        corail:     { nom: 'Corail pétrifié', rarete: 'common' },
        conque:     { nom: 'Conque abyssale', rarete: 'common' },
        perleNoire: { nom: 'Perle noire',     rarete: 'epic' },
      } },
      monnaies: { nom: 'Monnaies du royaume perdu', prime: 200, sol: 'tout', objets: {
        sou:     { nom: 'Sou de cuivre',     rarete: 'common', phases: [0] },
        denier:  { nom: "Denier d'argent",   rarete: 'common', phases: [1] },
        ecu:     { nom: 'Écu de bronze',     rarete: 'common', phases: [2] },
        ducat:   { nom: "Ducat d'or",        rarete: 'common', phases: [3] },
        florin:  { nom: 'Florin de platine', rarete: 'common', phases: [4] },
        pieceDuRoi: { nom: 'Pièce du roi',   rarete: 'epic',   phases: [5] },
      } },
      reliques: { nom: 'Reliques ornées', prime: 400, phases: [6], sol: 'tout', objets: {
        calice:  { nom: 'Calice orné',          rarete: 'epic' },
        masque:  { nom: "Masque d'or",          rarete: 'epic' },
        sceptre: { nom: 'Sceptre du roi mineur', rarete: 'legendary' },
      } },
      cles: { nom: 'Clés du Roi Mineur', prime: 1000, sol: 'tout',
        // Message affiché quand toutes les clés sont réunies
        message: 'Coffre du roi ouvert !',
        objets: {
          cleFer:     { nom: 'Clé de fer',     rarete: 'legendary', phases: [2] },
          cleCuivre:  { nom: 'Clé de cuivre',  rarete: 'legendary', phases: [3] },
          cleArgent:  { nom: "Clé d'argent",   rarete: 'legendary', phases: [4] },
          cleOr:      { nom: "Clé d'or",       rarete: 'legendary', phases: [5] },
          cleCristal: { nom: 'Clé de cristal', rarete: 'legendary', phases: [6] },
        } },
    },
  },

  /* ---------------------------------------------------------------
     BOUTIQUE : PRIX DES CONSOMMABLES (en pièces)
     --------------------------------------------------------------- */
  boutique: {
    bombe: 15,
    radar: 30,
    potion: 25,
  },

  /* ---------------------------------------------------------------
     FORGE : AMÉLIORATIONS
     Chaque ligne = le prix d'un niveau, dans l'ordre (niveau 1, niveau 2, …).
     fer / cuivre / or = minerais, pieces = pièces.
     --------------------------------------------------------------- */
  forge: {
    reserveEnergie: [
      { fer: 6, pieces: 20 },
      { fer: 10, cuivre: 2, pieces: 40 },
      { fer: 14, cuivre: 4, pieces: 70 },
      { fer: 18, cuivre: 6, or: 1, pieces: 100 },
      { fer: 24, cuivre: 8, or: 3, pieces: 150 },
    ],
    piocheRenforcee: [
      { fer: 10, cuivre: 3, pieces: 50 },
      { fer: 20, cuivre: 8, or: 3, pieces: 150 },
    ],
    coupEnEclats: [
      { cuivre: 5, pieces: 40 },
      { cuivre: 9, or: 1, pieces: 80 },
      { cuivre: 14, or: 3, pieces: 140 },
    ],
    arrosoirRapide: [
      { fer: 5, cuivre: 2, pieces: 30 },
      { fer: 9, cuivre: 5, pieces: 60 },
      { fer: 14, cuivre: 8, or: 2, pieces: 110 },
    ],
    grandArrosoir: [
      { cuivre: 6, pieces: 40 },
      { cuivre: 10, or: 2, pieces: 90 },
      { cuivre: 15, or: 4, pieces: 150 },
    ],

    // Chance de casser une roche voisine, pour chaque niveau de "Coup en éclats"
    // (le premier nombre = sans amélioration)
    chanceEclats: [0, 0.12, 0.22, 0.33],

    // Temps de recharge de l'arrosoir pour chaque niveau d'"Arrosoir rapide" (en millisecondes)
    rechargeArrosoirMs: [5000, 4000, 3000, 2000],
  },

  /* ---------------------------------------------------------------
     ATELIER : MINI-JEU D'OUVERTURE DES GÉODES
     Chaque liste a 4 valeurs, une par géode :
     [Blanche (Common), Rose (Rare), Dorée (Epic), Cristal (Legendary)]
     --------------------------------------------------------------- */
  atelier: {
    coupsNecessaires: [2, 3, 4, 5],              // coups réussis pour ouvrir
    largeurZoneVerte: [32, 26, 21, 16],          // en % de la barre
    vitesseCurseur: [0.7, 0.85, 1.0, 1.15],      // allers-retours par seconde
    vies: 3,                                     // nombre de cœurs
    accelerationParCoup: 0.08,                   // le curseur accélère de 8 % après chaque coup réussi

    // Si le joueur perd tous ses cœurs, la géode s'ouvre quand même mais donne une gemme
    // d'une rareté en dessous. Une géode blanche ratée donne ce nombre de pièces à la place :
    piecesGeodeBlancheRatee: 15,
  },
};
