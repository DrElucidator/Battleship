import { Coordenada } from './coordenada';
import { Embarcacao } from './embarcacao';
import { TipoEmbarcacao } from './frota';
import { Orientacao } from './orientacao';
import { Partida, ResultadoPartida, TurnoPartida } from './partida';
import { Tabuleiro } from './tabuleiro';

describe('Partida', () => {
  it('deve alternar o turno após o jogador atacar água', () => {
    const partida = criarPartida();

    const jogada = partida.atacarComputador(new Coordenada('J', 10));

    expect(jogada.atacante).toBe(TurnoPartida.Jogador);
    expect(jogada.coordenada.paraTexto()).toBe('J10');
    expect(partida.turnoAtual).toBe(TurnoPartida.Computador);
  });

  it('deve alternar o turno do jogador após um acerto', () => {
    const partida = criarPartida();

    partida.atacarComputador(new Coordenada('B', 1));

    expect(partida.turnoAtual).toBe(TurnoPartida.Computador);
  });

  it('deve impedir o jogador de atacar fora do seu turno', () => {
    const partida = criarPartida();
    partida.atacarComputador(new Coordenada('J', 10));

    expect(() => partida.atacarComputador(new Coordenada('J', 9))).toThrow(
      'Não é o turno de jogador.',
    );
  });

  it('deve sortear uma coordenada ainda não atacada para o computador', () => {
    const partida = criarPartida();
    partida.atacarComputador(new Coordenada('J', 10));

    const jogada = partida.atacarJogador(() => 0);

    expect(jogada.atacante).toBe(TurnoPartida.Computador);
    expect(jogada.coordenada.paraTexto()).toBe('A1');
    expect(partida.turnoAtual).toBe(TurnoPartida.Jogador);
  });

  it('deve declarar vitória do jogador ao destruir toda a frota adversária', () => {
    const tabuleiroJogador = criarTabuleiroComDestroyer('A', 1);
    const tabuleiroComputador = criarTabuleiroComDestroyer('B', 1);
    const partida = new Partida(tabuleiroJogador, tabuleiroComputador);

    partida.atacarComputador(new Coordenada('B', 1));
    partida.atacarJogador(() => 0.5);
    partida.atacarComputador(new Coordenada('B', 2));

    expect(partida.resultado).toBe(ResultadoPartida.VitoriaJogador);
    expect(partida.encerrada).toBe(true);
    expect(() => partida.atacarJogador()).toThrow('A partida já foi encerrada.');
  });

  it('deve informar a embarcação afundada na jogada final', () => {
    const tabuleiroJogador = criarTabuleiroComDestroyer('A', 1);
    const tabuleiroComputador = criarTabuleiroComDestroyer('B', 1);
    const partida = new Partida(tabuleiroJogador, tabuleiroComputador);

    partida.atacarComputador(new Coordenada('B', 1));
    partida.atacarJogador(() => 0.5);
    const jogadaFinal = partida.atacarComputador(new Coordenada('B', 2));

    expect(jogadaFinal.embarcacaoAfundada).toBe(TipoEmbarcacao.Destroyer);
  });

  it('deve declarar derrota do jogador ao destruir toda a sua frota', () => {
    const tabuleiroJogador = criarTabuleiroComDestroyer('A', 1);
    const tabuleiroComputador = criarTabuleiroComDestroyer('B', 1);
    const partida = new Partida(tabuleiroJogador, tabuleiroComputador);

    partida.atacarComputador(new Coordenada('J', 10));
    partida.atacarJogador(() => 0);
    partida.atacarComputador(new Coordenada('J', 9));
    partida.atacarJogador(() => 0);

    expect(partida.resultado).toBe(ResultadoPartida.VitoriaComputador);
    expect(partida.encerrada).toBe(true);
  });
});

function criarPartida(): Partida {
  return new Partida(criarTabuleiroComDestroyer('A', 1), criarTabuleiroComDestroyer('B', 1));
}

function criarTabuleiroComDestroyer(linha: string, coluna: number): Tabuleiro {
  const tabuleiro = new Tabuleiro();
  tabuleiro.posicionarEmbarcacao(
    new Embarcacao(TipoEmbarcacao.Destroyer, new Coordenada(linha, coluna), Orientacao.Horizontal),
  );

  return tabuleiro;
}
