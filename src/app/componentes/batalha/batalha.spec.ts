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

  it('deve proteger os tabuleiros durante a troca de turno local', () => {
    const fixture = TestBed.createComponent(BatalhaComponent);
    fixture.componentRef.setInput('partida', criarPartida());
    fixture.componentRef.setInput('pontuacao', { jogadorUm: 0, jogadorDois: 0 });
    fixture.componentRef.setInput('modo', ModoPartida.Local);
    fixture.detectChanges();

    expect(fixture.componentInstance.trocaPendente()).toBe(ParticipantePartida.JogadorUm);

    fixture.componentInstance.confirmarTrocaDeJogador();
    fixture.componentInstance.atacarAdversario(new Coordenada('B', 1));

    expect(fixture.componentInstance.trocaPendente()).toBe(ParticipantePartida.JogadorDois);
    expect(fixture.componentInstance.jogadorVisivel()).toBe(ParticipantePartida.JogadorUm);

    fixture.componentInstance.confirmarTrocaDeJogador();

    expect(fixture.componentInstance.jogadorVisivel()).toBe(ParticipantePartida.JogadorDois);
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
