import { ResultadoPartida } from '../dominio/partida';
import { Pontuacao } from '../dominio/placar';
import { ResumoParticipantePartida } from './resultado-batalha';

export interface RegistroPartida {
  readonly id: string;
  readonly concluidaEm: string;
  readonly resultado: ResultadoPartida;
  readonly duracaoSegundos: number;
  readonly resumoJogadorUm: ResumoParticipantePartida;
  readonly resumoJogadorDois: ResumoParticipantePartida;
}

export interface EstadoPartidasPersistido {
  readonly versao: 1;
  readonly pontuacao: Pontuacao;
  readonly historico: readonly RegistroPartida[];
}
