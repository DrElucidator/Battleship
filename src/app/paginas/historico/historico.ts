import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideClock3, LucideHistory, LucideTrophy } from '@lucide/angular';
import { ResultadoPartida } from '../../dominio/partida';
import { ModoPartida } from '../../dominio/participante';
import { RegistroPartida } from '../../modelos/registro-partida';
import { SessaoJogoService } from '../../servicos/sessao-jogo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, LucideClock3, LucideHistory, LucideTrophy],
  selector: 'app-historico',
  styleUrl: './historico.css',
  templateUrl: './historico.html',
})
export class HistoricoPage {
  protected readonly sessao = inject(SessaoJogoService);

  protected obterTitulo(registro: RegistroPartida): string {
    const jogadorUmVenceu = registro.resultado === ResultadoPartida.VitoriaJogadorUm;

    if (registro.modo === ModoPartida.Computador) {
      return jogadorUmVenceu ? 'Você venceu' : 'Computador venceu';
    }

    return jogadorUmVenceu ? 'Jogador 1 venceu' : 'Jogador 2 venceu';
  }

  protected obterModo(registro: RegistroPartida): string {
    return registro.modo === ModoPartida.Computador ? 'Contra computador' : 'Dois jogadores';
  }
}
