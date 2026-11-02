import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { LucideCrosshair, LucideShip, LucideSwords, LucideWaves } from '@lucide/angular';
import { ResultadoAtaque } from '../../dominio/ataque';
import { Coordenada, LinhaTabuleiro } from '../../dominio/coordenada';
import { Partida, TurnoPartida } from '../../dominio/partida';
import { Tabuleiro } from '../../dominio/tabuleiro';

interface LinhaDoTabuleiro {
  readonly rotulo: LinhaTabuleiro;
  readonly coordenadas: readonly Coordenada[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideCrosshair, LucideShip, LucideSwords, LucideWaves],
  selector: 'app-batalha',
  styleUrl: './batalha.css',
  templateUrl: './batalha.html',
})
export class BatalhaComponent {
  readonly partida = input.required<Partida>();
  readonly turnos = TurnoPartida;
  readonly resultadosAtaque = ResultadoAtaque;
  readonly mensagem = signal('Seu turno. Escolha uma coordenada no tabuleiro adversário.');
  private readonly revisao = signal(0);
  readonly colunas = Array.from({ length: 10 }, (_, indice) => indice + 1);
  readonly linhasDoTabuleiro = this.organizarLinhasDoTabuleiro();
  readonly turnoAtual = computed(() => {
    this.revisao();
    return this.partida().turnoAtual;
  });
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
        return;
      }

      const jogadaComputador = this.partida().atacarJogador();
      this.mensagem.set(
        `Você atacou ${coordenada.paraTexto()}. O computador atacou ${jogadaComputador.coordenada.paraTexto()}: ${this.obterDescricaoResultado(jogadaComputador.resultado)}.`,
      );
      this.atualizarEstado();

      if (this.partida().encerrada) {
        this.mensagem.set('O computador destruiu toda a sua frota. Fim de jogo.');
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

  private atualizarEstado(): void {
    this.revisao.update((valor) => valor + 1);
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
