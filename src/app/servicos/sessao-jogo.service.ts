import { Injectable, inject, signal } from '@angular/core';
import { Coordenada } from '../dominio/coordenada';
import { Embarcacao } from '../dominio/embarcacao';
import { FabricaFrotaComputador } from '../dominio/fabrica-frota-computador';
import { MotivoEncerramentoPartida, Partida } from '../dominio/partida';
import { ModoPartida, ParticipantePartida } from '../dominio/participante';
import { Placar, Pontuacao } from '../dominio/placar';
import { Tabuleiro } from '../dominio/tabuleiro';
import { PartidaPersistida, TabuleiroPersistido } from '../modelos/sessao-jogo';
import { RegistroPartida } from '../modelos/registro-partida';
import { ResultadoBatalha } from '../modelos/resultado-batalha';
import { ArmazenamentoPartidasService } from './armazenamento-partidas.service';
import { ArmazenamentoSessaoJogoService } from './armazenamento-sessao-jogo.service';

@Injectable({ providedIn: 'root' })
export class SessaoJogoService {
  private readonly armazenamentoPartidas = inject(ArmazenamentoPartidasService);
  private readonly armazenamentoSessao = inject(ArmazenamentoSessaoJogoService);
  private readonly estadoPartidas = this.armazenamentoPartidas.carregar();
  private readonly placar = new Placar(this.estadoPartidas.pontuacao);
  private readonly fabricaFrotaComputador = new FabricaFrotaComputador();
  readonly modo = signal(ModoPartida.Computador);
  readonly partida = signal<Partida | null>(null);
  readonly pontuacao = signal<Pontuacao>(this.placar.obterPontuacao());
  readonly historico = signal<readonly RegistroPartida[]>(this.estadoPartidas.historico);
  readonly tempoRestante = signal(90);
  private readonly tabuleiroJogadorUm = signal<Tabuleiro | null>(null);

  constructor() {
    this.restaurarSessao();
  }

  iniciarPreparacao(modo: ModoPartida): void {
    this.modo.set(modo);
    this.partida.set(null);
    this.tabuleiroJogadorUm.set(null);
    this.tempoRestante.set(90);
    this.armazenamentoSessao.limpar();
  }

  concluirPreparacaoJogadorUm(tabuleiro: Tabuleiro): 'batalha' | 'troca-jogador' {
    if (this.modo() === ModoPartida.Computador) {
      this.iniciarBatalha(tabuleiro, this.fabricaFrotaComputador.criar());
      this.salvarSessao();
      return 'batalha';
    }

    this.tabuleiroJogadorUm.set(tabuleiro);
    this.salvarSessao();
    return 'troca-jogador';
  }

  concluirPreparacaoJogadorDois(tabuleiro: Tabuleiro): boolean {
    const tabuleiroJogadorUm = this.tabuleiroJogadorUm();

    if (!tabuleiroJogadorUm) {
      return false;
    }

    this.iniciarBatalha(tabuleiroJogadorUm, tabuleiro);
    this.salvarSessao();
    return true;
  }

  iniciarNovaPartida(): void {
    this.partida.set(null);
    this.tabuleiroJogadorUm.set(null);
    this.tempoRestante.set(90);
    this.armazenamentoSessao.limpar();
  }

  voltarParaInicio(): void {
    this.partida.set(null);
    this.tabuleiroJogadorUm.set(null);
    this.tempoRestante.set(90);
    this.armazenamentoSessao.limpar();
  }

  possuiPreparacaoJogadorUm(): boolean {
    return this.tabuleiroJogadorUm() !== null;
  }

  salvarPartidaEmAndamento(tempoRestante: number): void {
    this.tempoRestante.set(tempoRestante);
    this.salvarSessao();
  }

  registrarResultado(resultadoBatalha: ResultadoBatalha): void {
    this.placar.registrarResultado(resultadoBatalha.resultado);
    const pontuacao = this.placar.obterPontuacao();
    this.pontuacao.set(pontuacao);
    this.armazenamentoPartidas.registrarPartida(
      {
        id: crypto.randomUUID(),
        concluidaEm: new Date().toISOString(),
        resultado: resultadoBatalha.resultado,
        modo: this.modo(),
        duracaoSegundos: resultadoBatalha.duracaoSegundos,
        resumoJogadorUm: resultadoBatalha.resumoJogadorUm,
        resumoJogadorDois: resultadoBatalha.resumoJogadorDois,
      },
      pontuacao,
    );
    this.historico.set(this.armazenamentoPartidas.carregar().historico);
    this.armazenamentoSessao.limpar();
  }

