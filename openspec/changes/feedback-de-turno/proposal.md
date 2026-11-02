# Proposta

## Por quê

O motor já alterna corretamente os turnos, mas a resposta do computador ocorria imediatamente. Isso dificultava perceber a sequência jogador, processamento e resposta, além de tornar cada ataque pouco expressivo visualmente.

## Alterações

- Exibe um estado explícito enquanto o computador escolhe a resposta.
- Bloqueia novos ataques do jogador durante esse intervalo curto.
- Destaca visualmente a última célula atacada em cada tabuleiro.
- Mantém mensagens acessíveis que descrevem a ação e seu resultado.
- Cancela a resposta agendada se o componente for removido.

**Fora de escopo:** animações com áudio, cronômetro de partida, persistência, partidas remotas e multiplayer.

## Capacidades

### Novas capacidades

- `feedback-de-turno`: transições visuais e mensagens durante a alternância entre jogador e computador.

## Impacto

- **Arquivos afetados:** componente de batalha, estilos, testes de componente e versão da aplicação.
- **Dependências:** nenhuma biblioteca nova.
- **Risco principal:** manter a resposta do computador bloqueada apenas durante o intervalo visual, sem alterar as regras de turno do domínio.
