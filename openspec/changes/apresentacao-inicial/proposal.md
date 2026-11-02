# Proposta

## Por quê

O enunciado pede que a partida comece a partir de uma apresentação inicial. A aplicação abria diretamente na preparação de frota, sem contextualizar objetivo, regras principais ou a próxima ação.

## Alterações

- Cria uma tela inicial com objetivo e fluxo resumido da partida.
- Oferece uma ação explícita para iniciar a preparação da frota.
- Mantém o retorno de uma nova partida diretamente na preparação, evitando uma etapa extra após o resultado.
- Adiciona cobertura de teste para a transição apresentação para preparação.

**Fora de escopo:** tutorial interativo, configurações de partida, seleção de dificuldade e histórico de partidas.

## Capacidades

### Novas capacidades

- `apresentacao-inicial`: ponto de entrada claro para o jogo e sua preparação.

## Impacto

- **Arquivos afetados:** shell da aplicação, novo componente de apresentação, testes e versão do projeto.
- **Dependências:** nenhuma biblioteca nova.
- **Risco principal:** preservar o fluxo já validado de preparação, batalha, resultado e nova partida.
