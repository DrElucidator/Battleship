import { Component, signal } from '@angular/core';
import { LucideShip } from '@lucide/angular';
import { BatalhaComponent } from './componentes/batalha/batalha';
import { PreparacaoFrotaComponent } from './componentes/preparacao-frota/preparacao-frota';
import { FabricaFrotaComputador } from './dominio/fabrica-frota-computador';
import { Partida } from './dominio/partida';
import { Tabuleiro } from './dominio/tabuleiro';

@Component({
  imports: [LucideShip, PreparacaoFrotaComponent, BatalhaComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly nomeJogo = signal('Batalha Naval');
  protected readonly partida = signal<Partida | null>(null);
  private readonly fabricaFrotaComputador = new FabricaFrotaComputador();

  iniciarBatalha(tabuleiroJogador: Tabuleiro): void {
    const tabuleiroComputador = this.fabricaFrotaComputador.criar();
    this.partida.set(new Partida(tabuleiroJogador, tabuleiroComputador));
  }
}
