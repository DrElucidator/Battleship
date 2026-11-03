import { ResultadoPartida } from '../dominio/partida';
import { ArmazenamentoPartidasService } from './armazenamento-partidas.service';

describe('ArmazenamentoPartidasService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve retornar um estado inicial quando não houver dados persistidos', () => {
    const servico = new ArmazenamentoPartidasService();

    expect(servico.carregar()).toEqual({
      versao: 1,
      pontuacao: { jogadorUm: 0, jogadorDois: 0 },
      historico: [],
    });
  });

  it('deve manter a pontuação ao recarregar o armazenamento', () => {
    const servico = new ArmazenamentoPartidasService();

    servico.salvarPontuacao({ jogadorUm: 3, jogadorDois: 2 });

    expect(servico.carregar().pontuacao).toEqual({ jogadorUm: 3, jogadorDois: 2 });
  });

  it('deve adicionar partidas recentes ao histórico', () => {
    const servico = new ArmazenamentoPartidasService();

    servico.registrarPartida(
      {
        id: 'partida-1',
        concluidaEm: '2026-11-03T12:00:00.000Z',
        resultado: ResultadoPartida.VitoriaJogadorUm,
        duracaoSegundos: 120,
        resumoJogadorUm: {
          ataques: 10,
          agua: 4,
          acertos: 6,
          embarcacoesDestruidas: 2,
        },
        resumoJogadorDois: {
          ataques: 8,
          agua: 5,
          acertos: 3,
          embarcacoesDestruidas: 1,
        },
      },
      { jogadorUm: 1, jogadorDois: 0 },
    );

    const estado = servico.carregar();

    expect(estado.historico).toHaveLength(1);
    expect(estado.historico[0]?.id).toBe('partida-1');
    expect(estado.pontuacao).toEqual({ jogadorUm: 1, jogadorDois: 0 });
  });

  it('deve ignorar dados persistidos inválidos', () => {
    localStorage.setItem('batalha-naval.partidas.v1', '{inválido');
    const servico = new ArmazenamentoPartidasService();

    expect(servico.carregar().pontuacao).toEqual({ jogadorUm: 0, jogadorDois: 0 });
  });
});
