# Design técnico

## Contexto

O domínio já sabe atacar um tabuleiro e identificar água, acerto e embarcação destruída. A batalha precisa coordenar dois tabuleiros sem tornar a interface responsável pelas regras de turno ou pela frota adversária.

## Decisões

### 1. Partida como coordenadora de domínio

Uma classe `Partida` ficará em `dominio/` e será a única responsável por guardar os dois tabuleiros, o turno atual e o resultado. Componentes chamam métodos de intenção e projetam o estado retornado por ela.

### 2. Frota adversária determinística para testes

A criação da frota do computador recebe uma função de aleatoriedade opcional. Em produção ela usa `Math.random`; em testes, uma sequência controlada torna o posicionamento verificável sem testes frágeis.

### 3. Turno explícito e ataque protegido

O jogador ataca somente durante seu turno. Após uma tentativa válida, o turno passa ao computador, que escolhe uma coordenada ainda não atacada. Quando a partida termina, nenhum novo ataque é aceito.

### 4. Informação assimétrica na interface

O tabuleiro do jogador mostra sua frota. O tabuleiro adversário mostra apenas o resultado dos ataques efetuados. Células inimigas intactas não revelam embarcação.

### 5. Computador simples e confiável nesta etapa

O computador escolhe aleatoriamente entre coordenadas ainda disponíveis. Estratégia de perseguição após acerto é uma melhoria futura, pois não muda as regras fundamentais da partida.

## Riscos e trade-offs

- O posicionamento aleatório pode tentar posições inválidas. A fábrica deve repetir a escolha até posicionar toda a frota, com limite defensivo para evitar laço infinito em alterações futuras.
- Automatizar imediatamente a resposta do computador diminui o controle de testes de interface. O domínio expõe a ação separadamente e o componente decide quando chamá-la.
- A interface terá dois tabuleiros na mesma rota. Roteamento só será introduzido se uma nova tela real passar a exigir navegação dedicada.
