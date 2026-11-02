import { ResultadoPartida } from './partida';

export interface Pontuacao {
  readonly jogador: number;
  readonly computador: number;
}

export class Placar {
  private vitoriasJogador = 0;
  private vitoriasComputador = 0;

  registrarResultado(resultado: ResultadoPartida): void {
    if (resultado === ResultadoPartida.VitoriaJogador) {
      this.vitoriasJogador += 1;
      return;
    }

    if (resultado === ResultadoPartida.VitoriaComputador) {
      this.vitoriasComputador += 1;
      return;
    }

    throw new Error('Somente partidas concluídas podem ser registradas no placar.');
  }

  obterPontuacao(): Pontuacao {
    return {
      jogador: this.vitoriasJogador,
      computador: this.vitoriasComputador,
    };
  }
}
