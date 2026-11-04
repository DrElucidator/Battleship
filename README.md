# Batalha Naval

> Jogo de Batalha Naval desenvolvido em Angular, com partidas contra a CPU e partidas locais para dois jogadores.

[![Deploy no GitHub Pages](https://img.shields.io/github/actions/workflow/status/DrElucidator/Battleship/deploy-pages.yml?branch=main&label=deploy&logo=github)](https://github.com/DrElucidator/Battleship/actions/workflows/deploy-pages.yml)
[![Angular](https://img.shields.io/badge/Angular-22.2-DD0031?logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## Acesse a aplicação

**[Jogar Batalha Naval](https://drelucidator.github.io/Battleship/)**

## Sumário

- [Visão geral](#visão-geral)
- [Recursos](#recursos)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Regras principais](#regras-principais)
- [Como executar](#como-executar)
- [Qualidade](#qualidade)
- [Deploy](#deploy)
- [Próximos passos](#próximos-passos)

## Visão geral

Cada participante organiza uma frota em um tabuleiro de 10 x 10 e tenta destruir todas as embarcações adversárias antes de perder a própria frota. A aplicação foi construída como um projeto acadêmico e evoluída para oferecer uma experiência completa de jogo no navegador.

A versão 1.0.0 funciona integralmente no cliente. Não exige conta, API ou banco de dados para iniciar uma partida.

## Recursos

- Partida contra computador com estratégia de busca e perseguição de embarcações atingidas.
- Partida local para dois jogadores, com frotas ocultas e alternância de turnos.
- Posicionamento manual ou automático da frota.
- Cinco embarcações: porta-aviões, encouraçado, cruzador, submarino e destroyer.
- Validação de limites, sobreposição e ataques repetidos.
- Dois tabuleiros visíveis durante a batalha, com estados acessíveis para água, acerto e embarcação destruída.
- Resumo compacto de turno, placar, frotas e última jogada.
- Cronômetro de 90 segundos por turno. O tempo esgotado encerra a partida em favor do adversário.
- Modal de vitória ou derrota com estatísticas da partida.
- Histórico local de partidas e placar persistente.
- Restauração de uma partida em andamento após recarregar a página, quando o tempo do turno ainda não expirou.
- Rotas persistentes e compatíveis com hospedagem estática.

## Tecnologias

| Tecnologia                    | Uso no projeto                                     |
| ----------------------------- | -------------------------------------------------- |
| Angular 22                    | Aplicação web, componentes standalone e roteamento |
| TypeScript                    | Domínio do jogo, contratos e regras de negócio     |
| Signals                       | Estado reativo da interface e da partida           |
| RxJS                          | Fluxos temporizados e eventos reativos             |
| Tailwind CSS 4                | Estilização responsiva                             |
| Lucide Icons                  | Ícones de interface e embarcações                  |
| Vitest                        | Testes unitários do domínio                        |
| ESLint e Prettier             | Análise estática e padronização do código          |
| LocalStorage                  | Persistência local de sessão, placar e histórico   |
| GitHub Actions e GitHub Pages | Build e publicação automática                      |
| OpenSpec                      | Planejamento incremental das mudanças do projeto   |

## Estrutura do projeto

```text
.
├── .github/workflows/
│   └── deploy-pages.yml          # build e publicação automática
├── openspec/                     # planejamento e especificações incrementais
├── public/                       # favicon e recursos estáticos
└── src/
    ├── app/
    │   ├── componentes/          # blocos reutilizáveis da interface
    │   │   ├── batalha/          # tabuleiros, turnos e resultado
    │   │   ├── preparacao-frota/ # posicionamento das embarcações
    │   │   ├── status-frota/     # resumo visual da frota
    │   │   └── troca-jogador/    # transição da partida local
    │   ├── dominio/              # regras puras do jogo e seus testes
    │   ├── modelos/              # contratos de sessão e histórico
    │   ├── paginas/              # início, preparação, partida e histórico
    │   ├── servicos/             # estado, sessão e persistência local
    │   ├── app.config.ts         # provedores e configuração do router
    │   └── app.routes.ts         # rotas da aplicação
    └── main.ts                   # bootstrap Angular
```

A separação entre `dominio`, `servicos`, `componentes` e `paginas` mantém as regras de jogo independentes da interface e facilita a evolução posterior para multiplayer online.

## Regras principais

- Cada jogador possui um tabuleiro de 10 linhas, de A a J, e 10 colunas, de 1 a 10.
- As embarcações ocupam posições consecutivas, horizontal ou verticalmente.
- Embarcações podem encostar, mas não podem se sobrepor.
- Uma coordenada só pode receber um ataque uma vez por participante.
- Cada turno concede um ataque, mesmo em caso de acerto.
- Uma embarcação é destruída quando todas as suas posições são atingidas.
- Vence quem destruir toda a frota adversária primeiro.

## Como executar

Pré-requisitos: Node.js 22 ou superior e npm.

```bash
git clone https://github.com/DrElucidator/Battleship.git
cd Battleship
npm ci
npm start
```

Abra `http://localhost:4200` no navegador.

## Qualidade

```bash
npm test
npm run lint
npm run format:check
npm run build
```

Os testes cobrem as principais regras do domínio, incluindo coordenadas, frota, posicionamento, ataques e encerramento de partida.

## Deploy

Cada push na branch `main` executa o workflow de publicação no GitHub Pages. O build usa a base `/Battleship/` e rotas com hash para permitir atualizar páginas internas sem retornar 404.

O site publicado está em [drelucidator.github.io/Battleship](https://drelucidator.github.io/Battleship/).

## Próximos passos

A versão 1.0.0 consolida a experiência offline. Evoluções planejadas para uma versão futura incluem:

- Multiplayer online com salas de partida.
- Identidade leve por apelido, sem exigir cadastro para começar.
- Persistência compartilhada de partidas e histórico.

## Autor

Desenvolvido por [Alec Luí](https://github.com/DrElucidator) como projeto da Academia do Programador.
