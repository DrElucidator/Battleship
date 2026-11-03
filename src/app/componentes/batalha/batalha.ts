import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  LucideCircleX,
  LucideCrosshair,
  LucideLoaderCircle,
  LucideMedal,
  LucideRotateCcw,
  LucideShip,
  LucideSwords,
  LucideTimer,
  LucideTrophy,
  LucideWaves,
} from '@lucide/angular';
import { Subscription, interval } from 'rxjs';
import { IconeEmbarcacaoComponent } from '../icone-embarcacao/icone-embarcacao';
import { StatusFrotaComponent } from '../status-frota/status-frota';
import { ResultadoAtaque } from '../../dominio/ataque';
import { Coordenada, LinhaTabuleiro } from '../../dominio/coordenada';
import { EstrategiaAtaqueComputador } from '../../dominio/estrategia-ataque-computador';
import { MotivoEncerramentoPartida, Partida } from '../../dominio/partida';
import { ParticipantePartida } from '../../dominio/participante';
import { Pontuacao } from '../../dominio/placar';
import { EstadoEmbarcacao, Tabuleiro } from '../../dominio/tabuleiro';
import { TipoEmbarcacao } from '../../dominio/frota';
import { ResultadoBatalha, ResumoParticipantePartida } from '../../modelos/resultado-batalha';

interface LinhaDoTabuleiro {
  readonly rotulo: LinhaTabuleiro;
  readonly coordenadas: readonly Coordenada[];
}

type TabuleiroAtacado = 'jogador' | 'computador';

interface UltimaJogada {
  readonly tabuleiroAtacado: TabuleiroAtacado;
  readonly coordenada: Coordenada;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucideCircleX,
    LucideCrosshair,
    LucideLoaderCircle,
    LucideMedal,
    LucideRotateCcw,
    LucideShip,
    LucideSwords,
    LucideTimer,
    LucideTrophy,
    LucideWaves,
    IconeEmbarcacaoComponent,
    StatusFrotaComponent,
  ],
  selector: 'app-batalha',
  styleUrl: './batalha.css',
  templateUrl: './batalha.html',
})
export class BatalhaComponent implements OnDestroy, OnInit {
  readonly partida = input.required<Partida>();
  readonly pontuacao = input.required<Pontuacao>();
  readonly resultadoFinalizado = output<ResultadoBatalha>();
  readonly novaPartidaSolicitada = output<void>();
  readonly participantes = ParticipantePartida;
  readonly resultadosAtaque = ResultadoAtaque;
  readonly mensagem = signal('Seu turno. Escolha uma coordenada no tabuleiro adversário.');
  readonly processamentoComputador = signal(false);
  readonly segundosRestantes = signal(90);
  readonly duracaoPartidaSegundos = signal(0);
  readonly ultimaJogada = signal<UltimaJogada | null>(null);
  private readonly revisao = signal(0);
  private readonly duracaoProcessamentoComputador = 1_000;
  private readonly limiteTempoTurnoSegundos = 90;
  private readonly estrategiaAtaqueComputador = new EstrategiaAtaqueComputador();
  private resultadoFoiComunicado = false;
  private readonly inicioPartida = Date.now();
  private temporizadorComputador: ReturnType<typeof setTimeout> | undefined;
  private temporizadorTurno: Subscription | undefined;
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
  readonly motivoEncerramento = computed(() => {
    this.revisao();
    return this.partida().motivoEncerramento;
  });
  readonly motivosEncerramento = MotivoEncerramentoPartida;
  readonly tempoRestanteFormatado = computed(() => {
    const segundos = this.segundosRestantes();
    const minutos = Math.floor(segundos / 60);
    const segundosDaFracao = segundos % 60;

    return `${minutos}:${segundosDaFracao.toString().padStart(2, '0')}`;
  });
  readonly tabuleiroJogador = computed(() =>
    this.partida().obterTabuleiro(ParticipantePartida.JogadorUm),
  );
  readonly tabuleiroComputador = computed(() =>
    this.partida().obterTabuleiro(ParticipantePartida.JogadorDois),
  );
  readonly resumoJogador = computed(() => this.calcularResumo(ParticipantePartida.JogadorUm));
  readonly resumoComputador = computed(() => this.calcularResumo(ParticipantePartida.JogadorDois));
  readonly estadosFrotaJogador = computed<readonly EstadoEmbarcacao[]>(() => {
    this.revisao();
    return this.tabuleiroJogador().obterEstadosEmbarcacoes();
  });
  readonly estadosFrotaComputador = computed<readonly EstadoEmbarcacao[]>(() => {
    this.revisao();
    return this.tabuleiroComputador().obterEstadosEmbarcacoes();
  });
  readonly coordenadasJogadorOcupadas = computed(() => {
    this.revisao();
    return new Set(
      this.tabuleiroJogador()
        .obterEmbarcacoes()
        .flatMap((embarcacao) => embarcacao.posicoes.map((posicao) => posicao.paraTexto())),
    );
  });

