import { Coordenada } from './coordenada';
import { TipoEmbarcacao } from './frota';

export enum ResultadoAtaque {
  Agua = 'Agua',
  Acerto = 'Acerto',
  EmbarcacaoDestruida = 'EmbarcacaoDestruida',
}

export interface Ataque {
  readonly coordenada: Coordenada;
  readonly resultado: ResultadoAtaque;
  readonly embarcacaoAtingida?: TipoEmbarcacao;
  readonly embarcacaoAfundada?: TipoEmbarcacao;
}
