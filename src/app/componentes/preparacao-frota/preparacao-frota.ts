import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Embarcacao } from '../../dominio/embarcacao';
import { frotaOficial, TipoEmbarcacao } from '../../dominio/frota';
import { Orientacao } from '../../dominio/orientacao';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-preparacao-frota',
  styleUrl: './preparacao-frota.css',
  templateUrl: './preparacao-frota.html',
})
export class PreparacaoFrotaComponent {
  readonly embarcacaoSelecionada = signal<TipoEmbarcacao | null>(null);
  readonly orientacao = signal(Orientacao.Horizontal);
  readonly mensagem = signal('Selecione uma embarcação para começar.');
  readonly embarcacoesPosicionadas = signal<readonly Embarcacao[]>([]);
  readonly quantidadeDeEmbarcacoesRestantes = computed(
    () => frotaOficial.length - this.embarcacoesPosicionadas().length,
  );

  selecionarEmbarcacao(tipo: TipoEmbarcacao): void {
    this.embarcacaoSelecionada.set(tipo);
    this.mensagem.set('Escolha a coordenada inicial no tabuleiro.');
  }

  selecionarOrientacao(orientacao: Orientacao): void {
    this.orientacao.set(orientacao);
  }
}
