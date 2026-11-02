import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideBomb, LucideNavigation, LucidePlane, LucideShip } from '@lucide/angular';
import { TipoEmbarcacao } from '../../dominio/frota';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideBomb, LucideNavigation, LucidePlane, LucideShip],
  selector: 'app-icone-embarcacao',
  styleUrl: './icone-embarcacao.css',
  templateUrl: './icone-embarcacao.html',
})
export class IconeEmbarcacaoComponent {
  readonly tipo = input.required<TipoEmbarcacao>();
  readonly tamanho = input<'compacto' | 'medio'>('medio');
  readonly tipos = TipoEmbarcacao;
}
