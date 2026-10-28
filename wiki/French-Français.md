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

## Partir de zéro : votre première ouverture

Sélectionnez **01 · Bien démarrer**. L’échiquier affiche immédiatement les 32 pièces : les Noirs sur les rangées 8 et 7, les Blancs sur les rangées 1 et 2. Les colonnes vont de `a` à `h` et les rangées de `1` à `8`.

Quatre notions suffisent : `function solve()` définit la fonction appelée par le laboratoire ; le texte entre guillemets est une **chaîne** ; `[]` crée un **tableau ordonné** ; `return` renvoie la réponse.

```js
function solve() {
  return [
    "e2-e4",
    "e7-e5",
    "g1-f3",
    "b8-c6",
  ];
}
```

Les deux camps avancent leur pion roi puis développent un cavalier. Cliquez sur **Exécuter**, ouvrez **Échiquier** et utilisez la chronologie ; cliquez ensuite sur **Tester**. Le résultat attendu est `1/1` réussi.

Erreurs fréquentes : guillemets ou virgules oubliés, ordre modifié, mauvais tiret ou `E2-E4` en majuscules. Aucun `input` ni `trace()` personnalisé n’est nécessaire.
