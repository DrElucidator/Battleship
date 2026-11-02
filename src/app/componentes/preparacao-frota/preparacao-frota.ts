import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { LucideAnchor, LucideRotateCw } from '@lucide/angular';
import { Coordenada, LinhaTabuleiro } from '../../dominio/coordenada';
import { Embarcacao } from '../../dominio/embarcacao';
import { frotaOficial, TipoEmbarcacao } from '../../dominio/frota';
import { Orientacao } from '../../dominio/orientacao';
import { Tabuleiro } from '../../dominio/tabuleiro';

interface LinhaDoTabuleiro {
  readonly rotulo: LinhaTabuleiro;
  readonly coordenadas: readonly Coordenada[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAnchor, LucideRotateCw],
  selector: 'app-preparacao-frota',
  styleUrl: './preparacao-frota.css',
  templateUrl: './preparacao-frota.html',
})
export class PreparacaoFrotaComponent {
  readonly embarcacaoSelecionada = signal<TipoEmbarcacao | null>(null);
  readonly orientacao = signal(Orientacao.Horizontal);
  readonly mensagem = signal('Selecione uma embarcação para começar.');
  readonly embarcacoesPosicionadas = signal<readonly Embarcacao[]>([]);
  readonly frota = frotaOficial;
  readonly orientacoes = Orientacao;
  readonly colunas = Array.from({ length: 10 }, (_, indice) => indice + 1);
  readonly linhasDoTabuleiro = this.organizarLinhasDoTabuleiro();
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

  obterNomeEmbarcacao(tipo: TipoEmbarcacao): string {
    const nomes: Record<TipoEmbarcacao, string> = {
      [TipoEmbarcacao.PortaAvioes]: 'Porta-aviões',
      [TipoEmbarcacao.Encouracado]: 'Encouraçado',
      [TipoEmbarcacao.Cruzador]: 'Cruzador',
      [TipoEmbarcacao.Submarino]: 'Submarino',
      [TipoEmbarcacao.Destroyer]: 'Destroyer',
    };

    return nomes[tipo];
  }

  private organizarLinhasDoTabuleiro(): readonly LinhaDoTabuleiro[] {
    const coordenadasPorLinha = new Map<LinhaTabuleiro, Coordenada[]>();

    for (const coordenada of new Tabuleiro().obterCoordenadas()) {
      const coordenadas = coordenadasPorLinha.get(coordenada.linha) ?? [];
      coordenadas.push(coordenada);
      coordenadasPorLinha.set(coordenada.linha, coordenadas);
    }

    return [...coordenadasPorLinha.entries()].map(([rotulo, coordenadas]) => ({
      rotulo,
      coordenadas,
    }));
  }
}