  private iniciarBatalha(tabuleiroJogadorUm: Tabuleiro, tabuleiroJogadorDois: Tabuleiro): void {
    this.partida.set(new Partida(tabuleiroJogadorUm, tabuleiroJogadorDois));
    this.tempoRestante.set(90);
  }

  private salvarSessao(): void {
    const partida = this.partida();
    const tabuleiroJogadorUm = this.tabuleiroJogadorUm();

    if (!partida && !tabuleiroJogadorUm) {
      return;
    }

    this.armazenamentoSessao.salvar({
      versao: 1,
      modo: this.modo(),
      tabuleiroJogadorUm: tabuleiroJogadorUm
        ? this.serializarTabuleiro(tabuleiroJogadorUm)
        : undefined,
      partida: partida ? this.serializarPartida(partida) : undefined,
      tempoRestante: this.tempoRestante(),
      salvaEm: new Date().toISOString(),
    });
  }

  private restaurarSessao(): void {
    const sessao = this.armazenamentoSessao.carregar();

    if (!sessao || sessao.versao !== 1) {
      return;
    }

    try {
      this.modo.set(sessao.modo);
      this.tempoRestante.set(this.obterTempoRestaurado(sessao.tempoRestante, sessao.salvaEm));

      if (sessao.tabuleiroJogadorUm) {
        this.tabuleiroJogadorUm.set(this.restaurarTabuleiro(sessao.tabuleiroJogadorUm));
      }

      if (sessao.partida) {
        this.partida.set(this.restaurarPartida(sessao.partida));
      }
    } catch {
      this.armazenamentoSessao.limpar();
      this.partida.set(null);
      this.tabuleiroJogadorUm.set(null);
      this.tempoRestante.set(90);
    }
  }

  private serializarPartida(partida: Partida): PartidaPersistida {
    return {
      tabuleiroJogadorUm: this.serializarTabuleiro(partida.tabuleiroJogadorUm),
      tabuleiroJogadorDois: this.serializarTabuleiro(partida.tabuleiroJogadorDois),
      jogadas: partida.obterJogadas().map((jogada) => ({
        atacante: jogada.atacante,
        coordenada: { linha: jogada.coordenada.linha, coluna: jogada.coordenada.coluna },
      })),
      participanteSemTempo:
        partida.motivoEncerramento === MotivoEncerramentoPartida.TempoEsgotado
          ? partida.resultado === 'VitoriaJogadorUm'
            ? ParticipantePartida.JogadorDois
            : ParticipantePartida.JogadorUm
          : undefined,
    };
  }

  private restaurarPartida(partida: PartidaPersistida): Partida {
    return Partida.restaurar(
      this.restaurarTabuleiro(partida.tabuleiroJogadorUm),
      this.restaurarTabuleiro(partida.tabuleiroJogadorDois),
      partida.jogadas.map((jogada) => ({
        atacante: jogada.atacante,
        coordenada: new Coordenada(jogada.coordenada.linha, jogada.coordenada.coluna),
      })),
      partida.participanteSemTempo,
    );
  }

  private serializarTabuleiro(tabuleiro: Tabuleiro): TabuleiroPersistido {
    return {
      embarcacoes: tabuleiro.obterEmbarcacoes().map((embarcacao) => ({
        tipo: embarcacao.tipo,
        origem: { linha: embarcacao.origem.linha, coluna: embarcacao.origem.coluna },
        orientacao: embarcacao.orientacao,
      })),
    };
  }

  private restaurarTabuleiro(tabuleiroPersistido: TabuleiroPersistido): Tabuleiro {
    const tabuleiro = new Tabuleiro();

    for (const embarcacao of tabuleiroPersistido.embarcacoes) {
      tabuleiro.posicionarEmbarcacao(
        new Embarcacao(
          embarcacao.tipo,
          new Coordenada(embarcacao.origem.linha, embarcacao.origem.coluna),
          embarcacao.orientacao,
        ),
      );
    }

    return tabuleiro;
  }

  private obterTempoValido(tempoRestante: number): number {
    return Number.isInteger(tempoRestante) && tempoRestante >= 0 && tempoRestante <= 90
      ? tempoRestante
      : 90;
  }

  private obterTempoRestaurado(tempoRestante: number, salvaEm: string): number {
    const dataSalva = Date.parse(salvaEm);

    if (Number.isNaN(dataSalva)) {
      return 0;
    }

    const segundosDecorridos = Math.max(0, Math.floor((Date.now() - dataSalva) / 1_000));
    return Math.max(0, this.obterTempoValido(tempoRestante) - segundosDecorridos);
  }
}
