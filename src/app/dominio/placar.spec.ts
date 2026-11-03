import { ResultadoPartida } from './partida';
import { Placar } from './placar';

describe('Placar', () => {
  it('deve iniciar com uma pontuação previamente registrada', () => {
    const placar = new Placar({ jogadorUm: 2, jogadorDois: 1 });

    expect(placar.obterPontuacao()).toEqual({ jogadorUm: 2, jogadorDois: 1 });
  });

  it('deve registrar vitória do jogador', () => {
    const placar = new Placar();

    placar.registrarResultado(ResultadoPartida.VitoriaJogadorUm);

    expect(placar.obterPontuacao()).toEqual({ jogadorUm: 1, jogadorDois: 0 });
  });

  it('deve registrar vitória do computador', () => {
    const placar = new Placar();

    placar.registrarResultado(ResultadoPartida.VitoriaJogadorDois);

    expect(placar.obterPontuacao()).toEqual({ jogadorUm: 0, jogadorDois: 1 });
  });

  it('deve rejeitar resultado de partida em andamento', () => {
    const placar = new Placar();

    expect(() => placar.registrarResultado(ResultadoPartida.EmAndamento)).toThrow(
      'Somente partidas concluídas podem ser registradas no placar.',
    );
  });
});
