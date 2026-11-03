import { Routes } from '@angular/router';
import { ModoPartida } from './dominio/participante';
import { InicioPage } from './paginas/inicio/inicio';
import { PartidaPage } from './paginas/partida/partida';
import { PreparacaoPage } from './paginas/preparacao/preparacao';

export const routes: Routes = [
  { path: '', component: InicioPage, title: 'Batalha Naval | Início' },
  {
    path: 'preparar/cpu',
    component: PreparacaoPage,
    title: 'Batalha Naval | Preparar frota',
    data: { etapa: 'cpu' },
  },
  {
    path: 'preparar/local/jogador-1',
    component: PreparacaoPage,
    title: 'Batalha Naval | Preparar Jogador 1',
    data: { etapa: 'jogador-1' },
  },
  {
    path: 'preparar/local/troca',
    component: PreparacaoPage,
    title: 'Batalha Naval | Troca de jogador',
    data: { etapa: 'troca' },
  },
  {
    path: 'preparar/local/jogador-2',
    component: PreparacaoPage,
    title: 'Batalha Naval | Preparar Jogador 2',
    data: { etapa: 'jogador-2' },
  },
  {
    path: 'partida/cpu',
    component: PartidaPage,
    title: 'Batalha Naval | Contra o computador',
    data: { modo: ModoPartida.Computador },
  },
  {
    path: 'partida/local',
    component: PartidaPage,
    title: 'Batalha Naval | Dois jogadores',
    data: { modo: ModoPartida.Local },
  },
  { path: '**', redirectTo: '' },
];
