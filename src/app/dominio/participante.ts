export enum ModoPartida {
  Computador = 'Computador',
  Local = 'Local',
}

export enum ParticipantePartida {
  JogadorUm = 'JogadorUm',
  JogadorDois = 'JogadorDois',
}

export function obterAdversario(participante: ParticipantePartida): ParticipantePartida {
  return participante === ParticipantePartida.JogadorUm
    ? ParticipantePartida.JogadorDois
    : ParticipantePartida.JogadorUm;
}
