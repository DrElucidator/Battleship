# Design técnico

## Decisões

### 1. Placar separado de Partida

`Partida` continua representando apenas um confronto. `Placar` representa a sessão e recebe somente resultados finais válidos, o que permite começar outra partida sem preservar ataques ou tabuleiros antigos.

### 2. Shell como dono da sessão

`App` mantém o placar em Signal e cria uma nova `Partida` sempre que o jogador concluir uma preparação. O componente de batalha comunica resultado final por output, sem atualizar o placar diretamente.

### 3. Resumo derivado do histórico existente

O resumo não duplica contadores mutáveis. Ele calcula ataques, água, acertos e embarcações destruídas a partir de `obterJogadas()` da partida, evitando divergência entre a interface e o domínio.

### 4. Encerramento acessível e com animação discreta

Ao finalizar, um painel com `role="dialog"` mostra vitória ou derrota, recebe foco visual e usa apenas transição CSS curta. Não haverá temporizador ou fluxo automático nesta etapa.
