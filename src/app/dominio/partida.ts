import { ResultadoAtaque } from './ataque';
import { Coordenada } from './coordenada';
import { GeradorAleatorio } from './fabrica-frota-computador';
import { EstrategiaAtaqueComputador } from './estrategia-ataque-computador';
import { Tabuleiro } from './tabuleiro';

export enum TurnoPartida {
  Jogador = 'Jogador',
  Computador = 'Computador',
}

export enum ResultadoPartida {
  EmAndamento = 'EmAndamento',
  VitoriaJogador = 'VitoriaJogador',
  VitoriaComputador = 'VitoriaComputador',
}

export interface Jogada {
  readonly atacante: TurnoPartida;
  readonly coordenada: Coordenada;
  readonly resultado: ResultadoAtaque;
}

export class Partida {
  private readonly jogadas: Jogada[] = [];
  private turno = TurnoPartida.Jogador;
  private resultadoAtual = ResultadoPartida.EmAndamento;
  private readonly estrategiaAtaqueComputador = new EstrategiaAtaqueComputador();

  constructor(
    readonly tabuleiroJogador: Tabuleiro,
    readonly tabuleiroComputador: Tabuleiro,
  ) {}

  get turnoAtual(): TurnoPartida {
    return this.turno;
  }

  get resultado(): ResultadoPartida {
    return this.resultadoAtual;
  }

  get encerrada(): boolean {
    return this.resultadoAtual !== ResultadoPartida.EmAndamento;
  }

  atacarComputador(coordenada: Coordenada): Jogada {
    this.garantirTurno(TurnoPartida.Jogador);
    return this.executarAtaque(TurnoPartida.Jogador, this.tabuleiroComputador, coordenada);
  }

  atacarJogador(geradorAleatorio: GeradorAleatorio = Math.random): Jogada {
    this.garantirTurno(TurnoPartida.Computador);
    const coordenada = this.estrategiaAtaqueComputador.escolherCoordenada(
      this.tabuleiroJogador,
      geradorAleatorio,
    );

    return this.executarAtaque(TurnoPartida.Computador, this.tabuleiroJogador, coordenada);
  }

  obterJogadas(): readonly Jogada[] {
    return [...this.jogadas];
  }

  private executarAtaque(
    atacante: TurnoPartida,
    tabuleiroDefensor: Tabuleiro,
    coordenada: Coordenada,
  ): Jogada {
    const resultado = tabuleiroDefensor.atacar(coordenada);
    const jogada = { atacante, coordenada, resultado };
    this.jogadas.push(jogada);

    if (tabuleiroDefensor.todasEmbarcacoesForamDestruidas()) {
      this.resultadoAtual =
        atacante === TurnoPartida.Jogador
          ? ResultadoPartida.VitoriaJogador
          : ResultadoPartida.VitoriaComputador;
      return jogada;
    }

    if (resultado === ResultadoAtaque.Agua) {
      this.turno =
        atacante === TurnoPartida.Jogador ? TurnoPartida.Computador : TurnoPartida.Jogador;
    }

    return jogada;
  }

  private garantirTurno(turnoEsperado: TurnoPartida): void {
    if (this.encerrada) {
      throw new Error('A partida já foi encerrada.');
    }

    if (this.turno !== turnoEsperado) {
      throw new Error(`Não é o turno de ${turnoEsperado.toLowerCase()}.`);
    }
  }

}
