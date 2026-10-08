import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Catalog, Dish } from '../../core/services/catalog';
import { Cart } from '../../core/services/cart';
import { NavHistory } from '../../core/services/nav-history';
import { Carousel } from '../../shared/components/carousel';
import { Breadcrumbs, Crumb } from '../../shared/components/breadcrumbs';
import { DishCard } from '../../shared/components/dish-card';
import { QuickView } from '../../shared/components/quick-view';

@Component({
  selector: 'app-detail',
  imports: [CurrencyPipe, RouterLink, Carousel, Breadcrumbs, DishCard, QuickView],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-10">
      @if (dish(); as d) {
        <button
          type="button"
          (click)="goBack()"
          class="inline-flex items-center gap-2 mb-4 px-3 py-2 -ml-1 rounded-lg text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition"
        >
          <span aria-hidden="true">←</span> Назад
        </button>

        <app-breadcrumbs [items]="crumbs()" />

        <div class="grid md:grid-cols-2 gap-6 sm:gap-10">
          <div>
            <app-carousel [images]="d.images" [alt]="d.name" />
          </div>

          <div class="flex flex-col">
            <span class="text-sm text-brand-600 font-semibold mb-1">
              {{ catalog.categoryEmoji(d.categoryId) }} {{ catalog.categoryName(d.categoryId) }}
            </span>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{{ d.name }}</h1>

            <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 text-sm text-gray-500">
              <span class="flex items-center gap-1 text-amber-500 font-semibold">★ {{ d.rating }}</span>
              <span class="text-gray-300">•</span>
              <span>{{ d.reviews }} отзывов</span>
              <span class="text-gray-300">•</span>
              <span>🕒 {{ d.prepMinutes }} мин</span>
            </div>

            @if (d.tags.length) {
              <div class="flex flex-wrap gap-2 mb-5">
                @for (tag of d.tags; track tag) {
                  <span class="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">{{ tag }}</span>
                }
              </div>
            }

            <p class="text-gray-600 leading-relaxed mb-6">{{ d.description }}</p>

            <div class="grid grid-cols-3 gap-3 mb-6">
              <div class="bg-white rounded-xl py-3 text-center shadow-sm">
                <div class="font-semibold text-gray-800">{{ d.weightGrams }} г</div>
                <div class="text-xs text-gray-400">Вес</div>
              </div>
              <div class="bg-white rounded-xl py-3 text-center shadow-sm">
                <div class="font-semibold text-gray-800">{{ d.kcal }}</div>
                <div class="text-xs text-gray-400">Ккал</div>
              </div>
              <div class="bg-white rounded-xl py-3 text-center shadow-sm">
                <div class="font-semibold text-gray-800">{{ d.prepMinutes }} мин</div>
                <div class="text-xs text-gray-400">Готовить</div>
              </div>
            </div>

            <div class="mt-auto flex items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm">
              <div>
                <div class="text-3xl font-bold text-gray-900">
                  {{ d.price | currency:'RUB':'symbol-narrow':'1.0-0' }}
                </div>
                @if (d.oldPrice) {
                  <div class="text-sm text-gray-400 line-through">
                    {{ d.oldPrice | currency:'RUB':'symbol-narrow':'1.0-0' }}
                  </div>
                }
              </div>
              @if (cart.qty(d.id) > 0) {
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    (click)="cart.changeQuantity(d.id, -1)"
                    aria-label="Уменьшить количество"
                    class="w-10 h-10 border border-gray-200 rounded-xl hover:bg-gray-50 text-lg leading-none"
                  >
                    −
                  </button>
                  <span class="w-8 text-center font-semibold text-lg">{{ cart.qty(d.id) }}</span>
                  <button
                    type="button"
                    (click)="cart.changeQuantity(d.id, 1)"
                    aria-label="Увеличить количество"
                    class="w-10 h-10 border border-gray-200 rounded-xl hover:bg-gray-50 text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              } @else {
                <button
                  type="button"
                  (click)="addToCart()"
                  class="px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 active:scale-95 transition font-medium"
                >
                  + В корзину
                </button>
              }
            </div>
          </div>
        </div>

        @if (related().length) {
          <section class="mt-14">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Похожие блюда</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              @for (item of related(); track item.id) {
                <app-dish-card [dish]="item" (preview)="previewDish.set(item)" />
              }
            </div>
          </section>
        }
      } @else {
        <div class="text-center py-20 text-gray-400">
          <p class="text-4xl mb-3">🤷</p>
          <p class="text-2xl mb-4">Блюдо не найдено</p>
          <a routerLink="/catalog" class="text-brand-600 hover:underline">Вернуться в меню</a>
        </div>
      }
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
export class Detail {
  readonly id = input.required({ transform: numberAttribute });

  readonly catalog = inject(Catalog);
  readonly cart = inject(Cart);
  private readonly navHistory = inject(NavHistory);

  readonly previewDish = signal<Dish | null>(null);

  readonly dish = computed(() => this.catalog.findById(this.id()));

  readonly related = computed(() => {
    const d = this.dish();
    return d ? this.catalog.related(d, 4) : [];
  });

  readonly crumbs = computed<Crumb[]>(() => {
    const d = this.dish();
    if (!d) {
      return [
        { label: 'Главная', link: '/' },
        { label: 'Меню', link: '/catalog' },
      ];
    }
    return [
      { label: 'Главная', link: '/' },
      { label: 'Меню', link: '/catalog' },
      {
        label: this.catalog.categoryName(d.categoryId),
        link: '/catalog',
        queryParams: { cat: d.categoryId },
      },
      { label: d.name },
    ];
  });

  addToCart(): void {
    const d = this.dish();
    if (d) this.cart.add(d);
  }

  goBack(): void {
    this.navHistory.back();
  }
}
