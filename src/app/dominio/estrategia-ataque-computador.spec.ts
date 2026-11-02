import { Coordenada } from './coordenada';
import { Embarcacao } from './embarcacao';
import { EstrategiaAtaqueComputador } from './estrategia-ataque-computador';
import { TipoEmbarcacao } from './frota';
import { Orientacao } from './orientacao';
import { Tabuleiro } from './tabuleiro';

describe('EstrategiaAtaqueComputador', () => {
  it('deve procurar uma célula vizinha depois do primeiro acerto', () => {
    const estrategia = new EstrategiaAtaqueComputador();
    const tabuleiro = criarTabuleiroCom(
      new Embarcacao(TipoEmbarcacao.Cruzador, new Coordenada('D', 4), Orientacao.Horizontal),
    );
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 4), TipoEmbarcacao.Cruzador);

    const coordenada = estrategia.escolherCoordenada(tabuleiro, () => 0);

    expect(coordenada.paraTexto()).toBe('D3');
  });

  it('deve seguir a mesma direção após dois acertos alinhados', () => {
    const estrategia = new EstrategiaAtaqueComputador();
    const tabuleiro = criarTabuleiroCom(
      new Embarcacao(TipoEmbarcacao.Cruzador, new Coordenada('D', 4), Orientacao.Horizontal),
    );
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 4), TipoEmbarcacao.Cruzador);
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 5), TipoEmbarcacao.Cruzador);

    const coordenada = estrategia.escolherCoordenada(tabuleiro, () => 0);

    expect(coordenada.paraTexto()).toBe('D6');
  });

  it('deve buscar a extremidade oposta quando a primeira direção não estiver disponível', () => {
    const estrategia = new EstrategiaAtaqueComputador();
    const tabuleiro = criarTabuleiroCom(
      new Embarcacao(TipoEmbarcacao.Cruzador, new Coordenada('B', 8), Orientacao.Horizontal),
    );
    registrarAtaque(estrategia, tabuleiro, new Coordenada('B', 10), TipoEmbarcacao.Cruzador);
    registrarAtaque(estrategia, tabuleiro, new Coordenada('B', 9), TipoEmbarcacao.Cruzador);

    const coordenada = estrategia.escolherCoordenada(tabuleiro, () => 0);

    expect(coordenada.paraTexto()).toBe('B8');
  });

  it('deve manter o alvo depois de uma tentativa na água', () => {
    const estrategia = new EstrategiaAtaqueComputador();
    const tabuleiro = criarTabuleiroCom(
      new Embarcacao(TipoEmbarcacao.PortaAvioes, new Coordenada('D', 4), Orientacao.Horizontal),
    );
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 4), TipoEmbarcacao.PortaAvioes);
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 5), TipoEmbarcacao.PortaAvioes);
    const resultado = tabuleiro.atacar(new Coordenada('C', 5));
    estrategia.registrarResultado(new Coordenada('C', 5), resultado, undefined);

    const coordenada = estrategia.escolherCoordenada(tabuleiro, () => 0);

    expect(coordenada.paraTexto()).toBe('D6');
  });

  it('deve abandonar o alvo apenas depois de destruir a embarcação', () => {
    const estrategia = new EstrategiaAtaqueComputador();
    const tabuleiro = criarTabuleiroCom(
      new Embarcacao(TipoEmbarcacao.Destroyer, new Coordenada('D', 4), Orientacao.Horizontal),
    );
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 4), TipoEmbarcacao.Destroyer);
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 5), TipoEmbarcacao.Destroyer);

    const coordenada = estrategia.escolherCoordenada(tabuleiro, () => 0);

    expect(coordenada.paraTexto()).toBe('A1');
  });

  it('deve concluir o alvo atual antes de investigar outro acerto adjacente', () => {
    const estrategia = new EstrategiaAtaqueComputador();
    const tabuleiro = criarTabuleiroCom(
      new Embarcacao(TipoEmbarcacao.Destroyer, new Coordenada('C', 10), Orientacao.Vertical),
      new Embarcacao(TipoEmbarcacao.Cruzador, new Coordenada('D', 7), Orientacao.Horizontal),
    );
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 10), TipoEmbarcacao.Destroyer);
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 9), TipoEmbarcacao.Cruzador);

    const coordenada = estrategia.escolherCoordenada(tabuleiro, () => 0);

    expect(coordenada.paraTexto()).toBe('C10');
  });

  it('deve continuar um alvo pendente mesmo após destruir uma embarcação adjacente', () => {
    const estrategia = new EstrategiaAtaqueComputador();
    const tabuleiro = criarTabuleiroCom(
      new Embarcacao(TipoEmbarcacao.Destroyer, new Coordenada('C', 10), Orientacao.Vertical),
      new Embarcacao(TipoEmbarcacao.Cruzador, new Coordenada('D', 7), Orientacao.Horizontal),
    );
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 10), TipoEmbarcacao.Destroyer);
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 7), TipoEmbarcacao.Cruzador);
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 8), TipoEmbarcacao.Cruzador);
    registrarAtaque(estrategia, tabuleiro, new Coordenada('D', 9), TipoEmbarcacao.Cruzador);

    const coordenada = estrategia.escolherCoordenada(tabuleiro, () => 0);

    expect(coordenada.paraTexto()).toBe('C10');
  });
});

function criarTabuleiroCom(...embarcacoes: Embarcacao[]): Tabuleiro {
  const tabuleiro = new Tabuleiro();

  for (const embarcacao of embarcacoes) {
    tabuleiro.posicionarEmbarcacao(embarcacao);
  }

  return tabuleiro;
}

function registrarAtaque(
  estrategia: EstrategiaAtaqueComputador,
  tabuleiro: Tabuleiro,
  coordenada: Coordenada,
  tipo: TipoEmbarcacao,
): void {
  const resultado = tabuleiro.atacar(coordenada);
  estrategia.registrarResultado(coordenada, resultado, tipo);
}
