import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { LucideCrosshair, LucideShip, LucideTrophy } from '@lucide/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideCrosshair, LucideShip, LucideTrophy],
  selector: 'app-apresentacao-inicial',
  styleUrl: './apresentacao-inicial.css',
  templateUrl: './apresentacao-inicial.html',
})
export class ApresentacaoInicialComponent {
  readonly preparacaoIniciada = output<void>();

  iniciarPreparacao(): void {
    this.preparacaoIniciada.emit();
  }
}
