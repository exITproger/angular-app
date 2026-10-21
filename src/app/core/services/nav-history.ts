import { Injectable, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { filter, pairwise } from 'rxjs';

const isDishUrl = (url: string) => /^\/dish\//.test(url);
const extractDishId = (url: string): number | null => {
  const match = url.match(/^\/dish\/(\d+)/);
  return match ? Number(match[1]) : null;
};

/**
 * Запоминает, откуда пользователь перешёл в карточку товара:
 * - URL страницы-источника (каталог с фильтрами)
 * - Номер страницы пагинации
 * - Позицию скролла
 *
 * При возврате через кнопку «Назад» — восстанавливает всё.
 * При любой другой навигации (хлебные крошки, меню) — сбрасывает состояние.
 */
@Injectable({ providedIn: 'root' })
export class NavHistory {
  private readonly router = inject(Router);

  private origin: string | null = null;
  private previous: string | null = null;

  /** Состояние каталога перед переходом в товар */
  private savedState: {
    page: number;
    scrollY: number;
    dishId: number | null;
  } | null = null;

  /** Флаг: навигация инициирована кнопкой «Назад» */
  private isBackNavigation = false;

  constructor() {
    this.router.events
      .pipe(
        filter(
          (e): e is NavigationEnd | NavigationStart =>
            e instanceof NavigationEnd || e instanceof NavigationStart,
        ),
        pairwise(),
      )
      .subscribe(([from, to]) => {
        const fromUrl = this.getUrl(from);
        const toUrl = this.getUrl(to);
        const fromIsDish = isDishUrl(fromUrl);
        const toIsDish = isDishUrl(toUrl);

        if (toIsDish && !fromIsDish) {
          // вошли в карточку товара с обычной страницы — запоминаем источник
          this.origin = fromUrl;
        } else if (toIsDish) {
          // переход между товарами — origin не трогаем
        } else if (!toIsDish) {
          // вернулись в обычную навигацию
          if (!this.isBackNavigation) {
            // это НЕ возврат через кнопку «Назад» — сбрасываем всё
            this.origin = null;
            this.savedState = null;
          }
          this.isBackNavigation = false;
        }

        this.previous = toUrl;
      });
  }

  private getUrl(e: RouterEvent): string {
    if (e instanceof NavigationEnd) return e.urlAfterRedirects;
    return e.url;
  }

  /**
   * Вызывается в Detail при загрузке — запоминаем ID открытого товара.
   */
  recordDishEnter(dishId: number): void {
    if (this.savedState) {
      this.savedState.dishId = dishId;
    }
  }

  /**
   * Сохраняет состояние каталога перед переходом в карточку товара.
   * Вызывается из CatalogPage перед навигацией.
   */
  saveState(page: number, scrollY: number): void {
    this.savedState = {
      page,
      scrollY,
      dishId: this.savedState?.dishId ?? null,
    };
  }

  /**
   * Восстанавливает и очищает сохранённое состояние.
   * Вызывается в CatalogPage при загрузке.
   * Возвращает null, если состояние не было сохранено.
   */
  restoreState(): { page: number; scrollY: number; dishId: number | null } | null {
    const s = this.savedState;
    this.savedState = null;
    return s;
  }

  /**
   * Возвращает на предыдущую страницу.
   * Устанавливает флаг, чтобы навигация не сбросила savedState.
   */
  back(): void {
    this.isBackNavigation = true;
    this.router.navigateByUrl(this.origin ?? '/catalog');
  }
}
