import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalog, Dish } from '../../core/services/catalog';
import { DishCard } from '../../shared/components/dish-card';
import { QuickView } from '../../shared/components/quick-view';
import { Breadcrumbs, Crumb } from '../../shared/components/breadcrumbs';
import { SearchBox } from '../../shared/components/search-box';

type SortKey = 'popular' | 'rating' | 'price-asc' | 'price-desc' | 'new';

@Component({
  selector: 'app-catalog',
  imports: [NgTemplateOutlet, DishCard, QuickView, Breadcrumbs, SearchBox],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-10">
      <app-breadcrumbs [items]="crumbs()" />

      <div class="mb-6">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">
          {{ title() }}
        </h1>
        <p class="text-gray-500 mt-1">Найдено блюд: {{ filtered().length }}</p>
      </div>

      <!-- Панель управления -->
      <div class="flex flex-col lg:flex-row gap-3 mb-6">
        <app-search-box
          [value]="search()"
          placeholder="Поиск блюд..."
          (valueChange)="onSearch($event)"
        />

        <div class="flex flex-col sm:flex-row gap-3">
          <select
            [value]="sort()"
            (change)="setSort($any($event.target).value)"
            class="w-full sm:flex-1 lg:flex-none min-w-0 px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="popular">Сначала популярные</option>
            <option value="rating">По рейтингу</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="new">Сначала новинки</option>
          </select>

          <button
            type="button"
            (click)="filtersOpen.set(!filtersOpen())"
            class="lg:hidden w-full sm:w-auto shrink-0 px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-medium flex items-center justify-center gap-2"
          >
            <span>⚙️</span> Фильтры
            @if (activeFiltersCount() > 0) {
              <span class="w-5 h-5 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center">
                {{ activeFiltersCount() }}
              </span>
            }
          </button>
        </div>
      </div>

      <div class="flex gap-8">
        <!-- Сайдбар (десктоп) -->
        <aside class="hidden lg:block w-64 shrink-0">
          <ng-container [ngTemplateOutlet]="filters" />
        </aside>

        <!-- Сетка -->
        <div class="flex-1 min-w-0">
          @if (paged().length) {
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              @for (dish of paged(); track dish.id) {
                <app-dish-card [dish]="dish" (preview)="previewDish.set(dish)" />
              }
            </div>

            @if (totalPages() > 1) {
              <nav class="flex flex-wrap items-center justify-center gap-1.5 mt-10" aria-label="Пагинация">
                <button
                  type="button"
                  (click)="goToPage(page() - 1)"
                  [disabled]="page() === 1"
                  class="w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand-400 disabled:opacity-40 disabled:hover:border-gray-200 transition"
                >
                  ‹
                </button>

                @for (p of pages(); track p) {
                  <button
                    type="button"
                    (click)="goToPage(p)"
                    [class]="p === page()
                      ? 'w-10 h-10 rounded-lg bg-brand-500 text-white font-semibold'
                      : 'w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-brand-400 transition'"
                  >
                    {{ p }}
                  </button>
                }

                <button
                  type="button"
                  (click)="goToPage(page() + 1)"
                  [disabled]="page() === totalPages()"
                  class="w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand-400 disabled:opacity-40 disabled:hover:border-gray-200 transition"
                >
                  ›
                </button>
              </nav>
            }
          } @else {
            <div class="text-center py-20 text-gray-400 bg-white rounded-2xl">
              <p class="text-4xl mb-3">😕</p>
              <p class="text-xl mb-2">Ничего не найдено</p>
              <p class="mb-6">Попробуйте изменить фильтры или поисковый запрос</p>
              <button
                type="button"
                (click)="resetFilters()"
                class="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition font-medium"
              >
                Сбросить фильтры
              </button>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Шаблон фильтров -->
    <ng-template #filters>
      <div class="bg-white rounded-2xl p-5 shadow-sm space-y-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scroll-area">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-gray-900">Фильтры</h2>
          @if (activeFiltersCount() > 0) {
            <button type="button" (click)="resetFilters()" class="text-sm text-brand-600 hover:text-brand-700">
              Сбросить
            </button>
          }
        </div>

        <!-- Категории -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Категории</h3>
          <div class="space-y-1">
            <button
              type="button"
              (click)="setCategory(null)"
              [class]="category() === null
                ? 'w-full text-left px-3 py-2 rounded-lg bg-brand-50 text-brand-700 font-medium text-sm'
                : 'w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm transition'"
            >
              Все категории
            </button>
            @for (cat of catalog.categories; track cat.id) {
              <button
                type="button"
                (click)="setCategory(cat.id)"
                [class]="category() === cat.id
                  ? 'w-full text-left px-3 py-2 rounded-lg bg-brand-50 text-brand-700 font-medium text-sm flex items-center justify-between'
                  : 'w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm transition flex items-center justify-between'"
              >
                <span>{{ cat.emoji }} {{ cat.name }}</span>
                <span class="text-xs text-gray-400">{{ catalog.countByCategory(cat.id) }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Цена -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Цена, ₽</h3>
          <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{{ minPrice() }} ₽</span>
            <span>{{ maxPrice() }} ₽</span>
          </div>
          <div class="space-y-2">
            <input
              type="range"
              [min]="catalog.minPrice()"
              [max]="catalog.maxPrice()"
              [value]="minPrice()"
              (input)="onMinPrice($any($event.target).value)"
              class="w-full accent-brand-500"
            >
            <input
              type="range"
              [min]="catalog.minPrice()"
              [max]="catalog.maxPrice()"
              [value]="maxPrice()"
              (input)="onMaxPrice($any($event.target).value)"
              class="w-full accent-brand-500"
            >
          </div>
        </div>

        <!-- Теги -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Особенности</h3>
          <div class="flex flex-wrap gap-2">
            @for (tag of catalog.allTags; track tag) {
              <button
                type="button"
                (click)="toggleTag(tag)"
                [class]="selectedTags().includes(tag)
                  ? 'px-3 py-1.5 rounded-full bg-brand-500 text-white text-xs font-medium transition'
                  : 'px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 text-xs hover:border-brand-300 transition'"
              >
                {{ tag }}
              </button>
            }
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Фильтры (мобильные) -->
    @if (filtersOpen()) {
      <div class="fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-black/50" (click)="filtersOpen.set(false)"></div>
        <div class="absolute bottom-0 inset-x-0 max-h-[85vh] flex flex-col bg-gray-50 rounded-t-3xl">
          <div class="flex items-center justify-between p-4 pb-2 shrink-0">
            <h2 class="text-lg font-bold text-gray-900">Фильтры</h2>
            <button
              type="button"
              (click)="filtersOpen.set(false)"
              class="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-600 shrink-0"
            >
              ✕
            </button>
          </div>
          <div class="overflow-y-auto px-4 pb-4">
            <ng-container [ngTemplateOutlet]="filters" />
            <button
              type="button"
              (click)="filtersOpen.set(false)"
              class="w-full mt-4 py-3 bg-brand-500 text-white rounded-xl font-semibold"
            >
              Показать {{ filtered().length }} блюд
            </button>
          </div>
        </div>
      </div>
    }

    @if (previewDish(); as dish) {
      <app-quick-view
        [dish]="dish"
        [categoryName]="catalog.categoryName(dish.categoryId)"
        (close)="previewDish.set(null)"
      />
    }

    <!-- Кнопка «наверх» -->
    @if (showScrollTop()) {
      <button
        type="button"
        (click)="scrollToTop()"
        aria-label="Наверх"
        class="fixed right-4 bottom-20 md:bottom-8 z-40 w-11 h-11 rounded-full bg-brand-500 text-white shadow-lg flex items-center justify-center hover:bg-brand-600 active:scale-95 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    }
  `,
})
export class CatalogPage {
  readonly catalog = inject(Catalog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly search = signal('');
  readonly category = signal<number | null>(null);
  readonly selectedTags = signal<string[]>([]);
  readonly minPrice = signal(this.catalog.minPrice());
  readonly maxPrice = signal(this.catalog.maxPrice());
  readonly sort = signal<SortKey>('popular');
  readonly page = signal(1);
  readonly pageSize = 12;
  readonly filtersOpen = signal(false);
  readonly previewDish = signal<Dish | null>(null);
  readonly showScrollTop = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop.set(window.scrollY > 400);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  readonly title = computed(() => {
    const cat = this.category();
    return cat !== null ? this.catalog.categoryName(cat) : 'Меню';
  });

  readonly crumbs = computed<Crumb[]>(() => {
    const cat = this.category();
    const items: Crumb[] = [{ label: 'Главная', link: '/' }, { label: 'Меню', link: '/catalog' }];
    if (cat !== null) {
      items.push({ label: this.catalog.categoryName(cat) });
    }
    return items;
  });

  readonly activeFiltersCount = computed(
    () =>
      (this.category() !== null ? 1 : 0) +
      this.selectedTags().length +
      (this.minPrice() !== this.catalog.minPrice() || this.maxPrice() !== this.catalog.maxPrice() ? 1 : 0),
  );

  readonly filtered = computed<Dish[]>(() => {
    const q = this.search().toLowerCase().trim();
    const cat = this.category();
    const tags = this.selectedTags();
    const min = this.minPrice();
    const max = this.maxPrice();

    const list = this.catalog.dishes().filter((d) => {
      if (q && !d.name.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q)) return false;
      if (cat !== null && d.categoryId !== cat) return false;
      if (tags.length && !tags.every((t) => d.tags.includes(t))) return false;
      if (d.price < min || d.price > max) return false;
      return true;
    });

    switch (this.sort()) {
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'new':
        return list.sort(
          (a, b) => Number(b.tags.includes('Новинка')) - Number(a.tags.includes('Новинка')),
        );
      default:
        return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    }
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));

  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  readonly paged = computed(() => {
    const p = Math.min(this.page(), this.totalPages());
    const start = (p - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const cat = params.get('cat');
      this.category.set(cat ? Number(cat) : null);
      const q = params.get('q');
      if (q) this.search.set(q);
      this.page.set(1);
    });

    // если после фильтрации текущая страница стала недоступной — возвращаемся на первую
    effect(() => {
      if (this.page() > this.totalPages()) {
        this.page.set(1);
      }
    });
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  setSort(value: SortKey): void {
    this.sort.set(value);
    this.page.set(1);
  }

  setCategory(id: number | null): void {
    this.category.set(id);
    this.page.set(1);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { cat: id ?? null },
      queryParamsHandling: 'merge',
    });
  }

  toggleTag(tag: string): void {
    this.selectedTags.update((tags) =>
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    );
    this.page.set(1);
  }

  onMinPrice(value: string): void {
    const v = Number(value);
    this.minPrice.set(Math.min(v, this.maxPrice()));
    this.page.set(1);
  }

  onMaxPrice(value: string): void {
    const v = Number(value);
    this.maxPrice.set(Math.max(v, this.minPrice()));
    this.page.set(1);
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters(): void {
    this.selectedTags.set([]);
    this.minPrice.set(this.catalog.minPrice());
    this.maxPrice.set(this.catalog.maxPrice());
    this.search.set('');
    this.sort.set('popular');
    this.page.set(1);
    this.setCategory(null);
  }
}
