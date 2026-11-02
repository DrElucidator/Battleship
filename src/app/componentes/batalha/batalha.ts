import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import {
  LucideCircleX,
  LucideCrosshair,
  LucideMedal,
  LucideRotateCcw,
  LucideShip,
  LucideSwords,
  LucideTrophy,
  LucideWaves,
} from '@lucide/angular';
import { ResultadoAtaque } from '../../dominio/ataque';
import { Coordenada, LinhaTabuleiro } from '../../dominio/coordenada';
import { Partida, ResultadoPartida, TurnoPartida } from '../../dominio/partida';
import { Pontuacao } from '../../dominio/placar';
import { Tabuleiro } from '../../dominio/tabuleiro';

interface LinhaDoTabuleiro {
  readonly rotulo: LinhaTabuleiro;
  readonly coordenadas: readonly Coordenada[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucideCircleX,
    LucideCrosshair,
    LucideMedal,
    LucideRotateCcw,
    LucideShip,
    LucideSwords,
    LucideTrophy,
    LucideWaves,
  ],
  selector: 'app-batalha',
  styleUrl: './batalha.css',
  templateUrl: './batalha.html',
})
export class BatalhaComponent {
  readonly partida = input.required<Partida>();
  readonly pontuacao = input.required<Pontuacao>();
  readonly resultadoFinalizado = output<ResultadoPartida>();
  readonly novaPartidaSolicitada = output<void>();
  readonly turnos = TurnoPartida;
  readonly resultadosAtaque = ResultadoAtaque;
  readonly mensagem = signal('Seu turno. Escolha uma coordenada no tabuleiro adversário.');
  private readonly revisao = signal(0);
  private resultadoFoiComunicado = false;
  readonly colunas = Array.from({ length: 10 }, (_, indice) => indice + 1);
  readonly linhasDoTabuleiro = this.organizarLinhasDoTabuleiro();
  readonly turnoAtual = computed(() => {
    this.revisao();
    return this.partida().turnoAtual;
  });
  readonly resultadoAtual = computed(() => {
    this.revisao();
    return this.partida().resultado;
  });
  readonly resumoJogador = computed(() => this.calcularResumo(TurnoPartida.Jogador));
  readonly resumoComputador = computed(() => this.calcularResumo(TurnoPartida.Computador));
  readonly coordenadasJogadorOcupadas = computed(() => {
    this.revisao();
    return new Set(
      this.partida()
        .tabuleiroJogador.obterEmbarcacoes()
        .flatMap((embarcacao) => embarcacao.posicoes.map((posicao) => posicao.paraTexto())),
    );
  });

  atacarComputador(coordenada: Coordenada): void {
    if (!this.podeAtacarComputador(coordenada)) {
      return;
    }

    try {
      const jogadaJogador = this.partida().atacarComputador(coordenada);
      this.mensagem.set(
        `Você atacou ${coordenada.paraTexto()}: ${this.obterDescricaoResultado(jogadaJogador.resultado)}.`,
      );
      this.atualizarEstado();

      if (this.partida().encerrada) {
        this.mensagem.set('Você destruiu toda a frota adversária. Vitória!');
        this.comunicarResultadoFinal();
        return;
      }

      const jogadaComputador = this.partida().atacarJogador();
      this.mensagem.set(
        `Você atacou ${coordenada.paraTexto()}. O computador atacou ${jogadaComputador.coordenada.paraTexto()}: ${this.obterDescricaoResultado(jogadaComputador.resultado)}.`,
      );
      this.atualizarEstado();

      if (this.partida().encerrada) {
        this.mensagem.set('O computador destruiu toda a sua frota. Fim de jogo.');
        this.comunicarResultadoFinal();
      }
    } catch (erro) {
      this.mensagem.set(erro instanceof Error ? erro.message : 'Não foi possível executar o ataque.');
    }
  }

  podeAtacarComputador(coordenada: Coordenada): boolean {
    return (
      !this.partida().encerrada &&
      this.turnoAtual() === TurnoPartida.Jogador &&
      !this.obterResultadoAtaque(this.partida().tabuleiroComputador, coordenada)
    );
  }

  obterResultadoAtaque(tabuleiro: Tabuleiro, coordenada: Coordenada): ResultadoAtaque | undefined {
    this.revisao();
    return tabuleiro
      .obterAtaques()
      .find((ataque) => ataque.coordenada.paraTexto() === coordenada.paraTexto())?.resultado;
  }

  possuiEmbarcacaoJogador(coordenada: Coordenada): boolean {
    return this.coordenadasJogadorOcupadas().has(coordenada.paraTexto());
  }

  obterDescricaoResultado(resultado: ResultadoAtaque): string {
    const descricoes: Record<ResultadoAtaque, string> = {
      [ResultadoAtaque.Agua]: 'água',
      [ResultadoAtaque.Acerto]: 'acerto',
      [ResultadoAtaque.EmbarcacaoDestruida]: 'embarcação destruída',
    };

    return descricoes[resultado];
  }

  solicitarNovaPartida(): void {
    this.novaPartidaSolicitada.emit();
  }

  private atualizarEstado(): void {
    this.revisao.update((valor) => valor + 1);
  }

  private calcularResumo(atacante: TurnoPartida): {
    ataques: number;
    agua: number;
    acertos: number;
    destruidas: number;
  } {
    this.revisao();
    const jogadas = this.partida().obterJogadas().filter((jogada) => jogada.atacante === atacante);

    return {
      ataques: jogadas.length,
      agua: jogadas.filter((jogada) => jogada.resultado === ResultadoAtaque.Agua).length,
      acertos: jogadas.filter((jogada) => jogada.resultado === ResultadoAtaque.Acerto).length,
      destruidas: jogadas.filter((jogada) => jogada.resultado === ResultadoAtaque.EmbarcacaoDestruida)
        .length,
    };
  }

  private comunicarResultadoFinal(): void {
    if (this.resultadoFoiComunicado) {
      return;
    }

    this.resultadoFoiComunicado = true;
    this.resultadoFinalizado.emit(this.partida().resultado);
  }

  private organizarLinhasDoTabuleiro(): readonly LinhaDoTabuleiro[] {
    const coordenadasPorLinha = new Map<LinhaTabuleiro, Coordenada[]>();

    for (const coordenada of new Tabuleiro().obterCoordenadas()) {
      const coordenadas = coordenadasPorLinha.get(coordenada.linha) ?? [];
      coordenadas.push(coordenada);
      coordenadasPorLinha.set(coordenada.linha, coordenadas);
    }

    return [...coordenadasPorLinha.entries()].map(([rotulo, coordenadas]) => ({
      rotulo,
      coordenadas,
    }));
  }
}
