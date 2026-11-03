import { ModoPartida, ParticipantePartida } from '../dominio/participante';
import { Orientacao } from '../dominio/orientacao';
import { TipoEmbarcacao } from '../dominio/frota';

export interface CoordenadaPersistida {
  readonly linha: string;
  readonly coluna: number;
}

export interface EmbarcacaoPersistida {
  readonly tipo: TipoEmbarcacao;
  readonly origem: CoordenadaPersistida;
  readonly orientacao: Orientacao;
}

export interface TabuleiroPersistido {
  readonly embarcacoes: readonly EmbarcacaoPersistida[];
}

export interface JogadaPersistida {
  readonly atacante: ParticipantePartida;
  readonly coordenada: CoordenadaPersistida;
}

export interface PartidaPersistida {
  readonly tabuleiroJogadorUm: TabuleiroPersistido;
  readonly tabuleiroJogadorDois: TabuleiroPersistido;
  readonly jogadas: readonly JogadaPersistida[];
  readonly participanteSemTempo?: ParticipantePartida;
}

export interface SessaoJogoPersistida {
  readonly versao: 1;
  readonly modo: ModoPartida;
  readonly tabuleiroJogadorUm?: TabuleiroPersistido;
  readonly partida?: PartidaPersistida;
  readonly tempoRestante: number;
  readonly salvaEm: string;
}
