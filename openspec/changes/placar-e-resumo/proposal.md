# Proposta

## Por quê

A batalha já pode ser concluída, mas o resultado aparece apenas como uma mensagem transitória. Jogadores que desejarem várias partidas precisam de um placar acumulado, de um resumo legível do confronto e de um encerramento visual inequívoco.

## Alterações

- Cria um placar de sessão que registra vitórias do jogador e do computador.
- Exibe um resumo em tempo real com ataques, água, acertos e embarcações destruídas de cada lado.
- Apresenta um painel de vitória ou derrota ao encerrar a partida.
- Permite iniciar uma nova partida preservando o placar e retornando à preparação da frota.

**Fora de escopo:** salvar placar entre sessões, ranking, áudio, animações complexas e multiplayer.

## Capacidades

### Novas capacidades

- `placar-e-resumo`: acompanhamento da sessão e encerramento claro de cada partida.

### Capacidades modificadas

- `batalha-por-turnos`: passa a comunicar a conclusão da partida ao shell, que atualiza o placar uma única vez.

## Impacto

- **Arquivos afetados:** domínio de placar, shell, componente de batalha, estilos e testes.
- **Dependências:** nenhuma biblioteca nova.
- **Risco principal:** contabilizar o resultado uma única vez mesmo que a interface seja reavaliada por Signals.
