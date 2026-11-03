import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
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

  it('deve navegar do início para a preparação da frota', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    await fixture.whenStable();
    fixture.detectChanges();

    const elemento = fixture.nativeElement as HTMLElement;
    const botaoPreparacao = Array.from(elemento.querySelectorAll('button')).find((botao) =>
      botao.textContent?.includes('Preparar minha frota'),
    );

    expect(elemento.querySelector('h2')?.textContent).toContain('Comande sua frota');
    expect(botaoPreparacao).toBeTruthy();

    botaoPreparacao?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(elemento.querySelector('h2')?.textContent).toContain(
      'Jogador 1, posicione suas embarcações',
    );

    const botaoInicio = elemento.querySelector<HTMLButtonElement>(
      '[aria-label="Ir para o início"]',
    );
    botaoInicio?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(elemento.querySelector('h2')?.textContent).toContain('Comande sua frota');
  });
});
