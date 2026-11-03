import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreparacaoFrotaComponent } from '../../componentes/preparacao-frota/preparacao-frota';
import { TrocaJogadorComponent } from '../../componentes/troca-jogador/troca-jogador';
import { ModoPartida, ParticipantePartida } from '../../dominio/participante';
import { Tabuleiro } from '../../dominio/tabuleiro';
import { SessaoJogoService } from '../../servicos/sessao-jogo.service';

type EtapaPreparacao = 'cpu' | 'jogador-1' | 'troca' | 'jogador-2';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PreparacaoFrotaComponent, TrocaJogadorComponent],
  selector: 'app-preparacao',
  templateUrl: './preparacao.html',
})
export class PreparacaoPage implements OnInit {
  readonly etapa = input.required<EtapaPreparacao>();
  private readonly router = inject(Router);
  protected readonly sessao = inject(SessaoJogoService);
  protected readonly participantes = ParticipantePartida;

  ngOnInit(): void {
    const etapa = this.etapa();
    const modoEsperado = etapa === 'cpu' ? ModoPartida.Computador : ModoPartida.Local;

    if (this.sessao.modo() !== modoEsperado || (etapa === 'jogador-2' && !this.sessao.possuiPreparacaoJogadorUm())) {
      void this.router.navigateByUrl('/');
    }
  }

  concluirJogadorUm(tabuleiro: Tabuleiro): void {
    const proximaEtapa = this.sessao.concluirPreparacaoJogadorUm(tabuleiro);
    const destino = proximaEtapa === 'batalha' ? '/partida/cpu' : '/preparar/local/troca';
    void this.router.navigateByUrl(destino);
  }

  concluirJogadorDois(tabuleiro: Tabuleiro): void {
    const batalhaIniciada = this.sessao.concluirPreparacaoJogadorDois(tabuleiro);
    void this.router.navigateByUrl(batalhaIniciada ? '/partida/local' : '/');
  }

  prepararJogadorDois(): void {
    void this.router.navigateByUrl('/preparar/local/jogador-2');
  }
}
