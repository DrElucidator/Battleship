import { Component, inject, signal } from '@angular/core';
import { LucideShip } from '@lucide/angular';
import { BatalhaComponent } from './componentes/batalha/batalha';
import { ApresentacaoInicialComponent } from './componentes/apresentacao-inicial/apresentacao-inicial';
import { PreparacaoFrotaComponent } from './componentes/preparacao-frota/preparacao-frota';
import { TrocaJogadorComponent } from './componentes/troca-jogador/troca-jogador';
import { FabricaFrotaComputador } from './dominio/fabrica-frota-computador';
import { Partida } from './dominio/partida';
import { ModoPartida, ParticipantePartida } from './dominio/participante';
import { Placar, Pontuacao } from './dominio/placar';
import { ResultadoBatalha } from './modelos/resultado-batalha';
import { ArmazenamentoPartidasService } from './servicos/armazenamento-partidas.service';
import { Tabuleiro } from './dominio/tabuleiro';

@Component({
  imports: [
    LucideShip,
    ApresentacaoInicialComponent,
    PreparacaoFrotaComponent,
    TrocaJogadorComponent,
    BatalhaComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly armazenamentoPartidas = inject(ArmazenamentoPartidasService);
  private readonly placar = new Placar(this.armazenamentoPartidas.carregar().pontuacao);
  protected readonly nomeJogo = signal('Batalha Naval');
  protected readonly modos = ModoPartida;
  protected readonly participantes = ParticipantePartida;
  protected readonly etapa = signal<
    | 'apresentacao'
    | 'preparacaoJogadorUm'
    | 'trocaParaPreparacaoJogadorDois'
    | 'preparacaoJogadorDois'
    | 'batalha'
  >('apresentacao');
  protected readonly partida = signal<Partida | null>(null);
  protected readonly modoPartida = signal(ModoPartida.Computador);
  protected readonly tabuleiroJogadorUm = signal<Tabuleiro | null>(null);
  protected readonly pontuacao = signal<Pontuacao>(this.placar.obterPontuacao());
  private readonly fabricaFrotaComputador = new FabricaFrotaComputador();

  iniciarPreparacao(): void {
    this.partida.set(null);
    this.tabuleiroJogadorUm.set(null);
    this.etapa.set('preparacaoJogadorUm');
  }

  selecionarModo(modo: ModoPartida): void {
    this.modoPartida.set(modo);
  }

  voltarParaInicio(): void {
    this.partida.set(null);
    this.tabuleiroJogadorUm.set(null);
    this.etapa.set('apresentacao');
  }

  concluirPreparacaoJogadorUm(tabuleiro: Tabuleiro): void {
    if (this.modoPartida() === ModoPartida.Computador) {
      this.iniciarBatalha(tabuleiro, this.fabricaFrotaComputador.criar());
      return;
    }

    this.tabuleiroJogadorUm.set(tabuleiro);
    this.etapa.set('trocaParaPreparacaoJogadorDois');
  }

  prepararJogadorDois(): void {
    this.etapa.set('preparacaoJogadorDois');
  }

  concluirPreparacaoJogadorDois(tabuleiro: Tabuleiro): void {
    const tabuleiroJogadorUm = this.tabuleiroJogadorUm();

    if (!tabuleiroJogadorUm) {
      this.voltarParaInicio();
      return;
    }

    this.iniciarBatalha(tabuleiroJogadorUm, tabuleiro);
  }

  private iniciarBatalha(tabuleiroJogadorUm: Tabuleiro, tabuleiroJogadorDois: Tabuleiro): void {
    this.partida.set(new Partida(tabuleiroJogadorUm, tabuleiroJogadorDois));
    this.etapa.set('batalha');
  }

  registrarResultado(resultadoBatalha: ResultadoBatalha): void {
    this.placar.registrarResultado(resultadoBatalha.resultado);
    const pontuacao = this.placar.obterPontuacao();
    this.pontuacao.set(pontuacao);
    this.armazenamentoPartidas.registrarPartida(
      {
        id: this.criarIdentificadorPartida(),
        concluidaEm: new Date().toISOString(),
        resultado: resultadoBatalha.resultado,
        duracaoSegundos: resultadoBatalha.duracaoSegundos,
        resumoJogadorUm: resultadoBatalha.resumoJogadorUm,
        resumoJogadorDois: resultadoBatalha.resumoJogadorDois,
      },
      pontuacao,
    );
  }

  iniciarNovaPartida(): void {
    this.partida.set(null);
    this.tabuleiroJogadorUm.set(null);
    this.etapa.set('preparacaoJogadorUm');
  }

  private criarIdentificadorPartida(): string {
    return crypto.randomUUID();
  }
}
