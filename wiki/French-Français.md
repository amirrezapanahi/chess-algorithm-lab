# Guide utilisateur — Français

## Exécuter en local

```bash
git clone https://github.com/amirrezapanahi/chess-algorithm-lab.git
cd chess-algorithm-lab
npm ci
npm run dev
```

Ouvrez l’adresse affichée par Vite. Aucun serveur ni base de données n’est nécessaire.

## Utilisation

1. Choisissez un exercice dans l’en-tête.
2. Lisez **Problème** et révélez les indices progressivement.
3. Écrivez une fonction synchrone `solve(input)` dans **Code**.
4. Appuyez sur **Exécuter** ou `Ctrl/Cmd + Enter`.
5. Utilisez la chronologie pour parcourir les événements validés.
6. Appuyez sur **Tester** pour lancer les validateurs mathématiques publics.
7. Exportez la solution `.js` avant de changer d’appareil.

Le code est enregistré automatiquement dans IndexedDB, uniquement dans ce navigateur.

```js
function solve(input) {
  return input.value * 2;
}

function* trace(input) {
  yield { type: "visit", row: 0, col: 0 };
  yield { type: "complete", message: "Terminé" };
}
```

Consultez [[Code-Examples]] et [[Exercise-API]] pour plus d’exemples.
