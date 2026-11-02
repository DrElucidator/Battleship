# Batalha por turnos

## Requisitos

### Requisito: Frota adversária válida

O sistema DEVE criar uma frota adversária completa, com cada embarcação oficial posicionada dentro do tabuleiro e sem sobreposição.

#### Cenário: Criar frota do computador

- **DADO** que uma nova partida seja iniciada
- **ENTÃO** o computador possui porta-aviões, encouraçado, cruzador, submarino e destroyer em posições válidas

### Requisito: Ataque por turno

O sistema DEVE permitir ataque apenas ao participante cujo turno está ativo e deve impedir uma coordenada que já tenha sido atacada.

#### Cenário: Jogador ataca o computador

- **DADO** que o turno seja do jogador
- **QUANDO** ele atacar uma coordenada ainda não atacada do tabuleiro adversário
- **ENTÃO** o resultado do ataque é registrado e o turno passa ao computador

### Requisito: Sigilo do tabuleiro adversário

O sistema NÃO DEVE mostrar a posição de uma embarcação adversária que ainda não tenha sido atingida.

#### Cenário: Célula inimiga intacta

- **DADO** que uma coordenada inimiga faça parte de uma embarcação
- **E** não tenha sido atacada
- **ENTÃO** a interface a apresenta como água desconhecida

### Requisito: Encerramento da partida

O sistema DEVE encerrar a partida ao destruir toda a frota de um lado e impedir novos ataques.

#### Cenário: Jogador destrói a última embarcação adversária

- **DADO** que só reste uma posição de uma embarcação adversária
- **QUANDO** o jogador acertar essa posição
- **ENTÃO** o resultado da partida indica vitória do jogador
