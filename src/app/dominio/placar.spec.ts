import { ResultadoPartida } from './partida';
import { Placar } from './placar';

describe('Placar', () => {
  it('deve registrar vitória do jogador', () => {
    const placar = new Placar();

    placar.registrarResultado(ResultadoPartida.VitoriaJogador);

    expect(placar.obterPontuacao()).toEqual({ jogador: 1, computador: 0 });
  });

  it('deve registrar vitória do computador', () => {
    const placar = new Placar();

    placar.registrarResultado(ResultadoPartida.VitoriaComputador);

    expect(placar.obterPontuacao()).toEqual({ jogador: 0, computador: 1 });
  });

  it('deve rejeitar resultado de partida em andamento', () => {
    const placar = new Placar();

    expect(() => placar.registrarResultado(ResultadoPartida.EmAndamento)).toThrow(
      'Somente partidas concluídas podem ser registradas no placar.',
    );
  });
});
