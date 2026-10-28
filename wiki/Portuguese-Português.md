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
