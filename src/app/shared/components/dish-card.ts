import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Dish } from '../../core/services/catalog';
import { Cart } from '../../core/services/cart';
import { ImgFallback } from '../directives/img-fallback';

@Component({
  selector: 'app-dish-card',
  imports: [CurrencyPipe, RouterLink, ImgFallback],
  template: `
    <div class="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <a [routerLink]="['/dish', dish().id]" class="block relative overflow-hidden">
        <img
          appImgFallback
          [src]="dish().imageUrl"
          [alt]="dish().name"
          class="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        >

        @if (discount(); as d) {
          <span class="absolute top-3 left-3 px-2.5 py-1 bg-rose-400 text-white text-xs font-bold rounded-full">
            −{{ d }}%
          </span>
        }

        @if (dish().tags.includes('Новинка')) {
          <span class="absolute bottom-3 left-3 px-2.5 py-1 bg-emerald-400 text-white text-xs font-semibold rounded-full">
            Новинка
          </span>
        }
      </a>

      <button
        type="button"
        (click)="preview.emit()"
        aria-label="Быстрый просмотр"
        class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-gray-600 hover:text-brand-600 hover:bg-white transition sm:opacity-0 sm:group-hover:opacity-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      <div class="p-4 flex flex-col flex-1">
        <a [routerLink]="['/dish', dish().id]" class="text-lg font-semibold text-gray-900 hover:text-brand-600 transition">
          {{ dish().name }}
        </a>
        <p class="text-sm text-gray-500 mt-1 mb-3 flex-1 line-clamp-2">{{ dish().description }}</p>

        <div class="flex items-center gap-2 mb-3 text-xs text-gray-400">
          <span class="text-amber-500 font-semibold">★ {{ dish().rating }}</span>
          <span>({{ dish().reviews }})</span>
          <span class="text-gray-300">•</span>
          <span>{{ dish().weightGrams }} г</span>
          <span class="text-gray-300">•</span>
          <span>{{ dish().kcal }} ккал</span>
        </div>

        <div class="flex items-center justify-between mt-auto gap-2">
          <div class="flex flex-col">
            <span class="text-xl font-bold text-gray-900 leading-tight">
              {{ dish().price | currency:'RUB':'symbol-narrow':'1.0-0' }}
            </span>
            @if (dish().oldPrice) {
              <span class="text-xs text-gray-400 line-through">
                {{ dish().oldPrice | currency:'RUB':'symbol-narrow':'1.0-0' }}
              </span>
            }
          </div>
          @if (cart.qty(dish().id) > 0) {
            <a
              [routerLink]="['/cart']"
              class="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 transition text-sm font-medium whitespace-nowrap flex items-center gap-1.5"
            >
              <span>✓</span> В корзине · {{ cart.qty(dish().id) }}
            </a>
          } @else {
            <button
              type="button"
              (click)="cart.add(dish())"
              class="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 active:scale-95 transition text-sm font-medium whitespace-nowrap"
            >
              + В корзину
            </button>
          }
        </div>
      </div>
    </div>
  `,
})
export class DishCard {
  readonly dish = input.required<Dish>();
  readonly preview = output<void>();

  readonly cart = inject(Cart);

  discount(): number | null {
    const { price, oldPrice } = this.dish();
    if (!oldPrice || oldPrice <= price) return null;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }
}
