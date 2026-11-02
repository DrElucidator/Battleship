import { Coordenada } from './coordenada';

describe('Coordenada', () => {
  it.each([
    ['A', 1, 'A1'],
    ['C', 7, 'C7'],
    ['J', 10, 'J10'],
  ])('deve criar a coordenada %s%s', (linha, coluna, textoEsperado) => {
    const coordenada = new Coordenada(linha, coluna);

    expect(coordenada.linha).toBe(linha);
    expect(coordenada.coluna).toBe(coluna);
    expect(coordenada.paraTexto()).toBe(textoEsperado);
  });

  it.each(['', 'K', 'a', 'AA'])('deve rejeitar a linha inválida %s', (linha) => {
    expect(() => new Coordenada(linha, 1)).toThrow('A linha deve estar entre A e J.');
  });

  it.each([0, 11, 1.5])('deve rejeitar a coluna inválida %s', (coluna) => {
    expect(() => new Coordenada('A', coluna)).toThrow(
      'A coluna deve ser um número inteiro entre 1 e 10.',
    );
  });
});
