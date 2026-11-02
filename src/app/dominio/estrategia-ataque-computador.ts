import { Coordenada } from './coordenada';
import { GeradorAleatorio } from './fabrica-frota-computador';
import { Tabuleiro } from './tabuleiro';

export class EstrategiaAtaqueComputador {
  escolherCoordenada(tabuleiro: Tabuleiro, geradorAleatorio: GeradorAleatorio = Math.random): Coordenada {
    const coordenadasAtacadas = new Set(
      tabuleiro.obterAtaques().map((ataque) => ataque.coordenada.paraTexto()),
    );
    const alvosPrioritarios = this.obterAlvosPrioritarios(tabuleiro, coordenadasAtacadas);
    const coordenadasDisponiveis = tabuleiro
      .obterCoordenadas()
      .filter((coordenada) => !coordenadasAtacadas.has(coordenada.paraTexto()));
    const candidatos = alvosPrioritarios.length > 0 ? alvosPrioritarios : coordenadasDisponiveis;
    const indice = Math.floor(geradorAleatorio() * candidatos.length);
    const coordenada = candidatos[indice];

    if (!coordenada) {
      throw new RangeError('Não há coordenadas disponíveis para ataque.');
    }

    return coordenada;
  }

  private obterAlvosPrioritarios(
    tabuleiro: Tabuleiro,
    coordenadasAtacadas: ReadonlySet<string>,
  ): readonly Coordenada[] {
    const acertosPorEmbarcacao = tabuleiro.obterCoordenadasAtingidasPorEmbarcacaoNaoDestruida();
    const alvosEmLinha = acertosPorEmbarcacao.flatMap((acertos) =>
      this.obterAlvosEmLinha(acertos, coordenadasAtacadas),
    );

    if (alvosEmLinha.length > 0) {
      return alvosEmLinha;
    }

    const candidatos = new Map<string, Coordenada>();

    for (const acertos of acertosPorEmbarcacao) {
      const [acerto] = acertos;

      if (!acerto) {
        continue;
      }

      for (const vizinha of this.obterCoordenadasVizinhas(acerto)) {
        if (!coordenadasAtacadas.has(vizinha.paraTexto())) {
          candidatos.set(vizinha.paraTexto(), vizinha);
        }
      }
    }

    return [...candidatos.values()];
  }

  private obterAlvosEmLinha(
    acertos: readonly Coordenada[],
    coordenadasAtacadas: ReadonlySet<string>,
  ): readonly Coordenada[] {
    if (acertos.length < 2) {
      return [];
    }

    const penultimo = acertos.at(-2);
    const ultimo = acertos.at(-1);

    if (!penultimo || !ultimo) {
      return [];
    }

    const variacaoLinha = ultimo.linha.charCodeAt(0) - penultimo.linha.charCodeAt(0);
    const variacaoColuna = ultimo.coluna - penultimo.coluna;
    const proxima = this.criarCoordenada(ultimo, variacaoLinha, variacaoColuna);

    if (proxima && !coordenadasAtacadas.has(proxima.paraTexto())) {
      return [proxima];
    }

    const primeira = acertos[0];
    const ladoOposto = primeira
      ? this.criarCoordenada(primeira, -variacaoLinha, -variacaoColuna)
      : undefined;

    return ladoOposto && !coordenadasAtacadas.has(ladoOposto.paraTexto()) ? [ladoOposto] : [];
  }

  private obterCoordenadasVizinhas(coordenada: Coordenada): readonly Coordenada[] {
    const variacoes = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ] as const;

    return variacoes.flatMap(([variacaoLinha, variacaoColuna]) => {
      const vizinha = this.criarCoordenada(coordenada, variacaoLinha, variacaoColuna);
      return vizinha ? [vizinha] : [];
    });
  }

  private criarCoordenada(
    origem: Coordenada,
    variacaoLinha: number,
    variacaoColuna: number,
  ): Coordenada | undefined {
    const codigoLinha = origem.linha.charCodeAt(0) + variacaoLinha;

    try {
      return new Coordenada(String.fromCharCode(codigoLinha), origem.coluna + variacaoColuna);
    } catch {
      return undefined;
    }
  }
}
