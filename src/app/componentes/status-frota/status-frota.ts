import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideShip } from '@lucide/angular';
import { EstadoEmbarcacao } from '../../dominio/tabuleiro';
import { TipoEmbarcacao } from '../../dominio/frota';
import { IconeEmbarcacaoComponent } from '../icone-embarcacao/icone-embarcacao';

type SituacaoEmbarcacao = 'Intacta' | 'Atingida' | 'Afundada';

interface ItemFrota {
  readonly tipo: TipoEmbarcacao;
  readonly situacao: SituacaoEmbarcacao;
  readonly nome: string;
  readonly posicoesAtingidas: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideShip, IconeEmbarcacaoComponent],
  selector: 'app-status-frota',
  styleUrl: './status-frota.css',
  templateUrl: './status-frota.html',
})
export class StatusFrotaComponent {
  readonly estados = input.required<readonly EstadoEmbarcacao[]>();
  readonly ocultarNaoAfundadas = input(false);
  readonly titulo = input.required<string>();
  readonly itens = computed(() => this.estados().map((estado) => this.criarItem(estado)));

  private criarItem(estado: EstadoEmbarcacao): ItemFrota {
    const situacao = this.obterSituacao(estado);
    const deveOcultar = this.ocultarNaoAfundadas() && situacao !== 'Afundada';

    return {
      tipo: estado.tipo,
      situacao,
      nome: deveOcultar ? 'Embarcação não identificada' : this.obterNome(estado.tipo),
      posicoesAtingidas: estado.posicoesAtingidas.length,
    };
  }

  private obterSituacao(estado: EstadoEmbarcacao): SituacaoEmbarcacao {
    if (estado.afundada) {
      return 'Afundada';
    }

    return estado.posicoesAtingidas.length > 0 ? 'Atingida' : 'Intacta';
  }

  private obterNome(tipo: TipoEmbarcacao): string {
    const nomes: Record<TipoEmbarcacao, string> = {
      [TipoEmbarcacao.PortaAvioes]: 'Porta-aviões',
      [TipoEmbarcacao.Encouracado]: 'Encouraçado',
      [TipoEmbarcacao.Cruzador]: 'Cruzador',
      [TipoEmbarcacao.Submarino]: 'Submarino',
      [TipoEmbarcacao.Destroyer]: 'Destroyer',
    };

    return nomes[tipo];
  }
}
