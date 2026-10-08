import { Component, HostListener, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Dish } from '../../core/services/catalog';
import { Cart } from '../../core/services/cart';
import { Carousel } from './carousel';

@Component({
  selector: 'app-quick-view',
  imports: [Carousel, CurrencyPipe, RouterLink],
  template: `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="close.emit()"></div>

      <div
        class="relative bg-white w-full sm:max-w-4xl max-h-[92vh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl"
      >
        <button
          type="button"
          (click)="close.emit()"
          aria-label="Закрыть"
          class="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition"
        >
          ✕
        </button>

        <div class="overflow-y-auto">
          <div class="grid md:grid-cols-2 gap-6 p-4 sm:p-6">
          <app-carousel [images]="dish().images" [alt]="dish().name" />

          <div class="flex flex-col">
            <span class="text-sm text-brand-600 font-semibold mb-1">
              {{ categoryName() }}
            </span>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{{ dish().name }}</h2>

            <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 text-sm text-gray-500">
              <span class="flex items-center gap-1 text-amber-500 font-semibold">★ {{ dish().rating }}</span>
              <span class="text-gray-300">•</span>
              <span>{{ dish().reviews }} отзывов</span>
              <span class="text-gray-300">•</span>
              <span>🕒 {{ dish().prepMinutes }} мин</span>
            </div>

            @if (dish().tags.length) {
              <div class="flex flex-wrap gap-2 mb-4">
                @for (tag of dish().tags; track tag) {
                  <span class="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">{{ tag }}</span>
                }
              </div>
            }

            <p class="text-gray-600 leading-relaxed mb-5">{{ dish().description }}</p>

            <div class="grid grid-cols-3 gap-3 mb-6 text-center">
              <div class="bg-gray-50 rounded-xl py-3">
                <div class="font-semibold text-gray-800">{{ dish().weightGrams }} г</div>
                <div class="text-xs text-gray-400">Вес</div>
              </div>
              <div class="bg-gray-50 rounded-xl py-3">
                <div class="font-semibold text-gray-800">{{ dish().kcal }}</div>
                <div class="text-xs text-gray-400">Ккал</div>
              </div>
              <div class="bg-gray-50 rounded-xl py-3">
                <div class="font-semibold text-gray-800">{{ dish().prepMinutes }} мин</div>
                <div class="text-xs text-gray-400">Готовить</div>
              </div>
            </div>

            <div class="mt-auto flex items-center justify-between gap-4">
              <div>
                <div class="text-3xl font-bold text-gray-900">
                  {{ dish().price | currency:'RUB':'symbol-narrow':'1.0-0' }}
                </div>
                @if (dish().oldPrice) {
                  <div class="text-sm text-gray-400 line-through">
                    {{ dish().oldPrice | currency:'RUB':'symbol-narrow':'1.0-0' }}
                  </div>
                }
              </div>
              @if (cart.qty(dish().id) > 0) {
                <a
                  [routerLink]="['/cart']"
                  (click)="close.emit()"
                  class="px-6 py-3 bg-brand-50 text-brand-700 rounded-xl hover:bg-brand-100 transition font-medium flex items-center gap-2"
                >
                  <span>✓</span> В корзине · {{ cart.qty(dish().id) }}
                </a>
              } @else {
                <button
                  type="button"
                  (click)="cart.add(dish())"
                  class="px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 active:scale-95 transition font-medium"
                >
                  + В корзину
                </button>
              }
            </div>

            <a
              [routerLink]="['/dish', dish().id]"
              (click)="close.emit()"
              class="mt-4 text-center text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              Перейти на страницу блюда →
            </a>
          </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class QuickView {
  readonly dish = input.required<Dish>();
  readonly categoryName = input('');
  readonly close = output<void>();

  readonly cart = inject(Cart);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
