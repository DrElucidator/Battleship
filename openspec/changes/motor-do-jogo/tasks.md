# Tarefas

## 1. Modelos fundamentais

- [x] 1.1 Criar `Coordenada` com validação de linha e coluna e representação textual.
- [x] 1.2 Criar `Orientacao`, `TipoEmbarcacao` e a definição central da frota oficial.
- [x] 1.3 Criar `Embarcacao` capaz de calcular as posições consecutivas a partir de uma origem e orientação.
- [x] 1.4 Escrever os testes de limites, tamanhos e posições horizontais e verticais.

## 2. Tabuleiro e posicionamento

- [x] 2.1 Criar `Tabuleiro` vazio de 10 x 10 posições.
- [x] 2.2 Posicionar embarcação somente quando todas as posições estiverem dentro do tabuleiro e livres.
- [x] 2.3 Garantir que tentativas inválidas mantenham o estado válido anterior.
- [x] 2.4 Cobrir sobreposição, bordas e adjacência permitida com testes.

## 3. Ataques

- [x] 3.1 Registrar ataque em coordenada ainda não atacada.
- [x] 3.2 Retornar água, acerto ou embarcação destruída conforme o estado do tabuleiro.
- [x] 3.3 Impedir ataques repetidos sem alterar o histórico.
- [x] 3.4 Cobrir cada resultado e caso inválido com testes.

## 4. Verificação

- [ ] 4.1 Rodar `npm run lint`, `npm test` e `npm run build`.
- [ ] 4.2 Revisar que nenhum componente Angular ou regra de turno foi criado nesta change.
- [ ] 4.3 Arquivar a change somente depois de a implementação e a revisão estarem concluídas.
