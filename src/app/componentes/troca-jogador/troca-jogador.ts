import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideEyeOff, LucideUserRound } from '@lucide/angular';
import { ParticipantePartida } from '../../dominio/participante';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideEyeOff, LucideUserRound],
  selector: 'app-troca-jogador',
  styleUrl: './troca-jogador.css',
  templateUrl: './troca-jogador.html',
})
export class TrocaJogadorComponent {
  readonly participante = input.required<ParticipantePartida>();
  readonly titulo = input.required<string>();
  readonly descricao = input.required<string>();
  readonly confirmada = output<void>();
  readonly participantes = ParticipantePartida;

  confirmar(): void {
    this.confirmada.emit();
  }

  obterNomeParticipante(): string {
    return this.participante() === ParticipantePartida.JogadorUm ? 'Jogador 1' : 'Jogador 2';
  }
}
