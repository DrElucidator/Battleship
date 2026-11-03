import { Component, inject, signal } from '@angular/core';
import { LucideShip } from '@lucide/angular';
import { BatalhaComponent } from './componentes/batalha/batalha';
import { ApresentacaoInicialComponent } from './componentes/apresentacao-inicial/apresentacao-inicial';
import { PreparacaoFrotaComponent } from './componentes/preparacao-frota/preparacao-frota';
import { FabricaFrotaComputador } from './dominio/fabrica-frota-computador';
import { Partida } from './dominio/partida';
import { Placar, Pontuacao } from './dominio/placar';
import { ResultadoBatalha } from './modelos/resultado-batalha';
import { ArmazenamentoPartidasService } from './servicos/armazenamento-partidas.service';
import { Tabuleiro } from './dominio/tabuleiro';

@Component({
  imports: [LucideShip, ApresentacaoInicialComponent, PreparacaoFrotaComponent, BatalhaComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly armazenamentoPartidas = inject(ArmazenamentoPartidasService);
  private readonly placar = new Placar(this.armazenamentoPartidas.carregar().pontuacao);
  protected readonly nomeJogo = signal('Batalha Naval');
  protected readonly etapa = signal<'apresentacao' | 'preparacao' | 'batalha'>('apresentacao');
  protected readonly partida = signal<Partida | null>(null);
  protected readonly pontuacao = signal<Pontuacao>(this.placar.obterPontuacao());
  private readonly fabricaFrotaComputador = new FabricaFrotaComputador();

  iniciarPreparacao(): void {
    this.etapa.set('preparacao');
  }

  voltarParaInicio(): void {
    this.partida.set(null);
    this.etapa.set('apresentacao');
  }

  iniciarBatalha(tabuleiroJogador: Tabuleiro): void {
    const tabuleiroComputador = this.fabricaFrotaComputador.criar();
    this.partida.set(new Partida(tabuleiroJogador, tabuleiroComputador));
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
    this.etapa.set('preparacao');
  }

  private criarIdentificadorPartida(): string {
    return crypto.randomUUID();
  }
}
