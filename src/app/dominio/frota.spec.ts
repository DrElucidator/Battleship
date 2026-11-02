import { frotaOficial, obterTamanhoEmbarcacao, TipoEmbarcacao } from './frota';

describe('frotaOficial', () => {
  it('deve conter as cinco embarcações da atividade', () => {
    expect(frotaOficial).toHaveLength(5);
    expect(frotaOficial.map((embarcacao) => embarcacao.tipo)).toEqual([
      TipoEmbarcacao.PortaAvioes,
      TipoEmbarcacao.Encouracado,
      TipoEmbarcacao.Cruzador,
      TipoEmbarcacao.Submarino,
      TipoEmbarcacao.Destroyer,
    ]);
  });

  it.each([
    [TipoEmbarcacao.PortaAvioes, 5],
    [TipoEmbarcacao.Encouracado, 4],
    [TipoEmbarcacao.Cruzador, 3],
    [TipoEmbarcacao.Submarino, 3],
    [TipoEmbarcacao.Destroyer, 2],
  ])('deve definir %s com tamanho %i', (tipo, tamanhoEsperado) => {
    expect(obterTamanhoEmbarcacao(tipo)).toBe(tamanhoEsperado);
  });
});
