# Proposta

## Por quê

O motor de jogo já valida coordenadas, embarcações e posicionamentos, mas o jogador ainda não tem uma forma visual de preparar a própria frota. Esta etapa transforma as regras puras em uma interação compreensível antes de introduzir a batalha contra o computador.

## Alterações

- Cria a tela de preparação com tabuleiro próprio visível e coordenadas A-J e 1-10.
- Exibe a frota oficial, com tamanho, estado de seleção e confirmação visual das embarcações já posicionadas.
- Permite selecionar uma embarcação, alternar entre orientação horizontal e vertical, escolher a posição inicial no tabuleiro e reposicioná-la antes do início da batalha.
- Apresenta mensagens de validação sem apagar posicionamentos válidos.
- Mantém o botão de iniciar batalha indisponível enquanto a frota não estiver completa e válida.

**Fora de escopo:** criação da frota adversária, turnos, ataques, tabuleiro inimigo, vitória, derrota, nova partida e persistência.

## Capacidades

### Novas capacidades

- `preparacao-da-frota`: preparação visual da frota humana com orientação e posicionamento válidos.

### Capacidades modificadas

Nenhuma.

## Impacto

- **Arquivos afetados:** componentes visuais, estado de preparação, estilos e testes de interação.
- **Dependências:** nenhuma nova biblioteca é necessária. Signals, Tailwind e Lucide já fazem parte da base.
- **Dependência de domínio:** `Tabuleiro`, `Embarcacao`, `Coordenada`, `Orientacao` e `frotaOficial`.
- **Risco principal:** sincronizar a mutação do tabuleiro de domínio com a atualização reativa da interface. O design prevê Signals para expor uma projeção imutável do estado após cada ação.
