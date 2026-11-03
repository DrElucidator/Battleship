import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Coordenada } from '../../dominio/coordenada';
import { Embarcacao } from '../../dominio/embarcacao';
import { TipoEmbarcacao } from '../../dominio/frota';
import { Orientacao } from '../../dominio/orientacao';
import { Partida, ResultadoPartida } from '../../dominio/partida';
import { ModoPartida, ParticipantePartida } from '../../dominio/participante';
import { Tabuleiro } from '../../dominio/tabuleiro';
import { BatalhaComponent } from './batalha';

describe('BatalhaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatalhaComponent],
    }).compileComponents();
  });

  it('deve informar o processamento da resposta do computador antes de executá-la', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(BatalhaComponent);
    const partida = criarPartida();
    fixture.componentRef.setInput('partida', partida);
    fixture.componentRef.setInput('pontuacao', { jogadorUm: 0, jogadorDois: 0 });

    fixture.componentInstance.atacarAdversario(new Coordenada('B', 1));

    expect(fixture.componentInstance.processamentoComputador()).toBe(true);
    expect(fixture.componentInstance.mensagem()).toBe(
      'O computador está escolhendo uma coordenada.',
    );

    vi.advanceTimersByTime(1_000);

    expect(fixture.componentInstance.processamentoComputador()).toBe(false);
    expect(fixture.componentInstance.ultimaJogada()?.tabuleiroAtacado).toBe(
      ParticipantePartida.JogadorUm,
    );
    vi.useRealTimers();
  });

  it('deve identificar o tipo da embarcação em uma coordenada da frota do jogador', () => {
    const fixture = TestBed.createComponent(BatalhaComponent);
    fixture.componentRef.setInput('partida', criarPartida());
    fixture.componentRef.setInput('pontuacao', { jogadorUm: 0, jogadorDois: 0 });

    const tipo = fixture.componentInstance.obterTipoEmbarcacaoJogador(new Coordenada('A', 1));

    expect(tipo).toBe(TipoEmbarcacao.Destroyer);
  });

  it('deve encerrar a partida quando o tempo do jogador terminar', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(BatalhaComponent);
    const partida = criarPartida();
    fixture.componentRef.setInput('partida', partida);
    fixture.componentRef.setInput('pontuacao', { jogadorUm: 0, jogadorDois: 0 });
    fixture.detectChanges();

    vi.advanceTimersByTime(90_000);

    expect(partida.resultado).toBe(ResultadoPartida.VitoriaJogadorDois);
    expect(fixture.componentInstance.segundosRestantes()).toBe(0);
    fixture.destroy();
    vi.useRealTimers();
  });

  it('deve manter os tabuleiros fixos e alternar o turno local automaticamente', () => {
    const fixture = TestBed.createComponent(BatalhaComponent);
    fixture.componentRef.setInput('partida', criarPartida());
    fixture.componentRef.setInput('pontuacao', { jogadorUm: 0, jogadorDois: 0 });
    fixture.componentRef.setInput('modo', ModoPartida.Local);
    fixture.detectChanges();

    fixture.componentInstance.atacarTabuleiro(ParticipantePartida.JogadorDois, new Coordenada('B', 1));

    expect(fixture.componentInstance.turnoAtual()).toBe(ParticipantePartida.JogadorDois);
    expect(fixture.componentInstance.jogadorVisivel()).toBe(ParticipantePartida.JogadorDois);
    expect(
      fixture.componentInstance.podeAtacarTabuleiro(
        ParticipantePartida.JogadorUm,
        new Coordenada('A', 1),
      ),
    ).toBe(true);
  });

  it('deve contabilizar a célula que afunda uma embarcação como acerto', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(BatalhaComponent);
    const partida = criarPartida();
    fixture.componentRef.setInput('partida', partida);
    fixture.componentRef.setInput('pontuacao', { jogadorUm: 0, jogadorDois: 0 });

    fixture.componentInstance.atacarAdversario(new Coordenada('B', 1));
    vi.advanceTimersByTime(1_000);
    fixture.componentInstance.atacarAdversario(new Coordenada('B', 2));

    expect(fixture.componentInstance.resumoJogador().acertos).toBe(2);
    fixture.destroy();
    vi.useRealTimers();
  });
});

function criarPartida(): Partida {
  const tabuleiroJogador = new Tabuleiro();
  const tabuleiroComputador = new Tabuleiro();
  tabuleiroJogador.posicionarEmbarcacao(
    new Embarcacao(TipoEmbarcacao.Destroyer, new Coordenada('A', 1), Orientacao.Horizontal),
  );
  tabuleiroComputador.posicionarEmbarcacao(
    new Embarcacao(TipoEmbarcacao.Destroyer, new Coordenada('B', 1), Orientacao.Horizontal),
  );

  return new Partida(tabuleiroJogador, tabuleiroComputador);
}
