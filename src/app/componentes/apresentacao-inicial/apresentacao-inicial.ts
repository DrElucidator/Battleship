import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideCrosshair, LucideShip, LucideTrophy, LucideUsers } from '@lucide/angular';
import { ModoPartida } from '../../dominio/participante';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideCrosshair, LucideShip, LucideTrophy, LucideUsers],
  selector: 'app-apresentacao-inicial',
  styleUrl: './apresentacao-inicial.css',
  templateUrl: './apresentacao-inicial.html',
})
export class ApresentacaoInicialComponent {
  readonly modo = input<ModoPartida>(ModoPartida.Computador);
  readonly preparacaoIniciada = output<void>();
  readonly modoAlterado = output<ModoPartida>();
  readonly modos = ModoPartida;

  iniciarPreparacao(): void {
    this.preparacaoIniciada.emit();
  }

  selecionarModo(modo: ModoPartida): void {
    this.modoAlterado.emit(modo);
  }
}
