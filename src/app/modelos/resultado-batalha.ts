import { MotivoEncerramentoPartida, ResultadoPartida } from '../dominio/partida';

export interface ResumoParticipantePartida {
  readonly ataques: number;
  readonly agua: number;
  readonly acertos: number;
  readonly embarcacoesDestruidas: number;
}

export interface ResultadoBatalha {
  readonly resultado: ResultadoPartida;
  readonly motivoEncerramento: MotivoEncerramentoPartida;
  readonly duracaoSegundos: number;
  readonly resumoJogadorUm: ResumoParticipantePartida;
  readonly resumoJogadorDois: ResumoParticipantePartida;
}
