import { ResultadoAtaque } from './ataque';
import { Coordenada } from './coordenada';
import { TipoEmbarcacao } from './frota';
import { obterAdversario, ParticipantePartida } from './participante';
import { Tabuleiro } from './tabuleiro';

export enum ResultadoPartida {
  EmAndamento = 'EmAndamento',
  VitoriaJogadorUm = 'VitoriaJogadorUm',
  VitoriaJogadorDois = 'VitoriaJogadorDois',
}

export interface Jogada {
  readonly atacante: ParticipantePartida;
  readonly coordenada: Coordenada;
  readonly resultado: ResultadoAtaque;
  readonly embarcacaoAtingida?: TipoEmbarcacao;
  readonly embarcacaoAfundada?: TipoEmbarcacao;
}

export class Partida {
  private readonly jogadas: Jogada[] = [];
  private turno = ParticipantePartida.JogadorUm;
  private resultadoAtual = ResultadoPartida.EmAndamento;

  constructor(
    readonly tabuleiroJogadorUm: Tabuleiro,
    readonly tabuleiroJogadorDois: Tabuleiro,
  ) {}

  get turnoAtual(): ParticipantePartida {
    return this.turno;
  }

  get resultado(): ResultadoPartida {
    return this.resultadoAtual;
  }

  get encerrada(): boolean {
    return this.resultadoAtual !== ResultadoPartida.EmAndamento;
  }

  atacar(atacante: ParticipantePartida, coordenada: Coordenada): Jogada {
    this.garantirTurno(atacante);
    return this.executarAtaque(atacante, this.obterTabuleiroAdversario(atacante), coordenada);
  }

  obterJogadas(): readonly Jogada[] {
    return [...this.jogadas];
  }

  obterTabuleiro(participante: ParticipantePartida): Tabuleiro {
    return participante === ParticipantePartida.JogadorUm
      ? this.tabuleiroJogadorUm
      : this.tabuleiroJogadorDois;
  }

  private executarAtaque(
    atacante: ParticipantePartida,
    tabuleiroDefensor: Tabuleiro,
    coordenada: Coordenada,
  ): Jogada {
    const resultado = tabuleiroDefensor.atacar(coordenada);
    const ataque = tabuleiroDefensor.obterAtaques().at(-1);
    const jogada = {
      atacante,
      coordenada,
      resultado,
      embarcacaoAtingida: ataque?.embarcacaoAtingida,
      embarcacaoAfundada: ataque?.embarcacaoAfundada,
    };
    this.jogadas.push(jogada);

    if (tabuleiroDefensor.todasEmbarcacoesForamDestruidas()) {
      this.resultadoAtual =
        atacante === ParticipantePartida.JogadorUm
          ? ResultadoPartida.VitoriaJogadorUm
          : ResultadoPartida.VitoriaJogadorDois;
      return jogada;
    }

    this.turno = obterAdversario(atacante);

    return jogada;
  }

  private obterTabuleiroAdversario(atacante: ParticipantePartida): Tabuleiro {
    return this.obterTabuleiro(obterAdversario(atacante));
  }

  private garantirTurno(turnoEsperado: ParticipantePartida): void {
    if (this.encerrada) {
      throw new Error('A partida já foi encerrada.');
    }

    if (this.turno !== turnoEsperado) {
      throw new Error(`Não é o turno de ${this.obterNomeParticipante(turnoEsperado)}.`);
    }
  }

  private obterNomeParticipante(participante: ParticipantePartida): string {
    return participante === ParticipantePartida.JogadorUm ? 'jogador 1' : 'jogador 2';
  }
}
