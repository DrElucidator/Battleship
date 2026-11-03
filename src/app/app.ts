import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LucideAnchor, LucideHistory } from '@lucide/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAnchor, LucideHistory, RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly nomeJogo = 'Batalha Naval';
}
