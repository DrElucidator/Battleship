# Proposta

## Por quê

A frota do jogador já pode ser preparada visualmente, mas a partida ainda não começa. Esta etapa conecta o motor de ataques a uma experiência de batalha contra o computador, com dois tabuleiros, turnos explícitos e encerramento confiável.

## Alterações

- Cria uma partida que mantém tabuleiros independentes do jogador e do computador.
- Posiciona a frota adversária automaticamente, respeitando limites e sobreposição.
- Alterna turnos entre jogador e computador e impede ataques fora do turno.
- Exibe ataques, água, acertos e embarcações destruídas sem revelar a frota inimiga antes do acerto.
- Detecta vitória ou derrota quando toda a frota de um lado for destruída.

**Fora de escopo:** animações de combate, dificuldade configurável, persistência, histórico de partidas, placar e multiplayer.

## Capacidades

### Novas capacidades

- `batalha-por-turnos`: partida local contra o computador, com ataques e resultado final.

### Capacidades modificadas

- `preparacao-da-frota`: a ação de iniciar batalha entrega a frota preparada para a partida, em vez de apenas apresentar uma mensagem.

## Impacto

- **Arquivos afetados:** domínio de partida, componentes de batalha, shell da aplicação, estilos e testes.
- **Dependências:** nenhuma biblioteca adicional é necessária.
- **Dependência de domínio:** `Tabuleiro`, `Embarcacao`, `Coordenada`, `ResultadoAtaque` e `frotaOficial`.
- **Risco principal:** separar o estado puro da partida da atualização reativa da interface para evitar que regras de turno migrem para o template.
