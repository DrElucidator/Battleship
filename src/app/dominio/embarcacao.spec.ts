import { Coordenada } from './coordenada';
import { Embarcacao } from './embarcacao';
import { TipoEmbarcacao } from './frota';
import { Orientacao } from './orientacao';

describe('Embarcacao', () => {
  it('deve calcular posições consecutivas na horizontal', () => {
    const embarcacao = new Embarcacao(
      TipoEmbarcacao.Cruzador,
      new Coordenada('B', 2),
      Orientacao.Horizontal,
    );

    expect(embarcacao.posicoes.map((posicao) => posicao.paraTexto())).toEqual(['B2', 'B3', 'B4']);
  });

  it('deve calcular posições consecutivas na vertical', () => {
    const embarcacao = new Embarcacao(
      TipoEmbarcacao.Cruzador,
      new Coordenada('B', 2),
      Orientacao.Vertical,
    );

    expect(embarcacao.posicoes.map((posicao) => posicao.paraTexto())).toEqual(['B2', 'C2', 'D2']);
  });

  it.each([
    [TipoEmbarcacao.PortaAvioes, 5],
    [TipoEmbarcacao.Encouracado, 4],
    [TipoEmbarcacao.Cruzador, 3],
    [TipoEmbarcacao.Submarino, 3],
    [TipoEmbarcacao.Destroyer, 2],
  ])('deve criar %s com %i posições', (tipo, tamanhoEsperado) => {
    const embarcacao = new Embarcacao(tipo, new Coordenada('A', 1), Orientacao.Horizontal);

    expect(embarcacao.posicoes).toHaveLength(tamanhoEsperado);
  });

  it.each([
    [new Coordenada('A', 8), Orientacao.Horizontal],
    [new Coordenada('H', 1), Orientacao.Vertical],
  ])('deve rejeitar embarcação que ultrapassa o tabuleiro', (origem, orientacao) => {
    expect(() => new Embarcacao(TipoEmbarcacao.PortaAvioes, origem, orientacao)).toThrow();
  });
});
