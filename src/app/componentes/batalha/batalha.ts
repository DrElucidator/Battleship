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
  LucideCrosshair,
  LucideLoaderCircle,
  LucideRotateCcw,
  LucideShip,
  LucideTimer,
  LucideTrophy,
  LucideWaves,
} from '@lucide/angular';
import { Subscription, interval } from 'rxjs';
import { IconeEmbarcacaoComponent } from '../icone-embarcacao/icone-embarcacao';
import { ResultadoAtaque } from '../../dominio/ataque';
import { Coordenada, LinhaTabuleiro } from '../../dominio/coordenada';
import { EstrategiaAtaqueComputador } from '../../dominio/estrategia-ataque-computador';
import { MotivoEncerramentoPartida, Partida } from '../../dominio/partida';
import { ModoPartida, obterAdversario, ParticipantePartida } from '../../dominio/participante';
import { Pontuacao } from '../../dominio/placar';
import { EstadoEmbarcacao, Tabuleiro } from '../../dominio/tabuleiro';
import { TipoEmbarcacao } from '../../dominio/frota';
import { ResultadoBatalha, ResumoParticipantePartida } from '../../modelos/resultado-batalha';

interface LinhaDoTabuleiro {
  readonly rotulo: LinhaTabuleiro;
  readonly coordenadas: readonly Coordenada[];
}

interface UltimaJogada {
  readonly tabuleiroAtacado: ParticipantePartida;
  readonly coordenada: Coordenada;
}

