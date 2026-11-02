# Proposta

## Por quê

As células ocupadas usavam o mesmo ícone para toda a frota. Isso deixava a preparação e o tabuleiro do jogador menos informativos, principalmente depois de posicionar embarcações próximas.

## Alterações

- Representa cada tipo de embarcação com um ícone próprio na biblioteca Lucide já instalada.
- Mostra os mesmos ícones nos cartões da frota durante a preparação.
- Mantém a representação genérica no tabuleiro adversário, preservando a informação assimétrica da partida.
- Adiciona testes para o mapeamento entre coordenada e tipo de embarcação.

**Fora de escopo:** imagens externas, sprites, animações de embarcação ou exposição da frota do computador.

## Capacidades

### Novas capacidades

- `identidade-visual-da-frota`: diferenciação visual e acessível das embarcações do jogador.

## Impacto

- **Arquivos afetados:** componentes de preparação e batalha, testes e versão da aplicação.
- **Dependências:** Lucide Angular, já presente no projeto.
- **Risco principal:** manter os ícones apenas como representação visual, sem acoplar regras de domínio à interface.
