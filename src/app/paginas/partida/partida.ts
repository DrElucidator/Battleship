import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BatalhaComponent } from '../../componentes/batalha/batalha';
import { ModoPartida } from '../../dominio/participante';
import { ResultadoBatalha } from '../../modelos/resultado-batalha';
import { SessaoJogoService } from '../../servicos/sessao-jogo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BatalhaComponent],
  selector: 'app-partida',
  templateUrl: './partida.html',
})
export class PartidaPage implements OnInit {
  readonly modo = input.required<ModoPartida>();
  private readonly router = inject(Router);
  protected readonly sessao = inject(SessaoJogoService);

  ngOnInit(): void {
    if (this.sessao.modo() !== this.modo() || !this.sessao.partida()) {
      void this.router.navigateByUrl('/');
    }
  }

  registrarResultado(resultado: ResultadoBatalha): void {
    this.sessao.registrarResultado(resultado);
  }

  novaPartida(): void {
    this.sessao.iniciarNovaPartida();
    const destino = this.modo() === ModoPartida.Computador ? '/preparar/cpu' : '/preparar/local/jogador-1';
    void this.router.navigateByUrl(destino);
  }

  voltarParaInicio(): void {
    this.sessao.voltarParaInicio();
    void this.router.navigateByUrl('/');
  }
}
