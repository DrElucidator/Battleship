# Motor do jogo

## Requisitos

### Requirement: Coordenadas válidas do tabuleiro

O sistema DEVE aceitar somente coordenadas com linhas de A a J e colunas de 1 a 10.

#### Cenário: Criar coordenada válida

- **QUANDO** uma coordenada A1 ou J10 é criada
- **ENTÃO** ela é aceita e pode ser apresentada no formato de linha seguida da coluna

#### Cenário: Rejeitar coordenada fora do tabuleiro

- **QUANDO** uma coordenada usa linha ou coluna fora dos limites
- **ENTÃO** o sistema rejeita sua criação

### Requirement: Posicionamento de embarcações

O sistema DEVE posicionar embarcações da frota oficial em posições consecutivas horizontais ou verticais, sem extrapolar o tabuleiro nem sobrepor outra embarcação.

#### Cenário: Permitir embarcações adjacentes

- **QUANDO** duas embarcações ocupam posições vizinhas sem compartilhar uma célula, inclusive diagonalmente
- **ENTÃO** ambas permanecem posicionadas de forma válida

#### Cenário: Rejeitar sobreposição ou extrapolação

- **QUANDO** um posicionamento contém uma célula já ocupada ou fora do tabuleiro
- **ENTÃO** ele é rejeitado sem modificar o tabuleiro existente

### Requirement: Resolução de ataques

O sistema DEVE registrar uma única tentativa por coordenada e informar água, acerto ou embarcação destruída.

#### Cenário: Atingir a última posição de uma embarcação

- **QUANDO** o ataque acerta a última posição intacta de uma embarcação
- **ENTÃO** o resultado informa embarcação destruída

#### Cenário: Repetir um ataque

- **QUANDO** uma coordenada já atacada é selecionada novamente
- **ENTÃO** o sistema rejeita a tentativa e preserva o histórico de ataques
