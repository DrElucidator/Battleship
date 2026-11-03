import { Component, signal } from '@angular/core';
import { LucideShip } from '@lucide/angular';
import { BatalhaComponent } from './componentes/batalha/batalha';
import { ApresentacaoInicialComponent } from './componentes/apresentacao-inicial/apresentacao-inicial';
import { PreparacaoFrotaComponent } from './componentes/preparacao-frota/preparacao-frota';
import { FabricaFrotaComputador } from './dominio/fabrica-frota-computador';
import { Partida, ResultadoPartida } from './dominio/partida';
import { Placar, Pontuacao } from './dominio/placar';
import { Tabuleiro } from './dominio/tabuleiro';

@Component({
  imports: [LucideShip, ApresentacaoInicialComponent, PreparacaoFrotaComponent, BatalhaComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly nomeJogo = signal('Batalha Naval');
  protected readonly etapa = signal<'apresentacao' | 'preparacao' | 'batalha'>('apresentacao');
  protected readonly partida = signal<Partida | null>(null);
  protected readonly pontuacao = signal<Pontuacao>({ jogador: 0, computador: 0 });
  private readonly fabricaFrotaComputador = new FabricaFrotaComputador();
  private readonly placar = new Placar();

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

  registrarResultado(resultado: ResultadoPartida): void {
    this.placar.registrarResultado(resultado);
    this.pontuacao.set(this.placar.obterPontuacao());
  }

  iniciarNovaPartida(): void {
    this.partida.set(null);
    this.etapa.set('preparacao');
  }
}
