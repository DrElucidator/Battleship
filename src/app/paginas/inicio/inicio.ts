import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApresentacaoInicialComponent } from '../../componentes/apresentacao-inicial/apresentacao-inicial';
import { ModoPartida } from '../../dominio/participante';
import { SessaoJogoService } from '../../servicos/sessao-jogo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApresentacaoInicialComponent],
  selector: 'app-inicio',
  templateUrl: './inicio.html',
})
export class InicioPage {
  private readonly router = inject(Router);
  protected readonly sessao = inject(SessaoJogoService);

  iniciarPreparacao(): void {
    const modo = this.sessao.modo();
    this.sessao.iniciarPreparacao(modo);
    const destino = modo === ModoPartida.Computador ? '/preparar/cpu' : '/preparar/local/jogador-1';
    void this.router.navigateByUrl(destino);
  }
}
