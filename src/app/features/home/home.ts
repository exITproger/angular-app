import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Catalog, Dish } from '../../core/services/catalog';
import { DishCard } from '../../shared/components/dish-card';
import { QuickView } from '../../shared/components/quick-view';
import { SearchBox } from '../../shared/components/search-box';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DishCard, QuickView, SearchBox],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-linear-to-br from-brand-100 via-brand-50 to-amber-50 text-gray-900">
      <div class="absolute inset-0 opacity-40"
        style="background-image: radial-gradient(circle at 20% 30%, var(--color-brand-200) 2px, transparent 2px), radial-gradient(circle at 70% 60%, var(--color-brand-200) 2px, transparent 2px); background-size: 60px 60px;">
      </div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-24">
        <div class="max-w-2xl">
          <span class="inline-block px-3 py-1 bg-white/70 text-brand-700 rounded-full text-sm font-medium mb-4">
            🚀 Доставка за 30 минут
          </span>
          <h1 class="text-4xl sm:text-6xl font-extrabold leading-tight mb-4 text-gray-900">
            Вкусная еда <br>с доставкой на дом
          </h1>
          <p class="text-gray-600 text-lg mb-8">
            Более 40 блюд на любой вкус: пицца, суши, бургеры, десерты и многое другое.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 max-w-xl">
            <app-search-box
              [value]="query()"
              placeholder="Найти блюдо..."
              inputClass="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/70 border border-brand-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition"
              (valueChange)="query.set($event)"
              (submit)="search()"
            />
            <button
              type="button"
              (click)="search()"
              class="px-7 py-3.5 bg-brand-500 text-white rounded-xl hover:bg-brand-600 active:scale-95 transition font-semibold shrink-0"
            >
              Найти
            </button>
          </div>

          <div class="flex flex-wrap gap-x-8 gap-y-3 mt-8 text-gray-700">
            <div>
              <div class="text-2xl font-bold">40+</div>
              <div class="text-sm text-gray-500">блюд в меню</div>
            </div>
            <div>
              <div class="text-2xl font-bold">30 мин</div>
              <div class="text-sm text-gray-500">среднее время</div>
            </div>
            <div>
              <div class="text-2xl font-bold">4.8★</div>
              <div class="text-sm text-gray-500">рейтинг сервиса</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <!-- Категории -->
      <section class="py-10 sm:py-14">
        <div class="flex items-end justify-between mb-6">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Категории</h2>
            <p class="text-gray-500 mt-1">Выберите, что вам по вкусу</p>
          </div>
          <a routerLink="/catalog" class="hidden sm:inline text-brand-600 hover:text-brand-700 font-medium">
            Всё меню →
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          @for (cat of catalog.categories; track cat.id) {
            <a
              [routerLink]="['/catalog']"
              [queryParams]="{ cat: cat.id }"
              class="group bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center"
            >
              <div class="text-4xl mb-2 group-hover:scale-110 transition-transform">{{ cat.emoji }}</div>
              <div class="font-semibold text-gray-800">{{ cat.name }}</div>
              <div class="text-xs text-gray-400 mt-0.5">{{ catalog.countByCategory(cat.id) }} блюд</div>
            </a>
          }
        </div>
      </section>

      <!-- Акции -->
      <section class="pb-10 sm:pb-14">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Акции и предложения</h2>
        <div class="grid md:grid-cols-3 gap-4 sm:gap-6">
          <div class="relative overflow-hidden rounded-2xl bg-linear-to-br from-rose-100 to-rose-50 text-rose-900 p-6 min-h-40 flex flex-col justify-between">
            <div class="text-3xl">🎁</div>
            <div>
              <div class="text-xl font-bold">−20% на первый заказ</div>
              <p class="text-rose-700 text-sm mt-1">Промокод: <span class="font-semibold">WELCOME20</span></p>
            </div>
          </div>
          <div class="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-100 to-indigo-50 text-indigo-900 p-6 min-h-40 flex flex-col justify-between">
            <div class="text-3xl">🚚</div>
            <div>
              <div class="text-xl font-bold">Бесплатная доставка</div>
              <p class="text-indigo-700 text-sm mt-1">При заказе от 1500 ₽</p>
            </div>
          </div>
          <div class="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-100 to-emerald-50 text-emerald-900 p-6 min-h-40 flex flex-col justify-between">
            <div class="text-3xl">⭐</div>
            <div>
              <div class="text-xl font-bold">Бонусы за заказы</div>
              <p class="text-emerald-700 text-sm mt-1">Копите и оплачивайте до 30%</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Популярное -->
      <section class="pb-10 sm:pb-14">
        <div class="flex items-end justify-between mb-6">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Популярное</h2>
            <p class="text-gray-500 mt-1">Чаще всего заказывают</p>
          </div>
          <a routerLink="/catalog" class="hidden sm:inline text-brand-600 hover:text-brand-700 font-medium">
            Смотреть все →
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          @for (dish of popular; track dish.id) {
            <app-dish-card [dish]="dish" (preview)="previewDish.set(dish)" />
          }
        </div>
      </section>

      <!-- Преимущества -->
      <section class="pb-14">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          @for (f of features; track f.title) {
            <div class="bg-white rounded-2xl p-6 shadow-sm">
              <div class="text-3xl mb-3">{{ f.icon }}</div>
              <div class="font-semibold text-gray-900 mb-1">{{ f.title }}</div>
              <p class="text-sm text-gray-500">{{ f.text }}</p>
            </div>
          }
        </div>
      </section>
    </div>

    @if (previewDish(); as dish) {
      <app-quick-view
        [dish]="dish"
        [categoryName]="catalog.categoryName(dish.categoryId)"
        (close)="previewDish.set(null)"
      />
    }
  `,
})
export class Home {
  readonly catalog = inject(Catalog);
  private readonly router = inject(Router);

  readonly query = signal('');
  readonly previewDish = signal<Dish | null>(null);

  readonly popular = this.catalog.popular(8);

  readonly features = [
    { icon: '⏱️', title: 'Быстрая доставка', text: 'Привозим за 30 минут или компенсируем часть заказа.' },
    { icon: '🥗', title: 'Свежие продукты', text: 'Готовим из продуктов, привезённых сегодня утром.' },
    { icon: '👨‍🍳', title: 'Опытные повара', text: 'Блюда готовят шефы с профильным образованием.' },
    { icon: '💳', title: 'Удобная оплата', text: 'Оплачивайте картой, наличными или бонусами.' },
  ];

  search(): void {
    this.router.navigate(['/catalog'], {
      queryParams: this.query().trim() ? { q: this.query().trim() } : {},
    });
  }
}
