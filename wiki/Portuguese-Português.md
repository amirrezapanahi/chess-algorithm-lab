# Guia do utilizador — Português

## Executar localmente

```bash
git clone https://github.com/amirrezapanahi/chess-algorithm-lab.git
cd chess-algorithm-lab
npm ci
npm run dev
```

Abra o endereço mostrado pelo Vite. Não é necessário backend nem servidor de base de dados.

## Como utilizar

1. Selecione um exercício no cabeçalho.
2. Leia **Problema** e revele as dicas gradualmente.
3. Escreva uma função síncrona `solve(input)` em **Código**.
4. Prima **Executar** ou `Ctrl/Cmd + Enter`.
5. Utilize a linha temporal para observar cada evento validado.
6. Prima **Testar** para executar os validadores matemáticos públicos.
7. Exporte a solução `.js` antes de mudar de dispositivo.

O código é guardado automaticamente no IndexedDB deste navegador e não é sincronizado automaticamente com o GitHub.

```js
function solve(input) {
  return input.value * 2;
}

function* trace(input) {
  yield { type: "visit", row: 0, col: 0 };
  yield { type: "complete", message: "Concluído" };
}
```

Consulte [[Code-Examples]] e [[Exercise-API]] para mais exemplos.

## Começar do zero: a primeira abertura

Selecione **01 · Começar**. O tabuleiro mostra logo as 32 peças: as pretas nas filas 8 e 7 e as brancas nas filas 1 e 2. As colunas vão de `a` a `h` e as filas de `1` a `8`.

Quatro ideias bastam: `function solve()` define a função executada pelo laboratório; texto entre aspas é uma **string**; `[]` cria um **array ordenado**; `return` devolve a resposta.

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

As brancas e as pretas avançam o peão do rei e depois desenvolvem um cavalo. Prima **Executar**, abra **Tabuleiro** e use a linha temporal; depois prima **Testar**. O resultado esperado é `1/1` aprovado.

Erros comuns: esquecer aspas ou vírgulas, trocar a ordem, usar outro tipo de traço ou escrever `E2-E4` em maiúsculas. Não é necessário usar `input` nem criar `trace()` neste exercício.
