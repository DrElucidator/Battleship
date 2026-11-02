import { Coordenada } from './coordenada';
import { Embarcacao } from './embarcacao';
import { TipoEmbarcacao } from './frota';
import { Orientacao } from './orientacao';
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

  it('deve posicionar uma embarcação em posições livres', () => {
    const tabuleiro = new Tabuleiro();
    const embarcacao = new Embarcacao(
      TipoEmbarcacao.Cruzador,
      new Coordenada('B', 2),
      Orientacao.Horizontal,
    );

    tabuleiro.posicionarEmbarcacao(embarcacao);

    expect(tabuleiro.obterEmbarcacoes()).toEqual([embarcacao]);
  });

  it('deve rejeitar sobreposição e preservar as embarcações já posicionadas', () => {
    const tabuleiro = new Tabuleiro();
    const cruzador = new Embarcacao(
      TipoEmbarcacao.Cruzador,
      new Coordenada('B', 2),
      Orientacao.Horizontal,
    );
    const destroyerSobreposto = new Embarcacao(
      TipoEmbarcacao.Destroyer,
      new Coordenada('B', 3),
      Orientacao.Vertical,
    );

    tabuleiro.posicionarEmbarcacao(cruzador);

    expect(() => tabuleiro.posicionarEmbarcacao(destroyerSobreposto)).toThrow(
      'A embarcação não pode ocupar uma posição já ocupada.',
    );
    expect(tabuleiro.obterEmbarcacoes()).toEqual([cruzador]);
  });

  it('deve permitir embarcações encostadas sem sobreposição', () => {
    const tabuleiro = new Tabuleiro();
    const cruzador = new Embarcacao(
      TipoEmbarcacao.Cruzador,
      new Coordenada('B', 2),
      Orientacao.Horizontal,
    );
    const destroyerAdjacente = new Embarcacao(
      TipoEmbarcacao.Destroyer,
      new Coordenada('C', 2),
      Orientacao.Vertical,
    );

    tabuleiro.posicionarEmbarcacao(cruzador);
    tabuleiro.posicionarEmbarcacao(destroyerAdjacente);

    expect(tabuleiro.obterEmbarcacoes()).toEqual([cruzador, destroyerAdjacente]);
  });
});
