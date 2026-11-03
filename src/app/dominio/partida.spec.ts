import { Coordenada } from './coordenada';
import { Embarcacao } from './embarcacao';
import { TipoEmbarcacao } from './frota';
import { Orientacao } from './orientacao';
import { MotivoEncerramentoPartida, Partida, ResultadoPartida } from './partida';
import { ParticipantePartida } from './participante';
import { Tabuleiro } from './tabuleiro';

describe('Partida', () => {
  it('deve alternar o turno após o jogador atacar água', () => {
    const partida = criarPartida();

    const jogada = partida.atacar(ParticipantePartida.JogadorUm, new Coordenada('J', 10));

    expect(jogada.atacante).toBe(ParticipantePartida.JogadorUm);
    expect(jogada.coordenada.paraTexto()).toBe('J10');
    expect(partida.turnoAtual).toBe(ParticipantePartida.JogadorDois);
  });

  it('deve restaurar tabuleiros e jogadas sem perder o turno atual', () => {
    const tabuleiroJogadorUm = criarTabuleiroComDestroyer('A', 1);
    const tabuleiroJogadorDois = criarTabuleiroComDestroyer('B', 1);
    const partidaOriginal = new Partida(tabuleiroJogadorUm, tabuleiroJogadorDois);

    partidaOriginal.atacar(ParticipantePartida.JogadorUm, new Coordenada('B', 1));
    partidaOriginal.atacar(ParticipantePartida.JogadorDois, new Coordenada('J', 10));

    const partidaRestaurada = Partida.restaurar(
      criarTabuleiroComDestroyer('A', 1),
      criarTabuleiroComDestroyer('B', 1),
      partidaOriginal.obterJogadas(),
    );

    expect(partidaRestaurada.obterJogadas()).toHaveLength(2);
    expect(partidaRestaurada.turnoAtual).toBe(ParticipantePartida.JogadorUm);
    expect(partidaRestaurada.obterTabuleiro(ParticipantePartida.JogadorDois).obterAtaques()).toHaveLength(1);
  });

  it('deve alternar o turno do jogador após um acerto', () => {
    const partida = criarPartida();

    partida.atacar(ParticipantePartida.JogadorUm, new Coordenada('B', 1));

    expect(partida.turnoAtual).toBe(ParticipantePartida.JogadorDois);
  });

  it('deve impedir o jogador de atacar fora do seu turno', () => {
    const partida = criarPartida();
    partida.atacar(ParticipantePartida.JogadorUm, new Coordenada('J', 10));

    expect(() => partida.atacar(ParticipantePartida.JogadorUm, new Coordenada('J', 9))).toThrow(
      'Não é o turno de jogador 1.',
    );
  });

  it('deve permitir que o segundo participante ataque o tabuleiro adversário', () => {
    const partida = criarPartida();
    partida.atacar(ParticipantePartida.JogadorUm, new Coordenada('J', 10));

    const jogada = partida.atacar(ParticipantePartida.JogadorDois, new Coordenada('A', 1));

    expect(jogada.atacante).toBe(ParticipantePartida.JogadorDois);
    expect(jogada.coordenada.paraTexto()).toBe('A1');
    expect(partida.turnoAtual).toBe(ParticipantePartida.JogadorUm);
  });

  it('deve declarar vitória do jogador ao destruir toda a frota adversária', () => {
    const tabuleiroJogador = criarTabuleiroComDestroyer('A', 1);
    const tabuleiroComputador = criarTabuleiroComDestroyer('B', 1);
    const partida = new Partida(tabuleiroJogador, tabuleiroComputador);

    partida.atacar(ParticipantePartida.JogadorUm, new Coordenada('B', 1));
    partida.atacar(ParticipantePartida.JogadorDois, new Coordenada('J', 10));
    partida.atacar(ParticipantePartida.JogadorUm, new Coordenada('B', 2));

    expect(partida.resultado).toBe(ResultadoPartida.VitoriaJogadorUm);
    expect(partida.encerrada).toBe(true);
    expect(() => partida.atacar(ParticipantePartida.JogadorDois, new Coordenada('A', 1))).toThrow(
      'A partida já foi encerrada.',
    );
  });

  it('deve informar a embarcação afundada na jogada final', () => {
    const tabuleiroJogador = criarTabuleiroComDestroyer('A', 1);
    const tabuleiroComputador = criarTabuleiroComDestroyer('B', 1);
    const partida = new Partida(tabuleiroJogador, tabuleiroComputador);

    partida.atacar(ParticipantePartida.JogadorUm, new Coordenada('B', 1));
    partida.atacar(ParticipantePartida.JogadorDois, new Coordenada('J', 10));
    const jogadaFinal = partida.atacar(ParticipantePartida.JogadorUm, new Coordenada('B', 2));

    expect(jogadaFinal.embarcacaoAfundada).toBe(TipoEmbarcacao.Destroyer);
  });

  it('deve declarar derrota do jogador ao destruir toda a sua frota', () => {
    const tabuleiroJogador = criarTabuleiroComDestroyer('A', 1);
    const tabuleiroComputador = criarTabuleiroComDestroyer('B', 1);
    const partida = new Partida(tabuleiroJogador, tabuleiroComputador);

    partida.atacar(ParticipantePartida.JogadorUm, new Coordenada('J', 10));
    partida.atacar(ParticipantePartida.JogadorDois, new Coordenada('A', 1));
    partida.atacar(ParticipantePartida.JogadorUm, new Coordenada('J', 9));
    partida.atacar(ParticipantePartida.JogadorDois, new Coordenada('A', 2));

    expect(partida.resultado).toBe(ResultadoPartida.VitoriaJogadorDois);
    expect(partida.encerrada).toBe(true);
  });

  it('deve declarar vitória do adversário quando o tempo de um participante se esgotar', () => {
    const partida = criarPartida();

    partida.encerrarPorTempo(ParticipantePartida.JogadorUm);

    expect(partida.resultado).toBe(ResultadoPartida.VitoriaJogadorDois);
    expect(partida.motivoEncerramento).toBe(MotivoEncerramentoPartida.TempoEsgotado);
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