interface ItemResumoFrota {
  readonly nome: string;
  readonly situacao: 'Intacta' | 'Atingida' | 'Afundada';
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucideCrosshair,
    LucideLoaderCircle,
    LucideRotateCcw,
    LucideShip,
    LucideTimer,
    LucideTrophy,
    LucideWaves,
    IconeEmbarcacaoComponent,
  ],
  selector: 'app-batalha',
  styleUrl: './batalha.css',
  templateUrl: './batalha.html',
})
export class BatalhaComponent implements OnDestroy, OnInit {
  readonly partida = input.required<Partida>();
  readonly pontuacao = input.required<Pontuacao>();
  readonly modo = input<ModoPartida>(ModoPartida.Computador);
  readonly resultadoFinalizado = output<ResultadoBatalha>();
  readonly novaPartidaSolicitada = output<void>();
  readonly inicioSolicitado = output<void>();
  readonly participantes = ParticipantePartida;
  readonly modos = ModoPartida;
  readonly obterAdversario = obterAdversario;
  readonly resultadosAtaque = ResultadoAtaque;
  readonly mensagem = signal('Seu turno. Escolha uma coordenada no tabuleiro adversário.');
  readonly processamentoComputador = signal(false);
  readonly jogadorVisivel = signal(ParticipantePartida.JogadorUm);
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
  readonly tabuleiroJogador = computed(() => this.partida().obterTabuleiro(this.jogadorVisivel()));
  readonly tabuleiroComputador = computed(() =>
    this.partida().obterTabuleiro(obterAdversario(this.jogadorVisivel())),
  );
  readonly tabuleiroJogadorUm = computed(() =>
    this.partida().obterTabuleiro(ParticipantePartida.JogadorUm),
  );
  readonly tabuleiroJogadorDois = computed(() =>
    this.partida().obterTabuleiro(ParticipantePartida.JogadorDois),
  );
  readonly resumoJogador = computed(() => this.calcularResumo(this.jogadorVisivel()));
  readonly resumoComputador = computed(() =>
    this.calcularResumo(obterAdversario(this.jogadorVisivel())),
  );
  readonly estadosFrotaJogador = computed<readonly EstadoEmbarcacao[]>(() => {
    this.revisao();
    return this.tabuleiroJogador().obterEstadosEmbarcacoes();
  });
  readonly estadosFrotaComputador = computed<readonly EstadoEmbarcacao[]>(() => {
    this.revisao();
    return this.tabuleiroComputador().obterEstadosEmbarcacoes();
  });
  readonly estadosFrotaJogadorUm = computed<readonly EstadoEmbarcacao[]>(() => {
    this.revisao();
    return this.tabuleiroJogadorUm().obterEstadosEmbarcacoes();
  });
  readonly estadosFrotaJogadorDois = computed<readonly EstadoEmbarcacao[]>(() => {
    this.revisao();
    return this.tabuleiroJogadorDois().obterEstadosEmbarcacoes();
  });
  readonly vencedor = computed<ParticipantePartida | undefined>(() => {
    const resultado = this.resultadoAtual();

    if (resultado === 'VitoriaJogadorUm') {
      return ParticipantePartida.JogadorUm;
    }

    if (resultado === 'VitoriaJogadorDois') {
      return ParticipantePartida.JogadorDois;
    }

    return undefined;
  });
  readonly resumoVencedor = computed(() => {
    const vencedor = this.vencedor();
    return vencedor ? this.calcularResumo(vencedor) : undefined;
  });
  readonly resumoPerdedor = computed(() => {
    const vencedor = this.vencedor();
    return vencedor ? this.calcularResumo(obterAdversario(vencedor)) : undefined;
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
    this.atacarTabuleiro(obterAdversario(this.jogadorVisivel()), coordenada);
  }

  atacarTabuleiro(tabuleiroAtacado: ParticipantePartida, coordenada: Coordenada): void {
    if (!this.podeAtacarTabuleiro(tabuleiroAtacado, coordenada)) {
      return;
    }

    try {
      const atacante = obterAdversario(tabuleiroAtacado);
      const jogadaJogador = this.partida().atacar(atacante, coordenada);
      this.pausarCronometro();
      this.registrarUltimaJogada(tabuleiroAtacado, coordenada);
      this.mensagem.set(
        `${this.obterNomeParticipante(atacante)} atacou ${coordenada.paraTexto()}: ${this.obterDescricaoJogada(jogadaJogador)}.`,
      );
      this.atualizarEstado();

      if (this.partida().encerrada) {
        this.mensagem.set(
          `${this.obterNomeParticipante(atacante)} destruiu toda a frota adversária.`,
        );
        this.comunicarResultadoFinal();
        return;
      }

      if (this.modo() === ModoPartida.Local) {
        const proximoJogador = this.partida().turnoAtual;
        this.jogadorVisivel.set(proximoJogador);
        this.mensagem.set(
          `${this.obterNomeParticipante(atacante)} atacou ${coordenada.paraTexto()}: ${this.obterDescricaoJogada(jogadaJogador)}. Turno do ${this.obterNomeParticipante(proximoJogador)}.`,
        );
        this.iniciarCronometroJogador();
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
    return this.podeAtacarTabuleiro(obterAdversario(this.jogadorVisivel()), coordenada);
  }

  podeAtacarTabuleiro(tabuleiroAtacado: ParticipantePartida, coordenada: Coordenada): boolean {
    const atacante = obterAdversario(tabuleiroAtacado);

    return (
      !this.partida().encerrada &&
      !this.processamentoComputador() &&
      this.turnoAtual() === atacante &&
      !this.obterResultadoAtaque(this.partida().obterTabuleiro(tabuleiroAtacado), coordenada)
    );
  }

  obterResultadoAtaque(tabuleiro: Tabuleiro, coordenada: Coordenada): ResultadoAtaque | undefined {
    this.revisao();
    return tabuleiro
      .obterAtaques()
      .find((ataque) => ataque.coordenada.paraTexto() === coordenada.paraTexto())?.resultado;
  }

  possuiEmbarcacao(participante: ParticipantePartida, coordenada: Coordenada): boolean {
    return this.partida()
      .obterTabuleiro(participante)
      .obterEmbarcacoes()
      .some((embarcacao) => embarcacao.posicoes.some((posicao) => posicao.paraTexto() === coordenada.paraTexto()));
  }

  obterTipoEmbarcacao(participante: ParticipantePartida, coordenada: Coordenada): TipoEmbarcacao | undefined {
    return this.partida()
      .obterTabuleiro(participante)
      .obterEmbarcacoes()
      .find((embarcacao) => embarcacao.posicoes.some((posicao) => posicao.paraTexto() === coordenada.paraTexto()))?.tipo;
  }

  obterResumoFrota(participante: ParticipantePartida): readonly ItemResumoFrota[] {
    return this.partida()
      .obterTabuleiro(participante)
      .obterEstadosEmbarcacoes()
      .map((estado) => ({
        nome: this.obterNomeEmbarcacao(estado.tipo),
        situacao: estado.afundada
          ? 'Afundada'
          : estado.posicoesAtingidas.length > 0
            ? 'Atingida'
            : 'Intacta',
      }));
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

  solicitarInicio(): void {
    this.inicioSolicitado.emit();
  }

  foiUltimaJogada(tabuleiroAtacado: ParticipantePartida, coordenada: Coordenada): boolean {
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

  obterNomeParticipante(participante: ParticipantePartida): string {
    if (this.modo() === ModoPartida.Computador) {
      return participante === ParticipantePartida.JogadorUm ? 'Você' : 'Computador';
    }

    return participante === ParticipantePartida.JogadorUm ? 'Jogador 1' : 'Jogador 2';
  }

  obterTituloFrota(participante: ParticipantePartida): string {
    if (this.modo() === ModoPartida.Computador && participante === ParticipantePartida.JogadorUm) {
      return 'Sua frota';
    }

    return `Frota do ${this.obterNomeParticipante(participante)}`;
  }

  obterTituloAtaque(participante: ParticipantePartida): string {
    if (this.modo() === ModoPartida.Computador && participante === ParticipantePartida.JogadorDois) {
      return 'Ataque o computador';
    }

    return `Ataque o ${this.obterNomeParticipante(participante)}`;
  }

  obterTituloTabuleiroAdversario(participante: ParticipantePartida): string {
    if (this.modo() === ModoPartida.Computador && participante === ParticipantePartida.JogadorDois) {
      return 'Tabuleiro adversário';
    }

    return `Tabuleiro do ${this.obterNomeParticipante(participante)}`;
  }

  obterTituloVitoria(): string {
    const vencedor = this.vencedor();

    if (!vencedor) {
      return '';
    }

    if (this.modo() === ModoPartida.Computador) {
      return vencedor === ParticipantePartida.JogadorUm ? 'Você venceu' : 'O computador venceu';
    }

    return `${this.obterNomeParticipante(vencedor)} venceu`;
  }

  obterRotuloAcertos(participante: ParticipantePartida): string {
    if (this.modo() === ModoPartida.Computador) {
      return participante === ParticipantePartida.JogadorUm
        ? 'Seus acertos'
        : 'Acertos do computador';
    }

    return `Acertos do ${this.obterNomeParticipante(participante)}`;
  }

  private registrarUltimaJogada(
    tabuleiroAtacado: ParticipantePartida,
    coordenada: Coordenada,
  ): void {
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
      this.registrarUltimaJogada(ParticipantePartida.JogadorUm, ultimaJogadaComputador.coordenada);
    }

    this.mensagem.set(
      `Você atacou ${coordenadaJogador.paraTexto()}: ${descricaoJogadaJogador}. O computador respondeu em ${ataques}.`,
    );
    this.iniciarCronometroJogador();
  }

  obterNomeEmbarcacao(tipo: TipoEmbarcacao): string {
    const nomes: Record<TipoEmbarcacao, string> = {
      [TipoEmbarcacao.PortaAvioes]: 'Porta-aviões',
      [TipoEmbarcacao.Encouracado]: 'Encouraçado',
      [TipoEmbarcacao.Cruzador]: 'Cruzador',
      [TipoEmbarcacao.Submarino]: 'Submarino',
      [TipoEmbarcacao.Destroyer]: 'Destroyer',
    };

    return nomes[tipo];
  }

  calcularResumo(atacante: ParticipantePartida): ResumoParticipantePartida {
    this.revisao();
    const jogadas = this.partida()
      .obterJogadas()
      .filter((jogada) => jogada.atacante === atacante);

    return {
      ataques: jogadas.length,
      agua: jogadas.filter((jogada) => jogada.resultado === ResultadoAtaque.Agua).length,
      acertos: jogadas.filter(
        (jogada) =>
          jogada.resultado === ResultadoAtaque.Acerto ||
          jogada.resultado === ResultadoAtaque.EmbarcacaoDestruida,
      ).length,
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
      resumoJogadorUm: this.calcularResumo(ParticipantePartida.JogadorUm),
      resumoJogadorDois: this.calcularResumo(ParticipantePartida.JogadorDois),
    });
  }

  private iniciarCronometroJogador(): void {
    this.pausarCronometro();
    this.segundosRestantes.set(this.limiteTempoTurnoSegundos);
    this.temporizadorTurno = interval(1_000).subscribe(() => {
      if (
        this.processamentoComputador() ||
        this.partida().encerrada ||
        this.partida().turnoAtual !== this.jogadorVisivel()
      ) {
        return;
      }

      const segundos = this.segundosRestantes() - 1;
      this.segundosRestantes.set(segundos);

      if (segundos === 0) {
        this.partida().encerrarPorTempo(this.jogadorVisivel());
        this.atualizarEstado();
        this.mensagem.set(
          `O tempo de ${this.obterNomeParticipante(this.jogadorVisivel())} terminou.`,
        );
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
