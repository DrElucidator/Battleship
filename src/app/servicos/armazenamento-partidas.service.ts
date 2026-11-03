import { Injectable } from '@angular/core';
import { EstadoPartidasPersistido, RegistroPartida } from '../modelos/registro-partida';
import { Pontuacao } from '../dominio/placar';

const CHAVE_ARMAZENAMENTO = 'batalha-naval.partidas.v1';
const LIMITE_HISTORICO = 20;
const PONTUACAO_INICIAL: Pontuacao = { jogadorUm: 0, jogadorDois: 0 };

@Injectable({ providedIn: 'root' })
export class ArmazenamentoPartidasService {
  carregar(): EstadoPartidasPersistido {
    const valor = this.obterArmazenamento()?.getItem(CHAVE_ARMAZENAMENTO);

    if (!valor) {
      return this.criarEstadoInicial();
    }

    try {
      return this.validarEstado(JSON.parse(valor));
    } catch {
      return this.criarEstadoInicial();
    }
  }

  salvarPontuacao(pontuacao: Pontuacao): void {
    const estado = this.carregar();
    this.salvar({ ...estado, pontuacao });
  }

  registrarPartida(registro: RegistroPartida, pontuacao: Pontuacao): void {
    const estado = this.carregar();
    const historico = [registro, ...estado.historico].slice(0, LIMITE_HISTORICO);
    this.salvar({ ...estado, pontuacao, historico });
  }

  private salvar(estado: EstadoPartidasPersistido): void {
    this.obterArmazenamento()?.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(estado));
  }

  private criarEstadoInicial(): EstadoPartidasPersistido {
    return {
      versao: 1,
      pontuacao: PONTUACAO_INICIAL,
      historico: [],
    };
  }

  private validarEstado(valor: unknown): EstadoPartidasPersistido {
    if (!this.ehObjeto(valor)) {
      return this.criarEstadoInicial();
    }

    const pontuacao = valor['pontuacao'];
    const historico = valor['historico'];

    if (!this.ehPontuacaoValida(pontuacao) || !Array.isArray(historico)) {
      return this.criarEstadoInicial();
    }

    return {
      versao: 1,
      pontuacao,
      historico: historico
        .filter((registro) => this.ehRegistroValido(registro))
        .slice(0, LIMITE_HISTORICO),
    };
  }

  private ehPontuacaoValida(valor: unknown): valor is Pontuacao {
    return (
      this.ehObjeto(valor) &&
      this.ehNumeroNaoNegativo(valor['jogadorUm']) &&
      this.ehNumeroNaoNegativo(valor['jogadorDois'])
    );
  }

  private ehRegistroValido(valor: unknown): valor is RegistroPartida {
    return (
      this.ehObjeto(valor) &&
      typeof valor['id'] === 'string' &&
      typeof valor['concluidaEm'] === 'string' &&
      typeof valor['resultado'] === 'string' &&
      this.ehNumeroNaoNegativo(valor['duracaoSegundos']) &&
      this.ehResumoValido(valor['resumoJogadorUm']) &&
      this.ehResumoValido(valor['resumoJogadorDois'])
    );
  }

  private ehResumoValido(valor: unknown): boolean {
    return (
      this.ehObjeto(valor) &&
      this.ehNumeroNaoNegativo(valor['ataques']) &&
      this.ehNumeroNaoNegativo(valor['agua']) &&
      this.ehNumeroNaoNegativo(valor['acertos']) &&
      this.ehNumeroNaoNegativo(valor['embarcacoesDestruidas'])
    );
  }

  private ehNumeroNaoNegativo(valor: unknown): valor is number {
    return typeof valor === 'number' && Number.isInteger(valor) && valor >= 0;
  }

  private ehObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === 'object' && valor !== null;
  }

  private obterArmazenamento(): Storage | undefined {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  }
}
