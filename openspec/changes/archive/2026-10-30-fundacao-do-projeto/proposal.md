# Proposal

## Why

O repositório contém apenas o enunciado do jogo (`README.md`) e as diretrizes técnicas (`AGENTS.md`); não existe aplicação executável. As fases seguintes (domínio do jogo, preparação da frota, batalha, encerramento e polimento responsivo) dependem de um workspace já configurado com a stack obrigatória. Sem essa base, cada fase misturaria decisões de jogabilidade com ajustes de build, estilização e testes, e esse custo seria pago repetidamente.

## What Changes

- Cria o workspace Angular 22.2 com componentes standalone, **sem Zone.js** (zoneless) e usando Signals como modelo padrão de estado.
- Configura Tailwind CSS como camada de estilização e `lucide-angular` para ícones.
- Define os tokens visuais do jogo (cores de água, acerto, afundado, embarcação e célula neutra; espaçamentos e raio de borda) que as fases seguintes reutilizam, em vez de cores espalhadas nos componentes.
- Entrega a página inicial mínima com a identidade "Batalha Naval" e um layout base de tela cheia, sem qualquer regra de jogo.
- Padroniza scripts de instalação, execução, build e testes, com Vitest como runner e uma suíte de exemplo verde.
- Adiciona verificação estática (ESLint + Prettier) para evitar divergência de estilo ao longo de seis changes.
- Documenta no `README.md` como instalar, executar e testar.

**Fora de escopo nesta change:** tabuleiro e coordenadas, posicionamento de frota, turnos e ataques, computador, persistência, roteamento e telas de resultado. Cada um pertence a uma change posterior.

## Capabilities

### New Capabilities

Nenhuma. Esta change é infraestrutura de projeto: não altera comportamento observável do jogo, apenas cria a base sobre a qual as capabilities de jogo (`motor-do-jogo`, `preparacao-da-frota`, `batalha-por-turnos`, `encerramento-da-partida`, `experiencia-de-uso`) serão especificadas. Por isso a change declara `skip_specs: true`.

### Modified Capabilities

Nenhuma. O projeto ainda não possui capabilities em `openspec/specs/`.

## Impact

- **Arquivos novos/modificados:** `package.json`, `angular.json`, `tsconfig*.json`, `src/main.ts`, `src/index.html`, `src/styles.css`, `src/app/**`, `README.md`, arquivos de configuração de lint/formatação.
- **Dependências:** Angular 22.2 (`@angular/core`, `@angular/common`, `@angular/compiler-cli`), `tailwindcss` v4 com `@tailwindcss/postcss`, `lucide-angular`, Vitest (padrão do Angular CLI 22), `@angular-eslint/*`.
- **Fases impactadas:** todas. Os tokens visuais e o layout base definidos aqui são consumidos pela preparação da frota e pela batalha; a política de testes estabelecida aqui define como o motor do jogo será validado.
- **Riscos:** divergência de versão entre o `package.json` e a exigência de Angular `22.2.0`; configuração de Tailwind v4 em projeto Angular (integração via PostCSS) sem precedente no repositório.
