# Design técnico

## Contexto

O jogo exige dois tabuleiros de 10 linhas por 10 colunas. Cada um aceita cinco embarcações da frota oficial, posicionadas em linha reta, na horizontal ou vertical. Embarcações podem se tocar, mas nunca compartilhar uma posição. Ataques precisam registrar seu histórico e informar água, acerto ou destruição.

## Objetivos e não objetivos

**Objetivos:** domínio em português, determinístico, imutável quando possível e completamente testável sem Angular ou DOM.

**Não objetivos:** controlar a vez do jogador, criar a frota automática do computador, renderizar tabuleiros, persistir estado ou criar rotas.

## Decisões

### 1. Coordenadas tipadas por linha e coluna

Uma coordenada é representada por linha `A` a `J` e coluna `1` a `10`, em vez de strings livres como `A1`. Isso elimina parsing repetido e permite validar limites no ponto de criação. Uma função de apresentação poderá gerar `A1` somente para a interface futura.

### 2. Tabuleiro como agregado das embarcações e ataques

O `Tabuleiro` guarda posições ocupadas, posições atacadas e consultas sem expor mutações internas. Posicionar uma embarcação inválida não altera o estado anterior. Atacar a mesma coordenada retorna uma falha explícita e não altera o histórico.

### 3. Resultado de ataque explícito

O resultado diferencia `Agua`, `Acerto` e `EmbarcacaoDestruida`. O motor não informa posições intactas de embarcações, preservando a regra de ocultação da frota adversária para a camada de interface.

### 4. Tipos enumerados para valores finitos

`TipoEmbarcacao` e `Orientacao` usam enums. O tamanho pertence a uma definição central da frota, evitando tamanhos repetidos em tela, testes ou lógica de posicionamento.

### 5. Testes primeiro para cada regra

Cada objeto de domínio nasce com casos de sucesso e borda: limites, orientação, sobreposição, ataque repetido e destruição. Os testes ficam próximos ao domínio e usam Vitest, já instalado no workspace.

## Riscos e trade-offs

- O modelo ainda não verifica se a frota está completa. Essa decisão pertence à preparação da frota, que conhece o objetivo de iniciar a batalha.
- O motor cria uma base orientada a objetos pequena. Não introduz serviços Angular nem Signals, pois o domínio deve continuar reutilizável fora da UI.
- Permitir embarcações adjacentes é intencional e será protegido por teste, pois diverge de algumas variantes comerciais do jogo.

## Plano de migração

Não há dados ou comportamento existente para migrar. Caso seja necessário reverter, basta remover os arquivos adicionados nesta change, pois nenhuma tela os consome ainda.
