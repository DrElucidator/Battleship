import { ResultadoPartida } from './partida';

export interface Pontuacao {
  readonly jogadorUm: number;
  readonly jogadorDois: number;
}

export class Placar {
  private vitoriasJogadorUm = 0;
  private vitoriasJogadorDois = 0;

  constructor(pontuacaoInicial: Pontuacao = { jogadorUm: 0, jogadorDois: 0 }) {
    this.vitoriasJogadorUm = pontuacaoInicial.jogadorUm;
    this.vitoriasJogadorDois = pontuacaoInicial.jogadorDois;
  }

  registrarResultado(resultado: ResultadoPartida): void {
    if (resultado === ResultadoPartida.VitoriaJogadorUm) {
      this.vitoriasJogadorUm += 1;
      return;
    }

    if (resultado === ResultadoPartida.VitoriaJogadorDois) {
      this.vitoriasJogadorDois += 1;
      return;
    }

    throw new Error('Somente partidas concluídas podem ser registradas no placar.');
  }

  obterPontuacao(): Pontuacao {
    return {
      jogadorUm: this.vitoriasJogadorUm,
      jogadorDois: this.vitoriasJogadorDois,
    };
  }
}
