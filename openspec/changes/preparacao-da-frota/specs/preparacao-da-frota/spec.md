# Preparação da frota

## Requisitos

### Requisito: Escolha de embarcação e orientação

O sistema DEVE permitir que o jogador selecione uma embarcação ainda não posicionada e escolha orientação horizontal ou vertical.

#### Cenário: Alternar a orientação

- **DADO** que uma embarcação esteja selecionada
- **QUANDO** o jogador selecionar orientação vertical
- **ENTÃO** o próximo posicionamento calcula as posições na vertical

### Requisito: Posicionamento visual da frota

O sistema DEVE posicionar uma embarcação ao selecionar uma coordenada de origem e refletir as posições ocupadas no tabuleiro.

#### Cenário: Posicionar embarcação em espaço livre

- **DADO** que o cruzador esteja selecionado na orientação horizontal
- **QUANDO** o jogador escolher B2
- **ENTÃO** o tabuleiro exibe B2, B3 e B4 como ocupadas

#### Cenário: Rejeitar posicionamento inválido

- **QUANDO** o jogador tentar posicionar uma embarcação sobre uma posição ocupada ou além do limite
- **ENTÃO** o sistema mostra uma mensagem de erro e mantém o tabuleiro anterior

#### Cenário: Reposicionar uma embarcação

- **DADO** que uma embarcação esteja posicionada e a batalha não tenha começado
- **QUANDO** o jogador escolher a ação de reposicionar
- **ENTÃO** a embarcação deixa o tabuleiro e volta a estar disponível para nova orientação e origem

### Requisito: Início condicionado à frota completa

O sistema DEVE impedir o início da batalha enquanto qualquer embarcação obrigatória não estiver posicionada.

#### Cenário: Completar a frota oficial

- **DADO** que as cinco embarcações diferentes tenham sido posicionadas validamente
- **ENTÃO** o botão "Iniciar batalha" fica habilitado
