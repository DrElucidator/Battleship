import { ResultadoAtaque } from './ataque';
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

  it('deve remover uma embarcação posicionada sem alterar as demais', () => {
    const tabuleiro = new Tabuleiro();
    const cruzador = new Embarcacao(
      TipoEmbarcacao.Cruzador,
      new Coordenada('B', 2),
      Orientacao.Horizontal,
    );
    const destroyer = new Embarcacao(
      TipoEmbarcacao.Destroyer,
      new Coordenada('D', 2),
      Orientacao.Horizontal,
    );
    tabuleiro.posicionarEmbarcacao(cruzador);
    tabuleiro.posicionarEmbarcacao(destroyer);

    const embarcacaoRemovida = tabuleiro.removerEmbarcacao(TipoEmbarcacao.Cruzador);

    expect(embarcacaoRemovida).toBe(cruzador);
    expect(tabuleiro.obterEmbarcacoes()).toEqual([destroyer]);
  });

  it('deve informar água ao atacar uma posição sem embarcação', () => {
    const tabuleiro = new Tabuleiro();

    const resultado = tabuleiro.atacar(new Coordenada('A', 1));

    expect(resultado).toBe(ResultadoAtaque.Agua);
    expect(tabuleiro.obterAtaques()).toHaveLength(1);
  });

  it('deve informar acerto ao atingir uma embarcação sem destruí-la', () => {
    const tabuleiro = new Tabuleiro();
    const destroyer = new Embarcacao(
      TipoEmbarcacao.Destroyer,
      new Coordenada('B', 2),
      Orientacao.Horizontal,
    );
    tabuleiro.posicionarEmbarcacao(destroyer);

    const resultado = tabuleiro.atacar(new Coordenada('B', 2));

    expect(resultado).toBe(ResultadoAtaque.Acerto);
  });

  it('deve informar embarcação destruída ao atingir sua última posição intacta', () => {
    const tabuleiro = new Tabuleiro();
    const destroyer = new Embarcacao(
      TipoEmbarcacao.Destroyer,
      new Coordenada('B', 2),
      Orientacao.Horizontal,
    );
    tabuleiro.posicionarEmbarcacao(destroyer);
    tabuleiro.atacar(new Coordenada('B', 2));

    const resultado = tabuleiro.atacar(new Coordenada('B', 3));

    expect(resultado).toBe(ResultadoAtaque.EmbarcacaoDestruida);
  });

  it('deve rejeitar ataque repetido e preservar o histórico', () => {
    const tabuleiro = new Tabuleiro();
    const coordenada = new Coordenada('A', 1);
    tabuleiro.atacar(coordenada);

    expect(() => tabuleiro.atacar(coordenada)).toThrow('A coordenada já foi atacada.');
    expect(tabuleiro.obterAtaques()).toHaveLength(1);
  });
});
