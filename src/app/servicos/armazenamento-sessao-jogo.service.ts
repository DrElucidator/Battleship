import { Injectable } from '@angular/core';
import { ModoPartida } from '../dominio/participante';
import { SessaoJogoPersistida } from '../modelos/sessao-jogo';

const CHAVE_ARMAZENAMENTO = 'batalha-naval.sessao.v1';

@Injectable({ providedIn: 'root' })
export class ArmazenamentoSessaoJogoService {
  carregar(): SessaoJogoPersistida | undefined {
    const valor = this.obterArmazenamento()?.getItem(CHAVE_ARMAZENAMENTO);

    if (!valor) {
      return undefined;
    }

    try {
      const sessao = this.validar(JSON.parse(valor));

      if (!sessao) {
        this.limpar();
      }

      return sessao;
    } catch {
      this.limpar();
      return undefined;
    }
  }

  salvar(sessao: SessaoJogoPersistida): void {
    this.obterArmazenamento()?.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(sessao));
  }

  limpar(): void {
    this.obterArmazenamento()?.removeItem(CHAVE_ARMAZENAMENTO);
  }

  private obterArmazenamento(): Storage | undefined {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  }

  private validar(valor: unknown): SessaoJogoPersistida | undefined {
    if (!this.ehObjeto(valor)) {
      return undefined;
    }

    const modo = valor['modo'];
    const tempoRestante = valor['tempoRestante'];
    const salvaEm = valor['salvaEm'];
    const versao = valor['versao'];
    const tabuleiroJogadorUm = valor['tabuleiroJogadorUm'];
    const partida = valor['partida'];

    if (
      versao !== 1 ||
      (modo !== ModoPartida.Computador && modo !== ModoPartida.Local) ||
      !this.ehTempoValido(tempoRestante) ||
      typeof salvaEm !== 'string' ||
      (tabuleiroJogadorUm !== undefined && !this.ehObjeto(tabuleiroJogadorUm)) ||
      (partida !== undefined && !this.ehObjeto(partida))
    ) {
      return undefined;
    }

    return valor as unknown as SessaoJogoPersistida;
  }

  private ehObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === 'object' && valor !== null;
  }

  private ehTempoValido(valor: unknown): valor is number {
    return typeof valor === 'number' && Number.isInteger(valor) && valor >= 0 && valor <= 90;
  }
}
