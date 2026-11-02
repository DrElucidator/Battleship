import { Ataque, ResultadoAtaque } from './ataque';
import { Coordenada, LinhaTabuleiro } from './coordenada';
import { Embarcacao } from './embarcacao';

const linhas: readonly LinhaTabuleiro[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export class Tabuleiro {
  readonly quantidadeDeLinhas = linhas.length;
  readonly quantidadeDeColunas = 10;
  private readonly embarcacoes: Embarcacao[] = [];
  private readonly ataques: Ataque[] = [];

  obterCoordenadas(): readonly Coordenada[] {
    return linhas.flatMap((linha) =>
      Array.from(
        { length: this.quantidadeDeColunas },
        (_, indice) => new Coordenada(linha, indice + 1),
      ),
    );
  }

  posicionarEmbarcacao(embarcacao: Embarcacao): void {
    if (this.possuiPosicaoOcupada(embarcacao)) {
      throw new Error('A embarcação não pode ocupar uma posição já ocupada.');
    }

    this.embarcacoes.push(embarcacao);
  }

  obterEmbarcacoes(): readonly Embarcacao[] {
    return [...this.embarcacoes];
  }

  atacar(coordenada: Coordenada): ResultadoAtaque {
    if (this.coordenadaJaFoiAtacada(coordenada)) {
      throw new Error('A coordenada já foi atacada.');
    }

    const embarcacaoAtingida = this.encontrarEmbarcacaoNaCoordenada(coordenada);
    const resultado = embarcacaoAtingida
      ? this.obterResultadoDoAcerto(embarcacaoAtingida, coordenada)
      : ResultadoAtaque.Agua;

    this.ataques.push({ coordenada, resultado });

    return resultado;
  }

  obterAtaques(): readonly Ataque[] {
    return [...this.ataques];
  }

  private possuiPosicaoOcupada(embarcacao: Embarcacao): boolean {
    const posicoesOcupadas = new Set(
      this.embarcacoes.flatMap((item) => item.posicoes.map((posicao) => posicao.paraTexto())),
    );

    return embarcacao.posicoes.some((posicao) => posicoesOcupadas.has(posicao.paraTexto()));
  }

  private coordenadaJaFoiAtacada(coordenada: Coordenada): boolean {
    return this.ataques.some((ataque) => ataque.coordenada.paraTexto() === coordenada.paraTexto());
  }

  private encontrarEmbarcacaoNaCoordenada(coordenada: Coordenada): Embarcacao | undefined {
    return this.embarcacoes.find((embarcacao) =>
      embarcacao.posicoes.some((posicao) => posicao.paraTexto() === coordenada.paraTexto()),
    );
  }

  private obterResultadoDoAcerto(embarcacao: Embarcacao, coordenada: Coordenada): ResultadoAtaque {
    const coordenadasAtingidas = new Set(
      this.ataques.map((ataque) => ataque.coordenada.paraTexto()),
    );
    coordenadasAtingidas.add(coordenada.paraTexto());

    const foiDestruida = embarcacao.posicoes.every((posicao) =>
      coordenadasAtingidas.has(posicao.paraTexto()),
    );

    return foiDestruida ? ResultadoAtaque.EmbarcacaoDestruida : ResultadoAtaque.Acerto;
  }
}
