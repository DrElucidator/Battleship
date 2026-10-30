import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('deve renderizar o cabecalho com o nome do jogo, o icone e a area principal', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector('h1')?.textContent).toContain('Batalha Naval');
    expect(elemento.querySelector('header svg')).toBeTruthy();
    expect(elemento.querySelector('main')).toBeTruthy();
  });
});
