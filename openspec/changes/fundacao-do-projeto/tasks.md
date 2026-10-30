# Tasks

## 1. Criar o workspace Angular

- [ ] 1.1 Executar `ng new` na raiz com standalone, `--zoneless`, `--style tailwind`, `--test-runner vitest`, `--routing false`, `--ssr false`; verificar que `package.json`, `angular.json`, `src/main.ts` e `src/app/app.ts` existem e que `zone.js` **não** aparece nos `polyfills` de `angular.json`.
- [ ] 1.2 Fixar as dependências `@angular/*` em `~22.2.0` e remover pacotes não usados pelo scaffold; verificar com `npm install` sem erro e `npm ls @angular/core` resolvendo 22.2.x.
- [ ] 1.3 Confirmar `npm run build` e `npm test` verdes no estado gerado (se falharem, não avançar para os próximos grupos).
- [ ] 1.4 Registrar no `README.md` a seção de desenvolvimento (instalar, executar, testar, build) e verificar rodando os comandos exatamente como documentados.

## 2. Configurar o Tailwind CSS

- [ ] 2.1 Verificar `.postcssrc.json` registrando `@tailwindcss/postcss` e garantir `@import "tailwindcss";` no topo de `src/styles.css`; adicionar o que faltar e confirmar com `npm run build` que o CSS gerado contém utilitários do Tailwind.
- [ ] 2.2 Confirmar que `tailwindcss`, `@tailwindcss/postcss` e `postcss` estão em `devDependencies` na série 4.x; verificar com `npm ls tailwindcss`.

## 3. Definir os tokens visuais

- [ ] 3.1 Declarar em `src/styles.css` o bloco `@theme` com os tokens semânticos (`fundo`, `texto`, `celula`, `celula-borda`, `agua`, `acerto`, `afundado`, `embarcacao`); verificar que `npm run build` aceita o bloco e que `bg-fundo`/`text-texto` aparecem no CSS compilado.
- [ ] 3.2 Garantir que nenhuma cor hexadecimal é usada diretamente em templates desta change; verificar com busca por `#` em `src/app/**/*.html` retornando zero ocorrências.

## 4. Construir o shell da aplicação

- [ ] 4.1 Instalar `@lucide/angular` e verificar com `npm ls @lucide/angular` que a árvore resolve sem conflito de peer dependency.
- [ ] 4.2 Implementar o shell (`app.ts`/`app.html`) com cabeçalho contendo o nome "Batalha Naval", um ícone Lucide e uma área `<main>` vazia reservada às fases seguintes; verificar visualmente em `npm start` que cabeçalho, ícone e área de conteúdo aparecem.
- [ ] 4.3 Ajustar `src/index.html` para `lang="pt-BR"` e título "Batalha Naval"; verificar no HTML servido (`curl` ou DevTools) que ambos estão presentes.
- [ ] 4.4 Aplicar layout responsivo mínimo (container centralizado, sem overflow horizontal); verificar em 360px e 1280px que não há barra de rolagem horizontal.

## 5. Estabelecer a qualidade do código

- [ ] 5.1 Adicionar `@angular-eslint` e Prettier com configuração padrão mínima (sem regras customizadas); verificar que `npm run lint` executa e termina sem erros no código do shell.
- [ ] 5.2 Criar teste de fumaça do shell (renderiza e contém "Batalha Naval"); verificar que `npm test` passa com o teste novo.
- [ ] 5.3 Documentar no `README.md` os comandos de lint e formatação; verificar executando-os como escritos.
- [ ] 5.4 Criar `src/app/dominio/` com um `README.md` de uma linha explicando que a pasta guarda regras puras sem imports de Angular; verificar que a pasta existe e que o `npm run build` continua verde.

## 6. Integração final

- [ ] 6.1 Rodar `npm run lint`, `npm test` e `npm run build` em sequência; verificar que os três terminam com sucesso e que `dist/` é gerado.
- [ ] 6.2 Abrir o build de produção e conferir manualmente: nome do jogo, ícone, layout sem overflow em 360px e 1280px, console sem erros, e ausência de qualquer elemento de tabuleiro ou regra de jogo.
- [ ] 6.3 Confirmar no `git status` que nenhum arquivo de código de jogo (tabuleiro, frota, ataque) foi criado nesta change.

## Workflow follow-up

- Arquivar a change após a revisão das fases seguintes confirmar que a base atende ao `motor-do-jogo`.
- Verificar o resultado arquivado.
