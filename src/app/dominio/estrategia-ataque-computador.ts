import { ResultadoAtaque } from './ataque';
import { Coordenada } from './coordenada';
import { GeradorAleatorio } from './fabrica-frota-computador';
import { TipoEmbarcacao } from './frota';
import { EstadoEmbarcacao, Tabuleiro } from './tabuleiro';

export class EstrategiaAtaqueComputador {
  private readonly tiposDescobertos: TipoEmbarcacao[] = [];
  private tipoAlvoAtual: TipoEmbarcacao | undefined;

  escolherCoordenada(tabuleiro: Tabuleiro, geradorAleatorio: GeradorAleatorio = Math.random): Coordenada {
    const coordenadasAtacadas = new Set(
      tabuleiro.obterAtaques().map((ataque) => ataque.coordenada.paraTexto()),
    );
    const alvo = this.obterAlvoPendente(tabuleiro.obterEstadosEmbarcacoes());

    if (alvo) {
      const coordenada = this.escolherCoordenadaDoAlvo(
        alvo,
        coordenadasAtacadas,
        geradorAleatorio,
      );

      if (coordenada) {
        return coordenada;
      }

      throw new Error('Não foi possível concluir a investigação da embarcação atingida.');
    }

    const coordenadasDisponiveis = tabuleiro
      .obterCoordenadas()
      .filter((coordenada) => !coordenadasAtacadas.has(coordenada.paraTexto()));
    const coordenada = this.sortearCoordenada(coordenadasDisponiveis, geradorAleatorio);

    if (!coordenada) {
      throw new RangeError('Não há coordenadas disponíveis para ataque.');
    }

    return coordenada;
  }

  registrarResultado(
    _coordenada: Coordenada,
    resultado: ResultadoAtaque,
    tipoEmbarcacao: TipoEmbarcacao | undefined,
  ): void {
    if (resultado === ResultadoAtaque.Agua || !tipoEmbarcacao) {
      return;
    }

    if (!this.tiposDescobertos.includes(tipoEmbarcacao)) {
      this.tiposDescobertos.push(tipoEmbarcacao);
    }

    if (resultado === ResultadoAtaque.EmbarcacaoDestruida) {
      this.removerTipoDescoberto(tipoEmbarcacao);

      if (this.tipoAlvoAtual === tipoEmbarcacao) {
        this.tipoAlvoAtual = undefined;
      }

      return;
    }

    if (!this.tipoAlvoAtual) {
      this.tipoAlvoAtual = tipoEmbarcacao;
    }
  }

  private obterAlvoPendente(
    estadosEmbarcacoes: readonly EstadoEmbarcacao[],
  ): EstadoEmbarcacao | undefined {
    const alvosPendentes = estadosEmbarcacoes.filter(
      (estado) => !estado.afundada && estado.posicoesAtingidas.length > 0,
    );
    const alvoAtual = alvosPendentes.find((estado) => estado.tipo === this.tipoAlvoAtual);

    if (alvoAtual) {
      return alvoAtual;
    }

    const alvoConhecido = this.tiposDescobertos
      .map((tipo) => alvosPendentes.find((estado) => estado.tipo === tipo))
      .find((estado) => estado !== undefined);

    if (alvoConhecido) {
      this.tipoAlvoAtual = alvoConhecido.tipo;
      return alvoConhecido;
    }

    const [primeiroAlvo] = alvosPendentes;

    if (primeiroAlvo) {
      this.tipoAlvoAtual = primeiroAlvo.tipo;
    }

    return primeiroAlvo;
  }

  private escolherCoordenadaDoAlvo(
    alvo: EstadoEmbarcacao,
    coordenadasAtacadas: ReadonlySet<string>,
    geradorAleatorio: GeradorAleatorio,
  ): Coordenada | undefined {
    if (alvo.posicoesAtingidas.length === 1) {
      const [acerto] = alvo.posicoesAtingidas;

      return acerto
        ? this.sortearCoordenada(
            this.obterCoordenadasVizinhas(acerto).filter(
              (coordenada) => !coordenadasAtacadas.has(coordenada.paraTexto()),
            ),
            geradorAleatorio,
            false,
          )
        : undefined;
    }

    const penultimo = alvo.posicoesAtingidas.at(-2);
    const ultimo = alvo.posicoesAtingidas.at(-1);

    if (!penultimo || !ultimo) {
      return undefined;
    }

    const variacaoLinha = ultimo.linha.charCodeAt(0) - penultimo.linha.charCodeAt(0);
    const variacaoColuna = ultimo.coluna - penultimo.coluna;
    const proxima = this.criarCoordenada(ultimo, variacaoLinha, variacaoColuna);

    if (proxima && !coordenadasAtacadas.has(proxima.paraTexto())) {
      return proxima;
    }

    const primeira = alvo.posicoesAtingidas[0];
    const ladoOposto = primeira
      ? this.criarCoordenada(primeira, -variacaoLinha, -variacaoColuna)
      : undefined;

    return ladoOposto && !coordenadasAtacadas.has(ladoOposto.paraTexto())
      ? ladoOposto
      : undefined;
  }

  private removerTipoDescoberto(tipo: TipoEmbarcacao): void {
    const indice = this.tiposDescobertos.indexOf(tipo);

    if (indice !== -1) {
      this.tiposDescobertos.splice(indice, 1);
    }
  }

  private sortearCoordenada(
    coordenadas: readonly Coordenada[],
    geradorAleatorio: GeradorAleatorio,
    obrigatoria = true,
  ): Coordenada | undefined {
    const indice = Math.floor(geradorAleatorio() * coordenadas.length);
    const coordenada = coordenadas[indice];

    if (coordenada || !obrigatoria) {
      return coordenada;
    }

    throw new RangeError('Não há coordenadas disponíveis para ataque.');
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
