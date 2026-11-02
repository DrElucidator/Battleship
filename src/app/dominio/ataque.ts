import { Coordenada } from './coordenada';

export enum ResultadoAtaque {
  Agua = 'Agua',
  Acerto = 'Acerto',
  EmbarcacaoDestruida = 'EmbarcacaoDestruida',
}

export interface Ataque {
  readonly coordenada: Coordenada;
  readonly resultado: ResultadoAtaque;
}
