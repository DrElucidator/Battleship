import { Coordenada, LinhaTabuleiro } from './coordenada';
import { Embarcacao } from './embarcacao';

const linhas: readonly LinhaTabuleiro[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export class Tabuleiro {
  readonly quantidadeDeLinhas = linhas.length;
  readonly quantidadeDeColunas = 10;
  private readonly embarcacoes: Embarcacao[] = [];

  obterCoordenadas(): readonly Coordenada[] {
    return linhas.flatMap((linha) =>
      Array.from(
        { length: this.quantidadeDeColunas },
        (_, indice) => new Coordenada(linha, indice + 1),
      ),
    );
  }

  posicionarEmbarcacao(embarcacao: Embarcacao): void {
    if (this.possuiPosicaoOcupada(embarcacao)) {
      throw new Error('A embarcação não pode ocupar uma posição já ocupada.');
    }

    this.embarcacoes.push(embarcacao);
  }

  obterEmbarcacoes(): readonly Embarcacao[] {
    return [...this.embarcacoes];
  }

  private possuiPosicaoOcupada(embarcacao: Embarcacao): boolean {
    const posicoesOcupadas = new Set(
      this.embarcacoes.flatMap((item) => item.posicoes.map((posicao) => posicao.paraTexto())),
    );

    return embarcacao.posicoes.some((posicao) => posicoesOcupadas.has(posicao.paraTexto()));
  }
}
