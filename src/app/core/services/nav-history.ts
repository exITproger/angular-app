import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

const isDishUrl = (url: string) => /^\/dish\//.test(url);

/**
 * Запоминает страницу, с которой пользователь вошёл в карточку товара.
 * Если переходить между товарами (товар → товар), источник сохраняется,
 * поэтому кнопка «Назад» вернёт на каталог/главную, а не на предыдущий товар.
 */
@Injectable({ providedIn: 'root' })
export class NavHistory {
  private readonly router = inject(Router);

  private origin: string | null = null;
  private previous: string | null = null;

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects;
        const currentIsDish = isDishUrl(url);
        const previousIsDish = this.previous ? isDishUrl(this.previous) : false;

        if (currentIsDish && !previousIsDish && this.previous) {
          // вошли в карточку товара с обычной страницы — запоминаем её
          this.origin = this.previous;
        } else if (!currentIsDish) {
          // вернулись в обычную навигацию — сбрасываем источник
          this.origin = null;
        }

        this.previous = url;
      });
  }

  /** URL страницы-источника (каталог/главная) или null */
  get backUrl(): string | null {
    return this.origin;
  }

  back(): void {
    this.router.navigateByUrl(this.origin ?? '/catalog');
  }
}
