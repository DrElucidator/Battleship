import { Coordenada, LinhaTabuleiro } from './coordenada';

const linhas: readonly LinhaTabuleiro[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export class Tabuleiro {
  readonly quantidadeDeLinhas = linhas.length;
  readonly quantidadeDeColunas = 10;

  obterCoordenadas(): readonly Coordenada[] {
    return linhas.flatMap((linha) =>
      Array.from(
        { length: this.quantidadeDeColunas },
        (_, indice) => new Coordenada(linha, indice + 1),
      ),
    );
  }
}
