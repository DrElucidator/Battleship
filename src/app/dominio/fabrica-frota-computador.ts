import { Coordenada } from './coordenada';
import { Embarcacao } from './embarcacao';
import { frotaOficial } from './frota';
import { Orientacao } from './orientacao';
import { Tabuleiro } from './tabuleiro';

export type GeradorAleatorio = () => number;

export class FabricaFrotaComputador {
  criar(geradorAleatorio: GeradorAleatorio = Math.random): Tabuleiro {
    const tabuleiro = new Tabuleiro();

    for (const definicao of frotaOficial) {
      this.posicionarEmbarcacao(tabuleiro, definicao.tipo, geradorAleatorio);
    }

    return tabuleiro;
  }

  private posicionarEmbarcacao(
    tabuleiro: Tabuleiro,
    tipo: (typeof frotaOficial)[number]['tipo'],
    geradorAleatorio: GeradorAleatorio,
  ): void {
    const limiteDeTentativas = 1_000;

    for (let tentativa = 0; tentativa < limiteDeTentativas; tentativa += 1) {
      const origem = this.sortearCoordenada(tabuleiro, geradorAleatorio);
      const orientacao = geradorAleatorio() < 0.5 ? Orientacao.Horizontal : Orientacao.Vertical;

      try {
        tabuleiro.posicionarEmbarcacao(new Embarcacao(tipo, origem, orientacao));
        return;
      } catch {
        // Uma origem pode ultrapassar o limite ou sobrepor uma embarcação já posicionada.
      }
    }

    throw new Error('Não foi possível posicionar a frota adversária em posições válidas.');
  }

  private sortearCoordenada(
    tabuleiro: Tabuleiro,
    geradorAleatorio: GeradorAleatorio,
  ): Coordenada {
    const coordenadas = tabuleiro.obterCoordenadas();
    const indice = Math.floor(geradorAleatorio() * coordenadas.length);
    const coordenada = coordenadas[indice];

    if (!coordenada) {
      throw new RangeError('O gerador aleatório deve retornar um número entre 0 e 1.');
    }

    return coordenada;
  }
}
