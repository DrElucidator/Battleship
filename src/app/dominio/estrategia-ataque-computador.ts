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
    const candidatos = new Map<string, Coordenada>();

    for (const acerto of tabuleiro.obterCoordenadasAtingidasDeEmbarcacoesNaoDestruidas()) {
      for (const vizinha of this.obterCoordenadasVizinhas(acerto)) {
        if (!coordenadasAtacadas.has(vizinha.paraTexto())) {
          candidatos.set(vizinha.paraTexto(), vizinha);
        }
      }
    }

    return [...candidatos.values()];
  }

  private obterCoordenadasVizinhas(coordenada: Coordenada): readonly Coordenada[] {
    const variacoes = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ] as const;

    return variacoes.flatMap(([variacaoLinha, variacaoColuna]) => {
      const codigoLinha = coordenada.linha.charCodeAt(0) + variacaoLinha;

      try {
        return [new Coordenada(String.fromCharCode(codigoLinha), coordenada.coluna + variacaoColuna)];
      } catch {
        return [];
      }
    });
  }
}
