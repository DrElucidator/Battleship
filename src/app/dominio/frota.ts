export enum TipoEmbarcacao {
  PortaAvioes = 'PortaAvioes',
  Encouracado = 'Encouracado',
  Cruzador = 'Cruzador',
  Submarino = 'Submarino',
  Destroyer = 'Destroyer',
}

export interface DefinicaoEmbarcacao {
  readonly tipo: TipoEmbarcacao;
  readonly tamanho: number;
}

export const frotaOficial: readonly DefinicaoEmbarcacao[] = [
  { tipo: TipoEmbarcacao.PortaAvioes, tamanho: 5 },
  { tipo: TipoEmbarcacao.Encouracado, tamanho: 4 },
  { tipo: TipoEmbarcacao.Cruzador, tamanho: 3 },
  { tipo: TipoEmbarcacao.Submarino, tamanho: 3 },
  { tipo: TipoEmbarcacao.Destroyer, tamanho: 2 },
];

export function obterTamanhoEmbarcacao(tipo: TipoEmbarcacao): number {
  const embarcacao = frotaOficial.find((item) => item.tipo === tipo);

  if (!embarcacao) {
    throw new Error(`A embarcação ${tipo} não pertence à frota oficial.`);
  }

  return embarcacao.tamanho;
}
