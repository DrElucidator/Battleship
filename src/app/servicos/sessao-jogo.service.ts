import { Injectable, inject, signal } from '@angular/core';
import { FabricaFrotaComputador } from '../dominio/fabrica-frota-computador';
import { Partida } from '../dominio/partida';
import { ModoPartida } from '../dominio/participante';
import { Placar, Pontuacao } from '../dominio/placar';
import { Tabuleiro } from '../dominio/tabuleiro';
import { ResultadoBatalha } from '../modelos/resultado-batalha';
import { ArmazenamentoPartidasService } from './armazenamento-partidas.service';

@Injectable({ providedIn: 'root' })
export class SessaoJogoService {
  private readonly armazenamentoPartidas = inject(ArmazenamentoPartidasService);
  private readonly placar = new Placar(this.armazenamentoPartidas.carregar().pontuacao);
  private readonly fabricaFrotaComputador = new FabricaFrotaComputador();
  readonly modo = signal(ModoPartida.Computador);
  readonly partida = signal<Partida | null>(null);
  readonly pontuacao = signal<Pontuacao>(this.placar.obterPontuacao());
  private readonly tabuleiroJogadorUm = signal<Tabuleiro | null>(null);

  iniciarPreparacao(modo: ModoPartida): void {
    this.modo.set(modo);
    this.partida.set(null);
    this.tabuleiroJogadorUm.set(null);
  }

  concluirPreparacaoJogadorUm(tabuleiro: Tabuleiro): 'batalha' | 'troca-jogador' {
    if (this.modo() === ModoPartida.Computador) {
      this.iniciarBatalha(tabuleiro, this.fabricaFrotaComputador.criar());
      return 'batalha';
    }

    this.tabuleiroJogadorUm.set(tabuleiro);
    return 'troca-jogador';
  }

  concluirPreparacaoJogadorDois(tabuleiro: Tabuleiro): boolean {
    const tabuleiroJogadorUm = this.tabuleiroJogadorUm();

    if (!tabuleiroJogadorUm) {
      return false;
    }

    this.iniciarBatalha(tabuleiroJogadorUm, tabuleiro);
    return true;
  }

  iniciarNovaPartida(): void {
    this.partida.set(null);
    this.tabuleiroJogadorUm.set(null);
  }

  voltarParaInicio(): void {
    this.partida.set(null);
    this.tabuleiroJogadorUm.set(null);
  }

  possuiPreparacaoJogadorUm(): boolean {
    return this.tabuleiroJogadorUm() !== null;
  }

  registrarResultado(resultadoBatalha: ResultadoBatalha): void {
    this.placar.registrarResultado(resultadoBatalha.resultado);
    const pontuacao = this.placar.obterPontuacao();
    this.pontuacao.set(pontuacao);
    this.armazenamentoPartidas.registrarPartida(
      {
        id: crypto.randomUUID(),
        concluidaEm: new Date().toISOString(),
        resultado: resultadoBatalha.resultado,
        duracaoSegundos: resultadoBatalha.duracaoSegundos,
        resumoJogadorUm: resultadoBatalha.resumoJogadorUm,
        resumoJogadorDois: resultadoBatalha.resumoJogadorDois,
      },
      pontuacao,
    );
  }

  private iniciarBatalha(tabuleiroJogadorUm: Tabuleiro, tabuleiroJogadorDois: Tabuleiro): void {
    this.partida.set(new Partida(tabuleiroJogadorUm, tabuleiroJogadorDois));
  }
}
