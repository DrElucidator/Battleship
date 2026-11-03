import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { LucideAnchor, LucideRotateCw } from '@lucide/angular';
import { IconeEmbarcacaoComponent } from '../icone-embarcacao/icone-embarcacao';
import { Coordenada, LinhaTabuleiro } from '../../dominio/coordenada';
import { Embarcacao } from '../../dominio/embarcacao';
import { frotaOficial, TipoEmbarcacao } from '../../dominio/frota';
import { Orientacao } from '../../dominio/orientacao';
import { Tabuleiro } from '../../dominio/tabuleiro';
import { FabricaFrotaComputador } from '../../dominio/fabrica-frota-computador';

interface LinhaDoTabuleiro {
  readonly rotulo: LinhaTabuleiro;
  readonly coordenadas: readonly Coordenada[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAnchor, LucideRotateCw, IconeEmbarcacaoComponent],
  selector: 'app-preparacao-frota',
  styleUrl: './preparacao-frota.css',
  templateUrl: './preparacao-frota.html',
})
export class PreparacaoFrotaComponent {
  readonly jogador = input.required<string>();
  readonly botaoFinal = input.required<string>();
  readonly batalhaIniciada = output<Tabuleiro>();
  readonly embarcacaoSelecionada = signal<TipoEmbarcacao | null>(null);
  readonly orientacao = signal(Orientacao.Horizontal);
  readonly mensagem = signal('Selecione uma embarcação para começar.');
  readonly embarcacoesPosicionadas = signal<readonly Embarcacao[]>([]);
  readonly frota = frotaOficial;
  readonly orientacoes = Orientacao;
  private tabuleiro = new Tabuleiro();
  private readonly fabricaFrota = new FabricaFrotaComputador();
  readonly colunas = Array.from({ length: 10 }, (_, indice) => indice + 1);
  readonly linhasDoTabuleiro = this.organizarLinhasDoTabuleiro();
  readonly coordenadasOcupadas = computed(
    () =>
      new Set(
        this.embarcacoesPosicionadas().flatMap((embarcacao) =>
          embarcacao.posicoes.map((posicao) => posicao.paraTexto()),
        ),
      ),
  );
  readonly quantidadeDeEmbarcacoesRestantes = computed(
    () => frotaOficial.length - this.embarcacoesPosicionadas().length,
  );
  readonly frotaEstaCompleta = computed(() =>
    this.frota.every((embarcacao) => this.estaEmbarcacaoPosicionada(embarcacao.tipo)),
  );

  selecionarEmbarcacao(tipo: TipoEmbarcacao): void {
    this.embarcacaoSelecionada.set(tipo);
    this.mensagem.set('Escolha a coordenada inicial no tabuleiro.');
  }

  selecionarOrientacao(orientacao: Orientacao): void {
    this.orientacao.set(orientacao);
  }

  posicionarEmbarcacao(coordenada: Coordenada): void {
    const tipo = this.embarcacaoSelecionada();

    if (!tipo) {
      this.mensagem.set('Selecione uma embarcação antes de escolher uma coordenada.');
      return;
    }

    try {
      const embarcacao = new Embarcacao(tipo, coordenada, this.orientacao());
      this.tabuleiro.posicionarEmbarcacao(embarcacao);
      this.embarcacoesPosicionadas.set(this.tabuleiro.obterEmbarcacoes());
      this.embarcacaoSelecionada.set(null);
      this.mensagem.set(
        `${this.obterNomeEmbarcacao(tipo)} posicionado em ${coordenada.paraTexto()}.`,
      );
    } catch (erro) {
      this.mensagem.set(
        erro instanceof Error ? erro.message : 'Não foi possível posicionar a embarcação.',
      );
    }
  }

  estaCoordenadaOcupada(coordenada: Coordenada): boolean {
    return this.coordenadasOcupadas().has(coordenada.paraTexto());
  }

  obterTipoEmbarcacaoNaCoordenada(coordenada: Coordenada): TipoEmbarcacao | undefined {
    return this.embarcacoesPosicionadas().find((embarcacao) =>
      embarcacao.posicoes.some((posicao) => posicao.paraTexto() === coordenada.paraTexto()),
    )?.tipo;
  }

  estaEmbarcacaoPosicionada(tipo: TipoEmbarcacao): boolean {
    return this.embarcacoesPosicionadas().some((embarcacao) => embarcacao.tipo === tipo);
  }

  reposicionarEmbarcacao(tipo: TipoEmbarcacao): void {
    const embarcacaoRemovida = this.tabuleiro.removerEmbarcacao(tipo);

    if (!embarcacaoRemovida) {
      return;
    }

    this.embarcacoesPosicionadas.set(this.tabuleiro.obterEmbarcacoes());
    this.embarcacaoSelecionada.set(tipo);
    this.mensagem.set(
      `${this.obterNomeEmbarcacao(tipo)} removido. Escolha uma nova coordenada inicial.`,
    );
  }

  posicionarFrotaAutomaticamente(): void {
    this.tabuleiro = this.fabricaFrota.criar();
    this.embarcacoesPosicionadas.set(this.tabuleiro.obterEmbarcacoes());
    this.embarcacaoSelecionada.set(null);
    this.mensagem.set('A frota foi posicionada automaticamente. Você pode reposicionar qualquer embarcação.');
  }

  iniciarBatalha(): void {
    if (!this.frotaEstaCompleta()) {
      return;
    }

    this.batalhaIniciada.emit(this.tabuleiro);
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
