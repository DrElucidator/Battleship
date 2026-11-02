export type LinhaTabuleiro = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

const linhasValidas: readonly LinhaTabuleiro[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export class Coordenada {
  readonly linha: LinhaTabuleiro;
  readonly coluna: number;

  constructor(linha: string, coluna: number) {
    if (!this.ehLinhaValida(linha)) {
      throw new RangeError('A linha deve estar entre A e J.');
    }

    if (!Number.isInteger(coluna) || coluna < 1 || coluna > 10) {
      throw new RangeError('A coluna deve ser um número inteiro entre 1 e 10.');
    }

    this.linha = linha;
    this.coluna = coluna;
  }

  paraTexto(): string {
    return `${this.linha}${this.coluna}`;
  }

  private ehLinhaValida(linha: string): linha is LinhaTabuleiro {
    return linhasValidas.includes(linha as LinhaTabuleiro);
  }
}
