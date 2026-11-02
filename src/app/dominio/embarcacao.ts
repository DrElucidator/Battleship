import { Coordenada } from './coordenada';
import { obterTamanhoEmbarcacao, TipoEmbarcacao } from './frota';
import { Orientacao } from './orientacao';

export class Embarcacao {
  readonly tipo: TipoEmbarcacao;
  readonly origem: Coordenada;
  readonly orientacao: Orientacao;
  readonly posicoes: readonly Coordenada[];

  constructor(tipo: TipoEmbarcacao, origem: Coordenada, orientacao: Orientacao) {
    this.tipo = tipo;
    this.origem = origem;
    this.orientacao = orientacao;
    this.posicoes = this.calcularPosicoes();
  }

  private calcularPosicoes(): readonly Coordenada[] {
    const tamanho = obterTamanhoEmbarcacao(this.tipo);

    return Array.from({ length: tamanho }, (_, indice) => {
      if (this.orientacao === Orientacao.Horizontal) {
        return new Coordenada(this.origem.linha, this.origem.coluna + indice);
      }

      const codigoDaLinha = this.origem.linha.charCodeAt(0) + indice;
      return new Coordenada(String.fromCharCode(codigoDaLinha), this.origem.coluna);
    });
  }
}