  atacarAdversario(coordenada: Coordenada): void {
    if (!this.podeAtacarAdversario(coordenada)) {
      return;
    }

    try {
      const jogadaJogador = this.partida().atacar(ParticipantePartida.JogadorUm, coordenada);
      this.pausarCronometro();
      this.registrarUltimaJogada('computador', coordenada);
      this.mensagem.set(
        `Você atacou ${coordenada.paraTexto()}: ${this.obterDescricaoJogada(jogadaJogador)}.`,
      );
      this.atualizarEstado();

      if (this.partida().encerrada) {
        this.mensagem.set('Você destruiu toda a frota adversária. Vitória!');
        this.comunicarResultadoFinal();
        return;
      }

      this.agendarTurnoComputador(coordenada, this.obterDescricaoJogada(jogadaJogador));
    } catch (erro) {
      this.mensagem.set(
        erro instanceof Error ? erro.message : 'Não foi possível executar o ataque.',
      );
    }
  }

  podeAtacarAdversario(coordenada: Coordenada): boolean {
    return (
      !this.partida().encerrada &&
      !this.processamentoComputador() &&
      this.turnoAtual() === ParticipantePartida.JogadorUm &&
      !this.obterResultadoAtaque(this.tabuleiroComputador(), coordenada)
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

  obterTipoEmbarcacaoJogador(coordenada: Coordenada): TipoEmbarcacao | undefined {
    return this.tabuleiroJogador()
      .obterEmbarcacoes()
      .find((embarcacao) =>
        embarcacao.posicoes.some((posicao) => posicao.paraTexto() === coordenada.paraTexto()),
      )?.tipo;
  }

  obterDescricaoResultado(resultado: ResultadoAtaque): string {
    const descricoes: Record<ResultadoAtaque, string> = {
      [ResultadoAtaque.Agua]: 'água',
      [ResultadoAtaque.Acerto]: 'acerto',
      [ResultadoAtaque.EmbarcacaoDestruida]: 'embarcação destruída',
    };

    return descricoes[resultado];
  }

  obterDescricaoJogada(jogada: {
    resultado: ResultadoAtaque;
    embarcacaoAfundada?: TipoEmbarcacao;
  }): string {
    const descricao = this.obterDescricaoResultado(jogada.resultado);

    return jogada.embarcacaoAfundada
      ? `${descricao}. ${this.obterNomeEmbarcacao(jogada.embarcacaoAfundada)} afundado`
      : descricao;
  }

  solicitarNovaPartida(): void {
    this.novaPartidaSolicitada.emit();
  }

  foiUltimaJogada(tabuleiroAtacado: TabuleiroAtacado, coordenada: Coordenada): boolean {
    const ultimaJogada = this.ultimaJogada();

    return (
      ultimaJogada?.tabuleiroAtacado === tabuleiroAtacado &&
      ultimaJogada.coordenada.paraTexto() === coordenada.paraTexto()
    );
  }

  ngOnDestroy(): void {
    if (this.temporizadorComputador) {
      clearTimeout(this.temporizadorComputador);
    }

    this.pausarCronometro();
  }

  ngOnInit(): void {
    this.iniciarCronometroJogador();
  }

  private atualizarEstado(): void {
    this.revisao.update((valor) => valor + 1);
  }

  private registrarUltimaJogada(tabuleiroAtacado: TabuleiroAtacado, coordenada: Coordenada): void {
    this.ultimaJogada.set({ tabuleiroAtacado, coordenada });
  }

  private agendarTurnoComputador(
    coordenadaJogador: Coordenada,
    descricaoJogadaJogador: string,
  ): void {
    this.processamentoComputador.set(true);
    this.mensagem.set('O computador está escolhendo uma coordenada.');
    this.temporizadorComputador = setTimeout(() => {
      this.processamentoComputador.set(false);
      this.resolverTurnoComputador(coordenadaJogador, descricaoJogadaJogador);
    }, this.duracaoProcessamentoComputador);
  }

  private resolverTurnoComputador(
    coordenadaJogador: Coordenada,
    descricaoJogadaJogador: string,
  ): void {
    const jogadasComputador = [];

    while (
      this.partida().turnoAtual === ParticipantePartida.JogadorDois &&
      !this.partida().encerrada
    ) {
      const coordenada = this.estrategiaAtaqueComputador.escolherCoordenada(
        this.tabuleiroJogador(),
      );
      const jogada = this.partida().atacar(ParticipantePartida.JogadorDois, coordenada);
      this.estrategiaAtaqueComputador.registrarResultado(
        jogada.coordenada,
        jogada.resultado,
        jogada.embarcacaoAtingida,
      );
      jogadasComputador.push(jogada);
      this.atualizarEstado();
    }

    if (this.partida().encerrada) {
      this.mensagem.set('O computador destruiu toda a sua frota. Fim de jogo.');
      this.pausarCronometro();
      this.comunicarResultadoFinal();
      return;
    }

    const ataques = jogadasComputador
      .map((jogada) => `${jogada.coordenada.paraTexto()} (${this.obterDescricaoJogada(jogada)})`)
      .join(', ');
    const ultimaJogadaComputador = jogadasComputador.at(-1);

    if (ultimaJogadaComputador) {
      this.registrarUltimaJogada('jogador', ultimaJogadaComputador.coordenada);
    }

    this.mensagem.set(
      `Você atacou ${coordenadaJogador.paraTexto()}: ${descricaoJogadaJogador}. O computador respondeu em ${ataques}.`,
    );
    this.iniciarCronometroJogador();
  }

  private obterNomeEmbarcacao(tipo: TipoEmbarcacao): string {
    const nomes: Record<TipoEmbarcacao, string> = {
      [TipoEmbarcacao.PortaAvioes]: 'Porta-aviões',
      [TipoEmbarcacao.Encouracado]: 'Encouraçado',
      [TipoEmbarcacao.Cruzador]: 'Cruzador',
      [TipoEmbarcacao.Submarino]: 'Submarino',
      [TipoEmbarcacao.Destroyer]: 'Destroyer',
    };

    return nomes[tipo];
  }

  private calcularResumo(atacante: ParticipantePartida): ResumoParticipantePartida {
    this.revisao();
    const jogadas = this.partida()
      .obterJogadas()
      .filter((jogada) => jogada.atacante === atacante);

    return {
      ataques: jogadas.length,
      agua: jogadas.filter((jogada) => jogada.resultado === ResultadoAtaque.Agua).length,
      acertos: jogadas.filter((jogada) => jogada.resultado === ResultadoAtaque.Acerto).length,
      embarcacoesDestruidas: jogadas.filter(
        (jogada) => jogada.resultado === ResultadoAtaque.EmbarcacaoDestruida,
      ).length,
    };
  }

  private comunicarResultadoFinal(): void {
    if (this.resultadoFoiComunicado) {
      return;
    }

    this.resultadoFoiComunicado = true;
    const motivoEncerramento = this.partida().motivoEncerramento;

    if (!motivoEncerramento) {
      return;
    }

    const duracaoSegundos = Math.max(1, Math.round((Date.now() - this.inicioPartida) / 1_000));
    this.duracaoPartidaSegundos.set(duracaoSegundos);
    this.resultadoFinalizado.emit({
      resultado: this.partida().resultado,
      motivoEncerramento,
      duracaoSegundos,
      resumoJogadorUm: this.resumoJogador(),
      resumoJogadorDois: this.resumoComputador(),
    });
  }

  private iniciarCronometroJogador(): void {
    this.pausarCronometro();
    this.segundosRestantes.set(this.limiteTempoTurnoSegundos);
    this.temporizadorTurno = interval(1_000).subscribe(() => {
      if (
        this.processamentoComputador() ||
        this.partida().encerrada ||
        this.partida().turnoAtual !== ParticipantePartida.JogadorUm
      ) {
        return;
      }

      const segundos = this.segundosRestantes() - 1;
      this.segundosRestantes.set(segundos);

      if (segundos === 0) {
        this.partida().encerrarPorTempo(ParticipantePartida.JogadorUm);
        this.atualizarEstado();
        this.mensagem.set('Seu tempo terminou. O computador venceu a partida.');
        this.pausarCronometro();
        this.comunicarResultadoFinal();
      }
    });
  }

  private pausarCronometro(): void {
    this.temporizadorTurno?.unsubscribe();
    this.temporizadorTurno = undefined;
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
