# Design técnico

## Contexto

Esta é a primeira tela interativa do jogo. O domínio já protege limites e sobreposição, portanto a interface não replica regras. Ela coleta a intenção do jogador, cria a embarcação correspondente e delega o posicionamento ao `Tabuleiro`.

## Objetivos e não objetivos

**Objetivos:** uma preparação legível em desktop e celular, feedback textual de erro, controles acessíveis de orientação e estado visual claro para cada embarcação.

**Não objetivos:** arrastar e soltar, posicionamento aleatório, animações complexas ou iniciar uma batalha real.

## Decisões

### 1. Um componente de preparação coordenado pelo shell

`App` continua como shell visual. Um componente de preparação recebe e apresenta o estado necessário, mantendo a regra de jogo fora do template. O primeiro componente pode nascer em `src/app/componentes/preparacao-frota/` sem criar roteamento antes de existir uma segunda tela real.

### 2. Signals para o estado da interface

Signals guardam a embarcação selecionada, orientação, mensagem e uma lista imutável das embarcações posicionadas. O `Tabuleiro` continua sendo a fonte de verdade para validação; após cada ação válida, a projeção do Signal é atualizada a partir de `obterEmbarcacoes()`.

### 3. Posicionamento por clique na origem

O jogador seleciona uma embarcação e clica na coordenada de origem. A orientação escolhida determina as posições seguintes. Essa interação funciona bem em mouse e toque e evita a complexidade prematura de arrastar e soltar.

### 4. Progresso sem depender apenas de cores

Cada embarcação mostra nome, tamanho e rótulo de estado. Células ocupadas usam forma e texto acessível, além da cor. Erros são exibidos em uma região de status legível por leitores de tela.

### 5. Início bloqueado de forma explícita

O botão "Iniciar batalha" só fica habilitado quando todas as cinco embarcações diferentes estiverem posicionadas. Nesta change, a ação informa que a batalha será implementada depois, sem criar transição falsa de tela.

### 6. Reposicionamento antes da batalha

Uma embarcação já posicionada pode ser removida da preparação e selecionada novamente. A interface reconstrói o estado de preparação com as demais embarcações válidas, permitindo que a nova origem e orientação sejam escolhidas sem perder a frota inteira.

## Riscos e trade-offs

- Reposicionar uma embarcação exige reconstruir a projeção de preparação de forma consistente. A operação fica disponível apenas antes do início da batalha, período em que ainda não existem ataques no tabuleiro.
- O domínio não impõe uma frota completa com tipos únicos. A interface assume essa responsabilidade de fluxo, selecionando apenas embarcações ainda não posicionadas.
- Usar um Signal de projeção exige atualização explícita depois de `posicionarEmbarcacao`, mas preserva o domínio independente do Angular.

## Plano de migração

Não há dados persistidos. A change é revertível sem impacto no motor, pois adiciona apenas uma camada de interface sobre APIs de domínio já existentes.
