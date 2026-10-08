import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart } from '../../core/services/cart';
import { Breadcrumbs } from '../../shared/components/breadcrumbs';
import { ImgFallback } from '../../shared/directives/img-fallback';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, Breadcrumbs, ImgFallback],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-10">
      <app-breadcrumbs [items]="[{ label: 'Главная', link: '/' }, { label: 'Корзина' }]" />
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Корзина</h1>

      @if (cart.items().length === 0) {
        <div class="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p class="text-5xl mb-4">🛒</p>
          <p class="text-gray-500 mb-6">Корзина пуста</p>
          <a
            routerLink="/catalog"
            class="inline-block px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition font-medium"
          >
            Перейти в меню
          </a>
        </div>
      } @else {
        <div class="space-y-3 mb-6">
          @for (item of cart.items(); track item.id) {
            <div class="flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl shadow-sm">
              <img
                appImgFallback
                [src]="item.imageUrl"
                [alt]="item.name"
                class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0"
              >
              <div class="flex-1 min-w-0">
                <a
                  [routerLink]="['/dish', item.id]"
                  class="font-semibold text-gray-900 truncate hover:text-brand-600 transition block"
                >
                  {{ item.name }}
                </a>
                <p class="text-sm text-gray-500">
                  {{ item.price | currency:'RUB':'symbol-narrow':'1.0-0' }}
                </p>
                <div class="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    (click)="cart.changeQuantity(item.id, -1)"
                    class="w-8 h-8 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                  <button
                    type="button"
                    (click)="cart.changeQuantity(item.id, 1)"
                    class="w-8 h-8 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
              <div class="text-right shrink-0">
                <div class="font-bold text-gray-900">
                  {{ item.price * item.quantity | currency:'RUB':'symbol-narrow':'1.0-0' }}
                </div>
                <button
                  type="button"
                  (click)="cart.remove(item.id)"
                  class="text-red-500 hover:text-red-700 text-sm mt-2"
                >
                  Удалить
                </button>
              </div>
            </div>
          }
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm">
          <div class="flex items-center justify-between text-xl font-bold mb-1">
            <span>Итого:</span>
            <span>{{ cart.totalPrice() | currency:'RUB':'symbol-narrow':'1.0-0' }}</span>
          </div>
          <p class="text-sm text-gray-500 mb-4">Доставка рассчитывается при оформлении</p>
          <button
            type="button"
            class="w-full px-6 py-3.5 bg-brand-500 text-white rounded-xl hover:bg-brand-600 active:scale-[0.99] transition font-semibold"
          >
            Оформить заказ
          </button>
        </div>
      }
    </div>
  `,
})
export class CartPage {
  readonly cart = inject(Cart);
}
