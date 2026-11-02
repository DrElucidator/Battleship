import { PreparacaoFrotaComponent } from './preparacao-frota';
import { TipoEmbarcacao } from '../../dominio/frota';
import { Orientacao } from '../../dominio/orientacao';

describe('PreparacaoFrotaComponent', () => {
  it('deve iniciar sem embarcação selecionada e com as cinco embarcações restantes', () => {
    const componente = new PreparacaoFrotaComponent();

    expect(componente.embarcacaoSelecionada()).toBeNull();
    expect(componente.orientacao()).toBe(Orientacao.Horizontal);
    expect(componente.quantidadeDeEmbarcacoesRestantes()).toBe(5);
  });

  it('deve selecionar uma embarcação e orientar o próximo posicionamento', () => {
    const componente = new PreparacaoFrotaComponent();

    componente.selecionarEmbarcacao(TipoEmbarcacao.Cruzador);
    componente.selecionarOrientacao(Orientacao.Vertical);

    expect(componente.embarcacaoSelecionada()).toBe(TipoEmbarcacao.Cruzador);
    expect(componente.orientacao()).toBe(Orientacao.Vertical);
    expect(componente.mensagem()).toBe('Escolha a coordenada inicial no tabuleiro.');
  });

  it('deve disponibilizar as 100 coordenadas do tabuleiro em dez linhas', () => {
    const componente = new PreparacaoFrotaComponent();

    expect(componente.linhasDoTabuleiro).toHaveLength(10);
    expect(componente.colunas).toHaveLength(10);
    expect(componente.linhasDoTabuleiro[0]?.coordenadas[0]?.paraTexto()).toBe('A1');
    expect(componente.linhasDoTabuleiro.at(-1)?.coordenadas.at(-1)?.paraTexto()).toBe('J10');
  });
});
