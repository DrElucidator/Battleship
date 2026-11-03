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

  it('deve apresentar o jogo antes de exibir a preparação da frota', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const elemento = fixture.nativeElement as HTMLElement;
    const botaoPreparacao = Array.from(elemento.querySelectorAll('button')).find((botao) =>
      botao.textContent?.includes('Preparar minha frota'),
    );

    expect(elemento.querySelector('h2')?.textContent).toContain('Comande sua frota');
    expect(botaoPreparacao).toBeTruthy();

    botaoPreparacao?.click();
    fixture.detectChanges();

    expect(elemento.querySelector('h2')?.textContent).toContain('Posicione suas embarcações');

    const botaoInicio = elemento.querySelector<HTMLButtonElement>(
      '[aria-label="Voltar ao início"]',
    );
    botaoInicio?.click();
    fixture.detectChanges();

    expect(elemento.querySelector('h2')?.textContent).toContain('Comande sua frota');
  });
});
