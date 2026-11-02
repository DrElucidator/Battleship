import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideCrosshair, LucideSwords } from '@lucide/angular';
import { Partida, TurnoPartida } from '../../dominio/partida';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideCrosshair, LucideSwords],
  selector: 'app-batalha',
  styleUrl: './batalha.css',
  templateUrl: './batalha.html',
})
export class BatalhaComponent {
  readonly partida = input.required<Partida>();
  readonly turnos = TurnoPartida;
}
