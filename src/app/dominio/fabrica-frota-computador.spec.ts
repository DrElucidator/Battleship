import { TipoEmbarcacao } from './frota';
import { FabricaFrotaComputador, GeradorAleatorio } from './fabrica-frota-computador';

describe('FabricaFrotaComputador', () => {
  it('deve criar uma frota oficial completa em posições sem sobreposição', () => {
    const fabrica = new FabricaFrotaComputador();
    const geradorAleatorio = criarGeradorAleatorio(
      0,
      0,
      0.2,
      0,
      0.4,
      0,
      0.6,
      0,
      0.8,
      0,
    );

    const tabuleiro = fabrica.criar(geradorAleatorio);
    const embarcacoes = tabuleiro.obterEmbarcacoes();
    const posicoes = embarcacoes.flatMap((embarcacao) => embarcacao.posicoes);

    expect(embarcacoes).toHaveLength(5);
    expect(embarcacoes.map((embarcacao) => embarcacao.tipo)).toEqual([
      TipoEmbarcacao.PortaAvioes,
      TipoEmbarcacao.Encouracado,
      TipoEmbarcacao.Cruzador,
      TipoEmbarcacao.Submarino,
      TipoEmbarcacao.Destroyer,
    ]);
    expect(new Set(posicoes.map((posicao) => posicao.paraTexto())).size).toBe(17);
  });

  it('deve rejeitar um gerador aleatório fora do intervalo esperado', () => {
    const fabrica = new FabricaFrotaComputador();

    expect(() => fabrica.criar(() => 1)).toThrow(
      'O gerador aleatório deve retornar um número entre 0 e 1.',
    );
  });
});

function criarGeradorAleatorio(...valores: number[]): GeradorAleatorio {
  let indice = 0;

  return () => valores[indice++] ?? 0;
}
