# Placar e resumo

## Requisitos

### Requisito: Placar da sessão

O sistema DEVE acumular uma vitória para o vencedor de cada partida concluída e NÃO DEVE registrar uma partida em andamento.

#### Cenário: Registrar vitória do jogador

- **DADO** que o placar tenha zero vitórias
- **QUANDO** a partida terminar com vitória do jogador
- **ENTÃO** o placar mostra uma vitória para o jogador e zero para o computador

### Requisito: Resumo de batalha

O sistema DEVE mostrar o total de ataques, água, acertos e embarcações destruídas para os dois participantes durante a partida.

#### Cenário: Atualizar resumo após ataque

- **DADO** que o jogador tenha atacado uma coordenada adversária
- **ENTÃO** o resumo do jogador reflete o resultado registrado

### Requisito: Resultado explícito

O sistema DEVE apresentar um painel visual de vitória ou derrota quando a partida terminar e impedir novos ataques.

#### Cenário: Vitória do jogador

- **DADO** que a última embarcação adversária tenha sido destruída
- **ENTÃO** o sistema apresenta o painel de vitória e oferece uma nova partida
