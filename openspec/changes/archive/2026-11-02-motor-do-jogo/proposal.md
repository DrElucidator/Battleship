# Proposta

## Por quê

O projeto já possui a base Angular, mas ainda não tem regras capazes de representar um tabuleiro, uma embarcação ou um ataque. Sem um motor puro e testado, as próximas telas correriam o risco de concentrar regras de jogo nos componentes e de apresentar comportamentos inconsistentes.

## Alterações

- Cria o domínio puro do Batalha Naval, sem imports de Angular.
- Modela coordenadas, orientações, embarcações, posições do tabuleiro e resultados de ataque.
- Define a frota oficial e valida posicionamentos dentro de um tabuleiro 10 x 10, sem sobreposição e permitindo embarcações encostadas.
- Permite registrar ataques válidos, identificar água, acerto e embarcação destruída, sem repetir coordenadas atacadas.
- Cobre todas as regras com testes unitários Vitest.

**Fora de escopo:** interface de posicionamento, geração da frota do computador, turnos, sorteio de ataques, condição de vitória, reinício e componentes Angular de jogo. Esses itens pertencem às changes seguintes.

## Capacidades

### Novas capacidades

- `motor-do-jogo`: regras puras para representar e validar o estado estático do tabuleiro e resolver ataques.

### Capacidades modificadas

Nenhuma.

## Impacto

- **Arquivos afetados:** novos arquivos em `src/app/dominio/` e testes correspondentes.
- **Dependências:** nenhuma dependência adicional.
- **Fases seguintes:** preparação da frota consome o posicionamento; batalha por turnos consome o ataque e seus resultados.
- **Risco principal:** ambiguidade entre estado de posição e resultado do ataque. O design separa esses conceitos para preservar a ocultação da frota inimiga na interface futura.
