import { Coordenada } from './coordenada';
import { Embarcacao } from './embarcacao';
import { EstrategiaAtaqueComputador } from './estrategia-ataque-computador';
import { TipoEmbarcacao } from './frota';
import { Orientacao } from './orientacao';
import { Tabuleiro } from './tabuleiro';

describe('EstrategiaAtaqueComputador', () => {
  it('deve priorizar uma coordenada vizinha após acertar embarcação não destruída', () => {
    const tabuleiro = criarTabuleiroComDestroyer();
    tabuleiro.atacar(new Coordenada('D', 4));
    const estrategia = new EstrategiaAtaqueComputador();

    const coordenada = estrategia.escolherCoordenada(tabuleiro, () => 0);

    expect(['C4', 'E4', 'D3', 'D5']).toContain(coordenada.paraTexto());
  });

  it('não deve continuar priorizando uma embarcação já destruída', () => {
    const tabuleiro = criarTabuleiroComDestroyer();
    tabuleiro.atacar(new Coordenada('D', 4));
    tabuleiro.atacar(new Coordenada('D', 5));
    const estrategia = new EstrategiaAtaqueComputador();

    const coordenada = estrategia.escolherCoordenada(tabuleiro, () => 0);

    expect(coordenada.paraTexto()).toBe('A1');
  });
});

function criarTabuleiroComDestroyer(): Tabuleiro {
  const tabuleiro = new Tabuleiro();
  tabuleiro.posicionarEmbarcacao(
    new Embarcacao(TipoEmbarcacao.Destroyer, new Coordenada('D', 4), Orientacao.Horizontal),
  );

  return tabuleiro;
}
