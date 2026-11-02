import { Component, signal } from '@angular/core';
import { LucideShip } from '@lucide/angular';
import { PreparacaoFrotaComponent } from './componentes/preparacao-frota/preparacao-frota';

@Component({
  imports: [LucideShip, PreparacaoFrotaComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly nomeJogo = signal('Batalha Naval');
}
