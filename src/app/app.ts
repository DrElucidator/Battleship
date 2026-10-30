import { Component, signal } from '@angular/core';
import { LucideShip } from '@lucide/angular';

@Component({
  imports: [LucideShip],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly nomeJogo = signal('Batalha Naval');
}
