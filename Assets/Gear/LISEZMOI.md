# Images de l'équipement (pour l'artiste UI/UX)

Tant qu'une image n'existe pas, le jeu affiche un **dessin temporaire** (formes simples, couleur du modèle).
Pour brancher une vraie image, il n'y a rien à coder :

1. Poser le fichier PNG dans ce dossier, `Assets/Gear/`.
2. Ouvrir `config.js`, section `equipement > images`.
3. Écrire le chemin du fichier en face du bon nom, par exemple :
   `picLourd: 'Assets/Gear/PicLourd.png',`
4. Recharger le jeu : l'image remplace le dessin partout (fiche, sac, mineur, coffres, Forge).

Si le jeu tourne en local, faire un rechargement forcé (Cmd+Maj+R) pour éviter l'ancienne version en cache.

## Format conseillé

- PNG carré à fond transparent, **256 × 256 px** (affiché entre 46 et 190 px).
- L'objet seul, centré, avec une petite marge. **Pas de cadre ni de fond de rareté** : le jeu les ajoute
  (vert Commun, bleu Rare, violet Épique, or Légendaire, rouge Mythique avec des éclairs).
- Contour sombre comme le reste du jeu (`#3b2245`).

## Liste des images attendues

| Nom dans `config.js` | Ce que c'est | Emplacement |
| --- | --- | --- |
| `picLourd` | Pic lourd | Pioche |
| `picEclats` | Pic à éclats | Pioche |
| `picGivre` | Pic de givre | Pioche |
| `pelleProspecteur` | Pelle de prospecteur | Pelle |
| `pelleLarge` | Pelle large | Pelle |
| `gantsFer` | Gants de fer | Gants |
| `gantsDynamiteur` | Gants de dynamiteur | Gants |
| `casqueChantier` | Casque de chantier | Casque |
| `casqueVeine` | Casque de veine | Casque |
| `lanterneProspecteur` | Lanterne de prospecteur | Lanterne |
| `lanterneAncienne` | Lanterne ancienne | Lanterne |
| `bottesProspecteur` | Bottes de prospecteur | Bottes |
| `bottesPorteBonheur` | Bottes porte-bonheur | Bottes |
| `coffreBois`, `coffreArgent`, `coffreOr`, `coffreEtoile` | Les 4 coffres, **fermés** | Boutique |
| `cleBois`, `cleArgent`, `cleOr`, `cleEtoile` | Les 4 clés | Boutique, mine |
| `gemmes` | Icône de la monnaie premium | Boutique |

Un coffre **ouvert** reste dessiné par le jeu pour l'instant (animation d'ouverture). Pour une vraie
animation, prévoir une planche d'images ou un Spine plus tard, côté Unity.

La clé posée dans la mine (case `gkey`) utilise la même image que la clé (`cleBois`, `cleArgent`…).
Sans image, elle reste dessinée dans le CSS du jeu (`.t-gkey::before`).

Pour ajouter un nouveau modèle d'équipement, l'ajouter dans `config.js > equipement > emplacements`,
puis ajouter son nom dans `images`.
