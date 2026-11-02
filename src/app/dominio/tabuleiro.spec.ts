import { Tabuleiro } from './tabuleiro';

describe('Tabuleiro', () => {
  it('deve criar um tabuleiro de 10 linhas por 10 colunas', () => {
    const tabuleiro = new Tabuleiro();

    expect(tabuleiro.quantidadeDeLinhas).toBe(10);
    expect(tabuleiro.quantidadeDeColunas).toBe(10);
  });

  it('deve disponibilizar as 100 coordenadas válidas', () => {
    const tabuleiro = new Tabuleiro();
    const coordenadas = tabuleiro.obterCoordenadas();

    expect(coordenadas).toHaveLength(100);
    expect(coordenadas[0]?.paraTexto()).toBe('A1');
    expect(coordenadas.at(-1)?.paraTexto()).toBe('J10');
  });
});
