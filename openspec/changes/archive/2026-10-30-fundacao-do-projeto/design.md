# Design

## Context

Ver `proposal.md` - Why. O que importa para o desenho:

- Repositório sem código de aplicação; apenas `README.md` (enunciado) e `AGENTS.md` (restrições).
- Restrições obrigatórias: Angular `22.2.0`, zoneless, componentes standalone, Signals, Tailwind CSS, Lucide Icons, textos de interface em português, nomes de código em português seguindo convenções da linguagem.
- O `AGENTS.md` exige entregas em fases; esta é a primeira de seis, e as cinco seguintes consomem o que for decidido aqui (tokens visuais, estrutura de pastas, política de testes).
- `openspec/config.yaml` não define `context` nem `rules` adicionais.

Versões verificadas no registro npm no momento do planejamento: `@angular/core` 22.2.4, `@angular/cli` 22.2.5, `tailwindcss`/`@tailwindcss/postcss` 4.3.3, `@lucide/angular` 1.65.0.

## Goals / Non-Goals

**Goals:**

- Workspace executável com a stack obrigatória, sem configuração manual pendente.
- Conjunto mínimo e semântico de tokens visuais que as fases de preparação e batalha possam consumir sem inventar cores locais.
- Estrutura de pastas e convenção de nomes que não precisem ser reorganizadas nas fases seguintes.
- Rede de segurança de qualidade (teste de fumaça + lint/format) ativa antes da primeira regra de jogo ser escrita.

**Non-Goals:**

- Qualquer modelagem de tabuleiro, coordenada, embarcação ou partida.
- Roteamento, telas de jogo, camada de serviços de jogo.
- Biblioteca de componentes de UI (Material/CDK/PrimeNG) — o jogo tem poucos elementos e Tailwind basta.
- SSR/prerender, PWA, i18n, Docker, CI remota.

## Decisions

### 1. Scaffold com `ng new --style tailwind --zoneless --test-runner vitest`

Usar o schematic oficial em vez de montar a configuração à mão: ele já instala `tailwindcss`, `@tailwindcss/postcss` e `postcss`, gera `.postcssrc.json` e cria o projeto standalone/zoneless por padrão.

- **Alternativas:** configuração manual de PostCSS (mais passos, mesma saída); `ng add @angular/material` (descartado, ver Non-Goals).
- **Consequência:** `styles.css` deve conter `@import "tailwindcss";`. Se o schematic não injetar esse import, ele é adicionado manualmente — verificado no primeiro item da lista de tasks.
- **Versão:** `@angular/*` em `~22.2.0` (resolve 22.2.4, ficando dentro da série `22.2.x` exigida) em vez de `latest`, que poderia saltar para 23.

### 2. Lucide via `@lucide/angular`, não `lucide-angular`

`lucide-angular@1.0.0` declara peer `@angular/core: 13.x - 21.x` — não cobre Angular 22. `@lucide/angular@1.65.0` declara `>=17.0.0` e expõe ícones como componentes standalone signal-based, compatíveis com zoneless.

- **Alternativas:** manter `lucide-angular` (quebraria a instalação por peer dependency); SVG inline escrito à mão (perde tree-shaking e padronização).
- **Consequência:** import por ícone (`import { LucideShip } from '@lucide/angular'`) e, se necessário, `provideLucideIcons()` para registro dinâmico. Nesta fase, um único ícone no shell valida a integração.

### 3. Tokens visuais semânticos em `@theme` do Tailwind v4

Definir variáveis de tema no CSS (`--color-agua`, `--color-acerto`, `--color-afundado`, `--color-embarcacao`, `--color-celula`, `--color-celula-borda`, `--color-fundo`, `--color-texto`) e expô-las como utilitários (`bg-agua`, `text-acerto`).

- **Alternativas:** paleta padrão do Tailwind espalhada nos templates (divergiria entre seis changes e dificultaria o requisito de não depender só de cor); CSS custom properties fora do tema (perde autocomplete e consistência de escala).
- **Consequência:** nomes de token em português, alinhados ao `AGENTS.md`. A fase 6 ajusta contraste alterando o token, não cada componente.
- **Limite deliberado:** somente os tokens que o shell usa agora + os já previstos para o jogo; tokens novos entram quando a fase que os usa for implementada.

### 4. Estrutura de pastas em português, por papel

```
src/app/
  app.ts / app.html / app.css     shell (header + main)
  componentes/                    componentes visuais reutilizáveis (fases 3+)
  servicos/                       coordenação e estado (fase 4+)
  dominio/                        regras puras, sem imports de Angular (fase 2)
```

- **Alternativas:** `core/`, `shared/`, `features/` (padrão Angular em inglês — contraria a diretriz de nomes em português).
- **Consequência:** `dominio/` nasce vazio nesta fase e é a fronteira que garante a testabilidade do motor do jogo. Criar a pasta agora evita que as regras nasçam dentro de componentes.

### 5. Sem roteamento nesta fase

O shell é um único componente com `<header>` e `<main>`. A troca de telas (apresentação → preparação → batalha → resultado) será resolvida por um signal de fase na change de preparação.

- **Alternativas:** `provideRouter` com rotas por fase (adiciona guardas de rota e perda de estado na navegação para um jogo single-page).
- **Consequência:** se a fase 3 concluir que rotas são necessárias, o custo de adicioná-las é baixo; o inverso não é verdadeiro.

### 6. Qualidade: Vitest (padrão do CLI) + ESLint/Prettier

Manter o runner padrão e adicionar `@angular-eslint` + Prettier com configuração mínima, sem regras customizadas.

- **Alternativas:** Karma (padrão legado); sem lint (viável, mas seis changes em sequência tendem a divergir de estilo e a diretriz de nomes em português é difícil de verificar sem lint).
- **Consequência:** um teste de fumaça do shell garante que a suíte roda verde desde o início; os testes de domínio da fase 2 usam o mesmo runner, sem setup adicional.

## Risks / Trade-offs

- **`--style tailwind` gerar configuração parcial (sem `@import "tailwindcss"` em `styles.css`)** → verificar o arquivo logo após o scaffold e adicionar o import manualmente; validar aplicando uma classe utilitária visível no shell.
- **Peer dependency de ícones quebrar a instalação** → já mitigado ao escolher `@lucide/angular`; validar com `npm ls @lucide/angular`.
- **Drift de versão do Angular (22.2.4 vs exigência 22.2.0)** → fixar `~22.2.0` no `package.json` e registrar a versão resolvida no README de desenvolvimento.
- **Tokens virarem um sistema de design grande demais para um jogo de 100 células** → limitar a paleta ao que o shell usa e ao que a próxima fase já sabe que precisa; nada de tipografia/escala completa.
- **Custo de cerimônia de lint em projeto acadêmico** → configuração mínima (recomendado + Prettier), sem regras de estilo próprias.
- **Fase 1 sem capability spec** → aceitável porque não há comportamento observável de jogo; a primeira capability (`motor-do-jogo`) nasce na fase 2. Trade-off: a change não protege contra regressão visual do shell, coberto apenas pelo teste de fumaça.

## Migration Plan

Projeto greenfield: não há migração de dados nem de código existente. A change entra como um único commit de fundação; rollback é reverter o commit, já que nenhuma fase posterior pode depender dela antes de existir. Nenhum artefato publicado ou serviço em produção é afetado.

## Open Questions

- Se a fase 3 precisar de roteamento real (deep-link por fase), a decisão será tomada lá; não altera nada desta change.
- Se o tema escuro for desejado, ele é viável via tokens já definidos em `@theme`, mas não é requisito do enunciado e fica fora desta fase.
