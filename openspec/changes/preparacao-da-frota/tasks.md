# Tarefas

## 1. Estrutura e estado da preparação

- [x] 1.1 Criar o componente de preparação e conectá-lo ao shell da aplicação.
- [x] 1.2 Modelar com Signals a embarcação selecionada, a orientação, a mensagem e a projeção das embarcações posicionadas.
- [x] 1.3 Criar testes unitários para o estado de preparação, sem depender do DOM quando possível.

## 2. Tabuleiro do jogador

- [x] 2.1 Renderizar o grid 10 x 10 com rótulos de linha e coluna.
- [ ] 2.2 Exibir embarcações posicionadas e tornar cada célula acessível por teclado e leitor de tela.
- [ ] 2.3 Posicionar a embarcação selecionada ao escolher sua coordenada de origem.
- [ ] 2.4 Exibir falha de validação sem alterar o posicionamento válido já existente.
- [ ] 2.5 Permitir remover uma embarcação posicionada para escolher nova origem ou orientação.

## 3. Painel da frota

- [x] 3.1 Listar porta-aviões, encouraçado, cruzador, submarino e destroyer com seus tamanhos.
- [ ] 3.2 Permitir escolher somente embarcações ainda não posicionadas.
- [x] 3.3 Criar controle acessível para alternar orientação horizontal e vertical.
- [ ] 3.4 Exibir ação de reposicionar para embarcações já posicionadas.

## 4. Progresso e validação

- [ ] 4.1 Informar quantas embarcações faltam posicionar.
- [ ] 4.2 Habilitar "Iniciar batalha" somente com a frota completa.
- [ ] 4.3 Cobrir seleção, orientação, posicionamento, reposicionamento, erro e frota completa com testes.

## 5. Verificação

- [ ] 5.1 Rodar `npm run lint`, `npm test` e `npm run build`.
- [ ] 5.2 Revisar responsividade em tela estreita e larga, navegação por teclado e ausência de overflow horizontal.
- [ ] 5.3 Arquivar a change depois da implementação e revisão final.
