import { TestBed } from '@angular/core/testing';
import { PreparacaoFrotaComponent } from './preparacao-frota';
import { TipoEmbarcacao } from '../../dominio/frota';
import { Orientacao } from '../../dominio/orientacao';
import { Coordenada } from '../../dominio/coordenada';
import { Tabuleiro } from '../../dominio/tabuleiro';

describe('PreparacaoFrotaComponent', () => {
  it('deve iniciar sem embarcação selecionada e com as cinco embarcações restantes', () => {
    const componente = criarComponente();

    expect(componente.embarcacaoSelecionada()).toBeNull();
    expect(componente.orientacao()).toBe(Orientacao.Horizontal);
    expect(componente.quantidadeDeEmbarcacoesRestantes()).toBe(5);
  });

  it('deve selecionar uma embarcação e orientar o próximo posicionamento', () => {
    const componente = criarComponente();

    componente.selecionarEmbarcacao(TipoEmbarcacao.Cruzador);
    componente.selecionarOrientacao(Orientacao.Vertical);

    expect(componente.embarcacaoSelecionada()).toBe(TipoEmbarcacao.Cruzador);
    expect(componente.orientacao()).toBe(Orientacao.Vertical);
    expect(componente.mensagem()).toBe('Escolha a coordenada inicial no tabuleiro.');
  });

  it('deve disponibilizar as 100 coordenadas do tabuleiro em dez linhas', () => {
    const componente = criarComponente();

    expect(componente.linhasDoTabuleiro).toHaveLength(10);
    expect(componente.colunas).toHaveLength(10);
    expect(componente.linhasDoTabuleiro[0]?.coordenadas[0]?.paraTexto()).toBe('A1');
    expect(componente.linhasDoTabuleiro.at(-1)?.coordenadas.at(-1)?.paraTexto()).toBe('J10');
  });

  it('deve posicionar a embarcação selecionada e atualizar sua projeção', () => {
    const componente = criarComponente();
    componente.selecionarEmbarcacao(TipoEmbarcacao.Cruzador);

    componente.posicionarEmbarcacao(new Coordenada('B', 2));

    expect(componente.embarcacoesPosicionadas()).toHaveLength(1);
    expect(componente.estaCoordenadaOcupada(new Coordenada('B', 4))).toBe(true);
    expect(componente.embarcacaoSelecionada()).toBeNull();
    expect(componente.quantidadeDeEmbarcacoesRestantes()).toBe(4);
    expect(componente.mensagem()).toBe('Cruzador posicionado em B2.');
  });

  it('deve manter o posicionamento existente quando houver sobreposição', () => {
    const componente = criarComponente();
    componente.selecionarEmbarcacao(TipoEmbarcacao.Cruzador);
    componente.posicionarEmbarcacao(new Coordenada('B', 2));
    componente.selecionarEmbarcacao(TipoEmbarcacao.Destroyer);

    componente.posicionarEmbarcacao(new Coordenada('B', 3));

    expect(componente.embarcacoesPosicionadas()).toHaveLength(1);
    expect(componente.mensagem()).toBe('A embarcação não pode ocupar uma posição já ocupada.');
  });

  it('deve remover uma embarcação para permitir seu reposicionamento', () => {
    const componente = criarComponente();
    componente.selecionarEmbarcacao(TipoEmbarcacao.Cruzador);
    componente.posicionarEmbarcacao(new Coordenada('B', 2));

    componente.reposicionarEmbarcacao(TipoEmbarcacao.Cruzador);

    expect(componente.embarcacoesPosicionadas()).toHaveLength(0);
    expect(componente.estaCoordenadaOcupada(new Coordenada('B', 2))).toBe(false);
    expect(componente.embarcacaoSelecionada()).toBe(TipoEmbarcacao.Cruzador);
    expect(componente.quantidadeDeEmbarcacoesRestantes()).toBe(5);
    expect(componente.mensagem()).toBe('Cruzador removido. Escolha uma nova coordenada inicial.');
  });

  it('deve permitir iniciar a batalha somente depois de posicionar toda a frota', () => {
    const componente = criarComponente();
    let tabuleiroIniciado: Tabuleiro | undefined;
    componente.batalhaIniciada.subscribe((tabuleiro) => {
      tabuleiroIniciado = tabuleiro;
    });
    const posicionamentos = [
      [TipoEmbarcacao.PortaAvioes, new Coordenada('A', 1)],
      [TipoEmbarcacao.Encouracado, new Coordenada('B', 1)],
      [TipoEmbarcacao.Cruzador, new Coordenada('C', 1)],
      [TipoEmbarcacao.Submarino, new Coordenada('D', 1)],
      [TipoEmbarcacao.Destroyer, new Coordenada('E', 1)],
    ] as const;

    componente.iniciarBatalha();
    expect(componente.frotaEstaCompleta()).toBe(false);

    for (const [tipo, coordenada] of posicionamentos) {
      componente.selecionarEmbarcacao(tipo);
      componente.posicionarEmbarcacao(coordenada);
    }

    componente.iniciarBatalha();

    expect(componente.frotaEstaCompleta()).toBe(true);
    expect(componente.quantidadeDeEmbarcacoesRestantes()).toBe(0);
    expect(tabuleiroIniciado?.obterEmbarcacoes()).toHaveLength(5);
  });
});

function criarComponente(): PreparacaoFrotaComponent {
  return TestBed.runInInjectionContext(() => new PreparacaoFrotaComponent());
}
