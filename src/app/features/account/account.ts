import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Catalog, Dish } from '../../core/services/catalog';
import { Cart } from '../../core/services/cart';
import { DishCard } from '../../shared/components/dish-card';
import { Breadcrumbs } from '../../shared/components/breadcrumbs';
import { ImgFallback } from '../../shared/directives/img-fallback';

type Tab = 'orders' | 'addresses' | 'settings';

interface Order {
  id: number;
  date: string;
  status: 'Доставлен' | 'В пути';
  dishIds: number[];
}

@Component({
  selector: 'app-account',
  imports: [CurrencyPipe, DishCard, Breadcrumbs, ImgFallback],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-10">
      <app-breadcrumbs [items]="[{ label: 'Главная', link: '/' }, { label: 'Личный кабинет' }]" />

      <!-- Профиль -->
      <div class="bg-white rounded-3xl shadow-sm overflow-hidden mb-6">
        <div class="h-28 bg-linear-to-r from-brand-200 to-amber-100"></div>
        <div class="px-6 pb-6">
          <div class="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div class="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center text-5xl border-4 border-white">
              🧑
            </div>
            <div class="flex-1 sm:pb-1">
              <h1 class="text-2xl font-bold text-gray-900">{{ user.name }}</h1>
              <p class="text-gray-500 text-sm">{{ user.phone }} · {{ user.email }}</p>
            </div>
            <button
              type="button"
              class="self-start sm:self-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
            >
              Редактировать
            </button>
          </div>
        </div>
      </div>

      <!-- Статистика -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <div class="text-2xl mb-1">📦</div>
          <div class="text-2xl font-bold text-gray-900">{{ orders.length }}</div>
          <div class="text-sm text-gray-500">Заказов</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <div class="text-2xl mb-1">✅</div>
          <div class="text-2xl font-bold text-gray-900">{{ deliveredCount() }}</div>
          <div class="text-sm text-gray-500">Доставлено</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <div class="text-2xl mb-1">🎁</div>
          <div class="text-2xl font-bold text-brand-600">{{ bonusPoints }}</div>
          <div class="text-sm text-gray-500">Бонусов</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <div class="text-2xl mb-1">❤️</div>
          <div class="text-2xl font-bold text-gray-900">{{ favorites().length }}</div>
          <div class="text-sm text-gray-500">В избранном</div>
        </div>
      </div>

      <!-- Вкладки -->
      <div class="flex gap-2 mb-6 overflow-x-auto">
        @for (t of tabs; track t.key) {
          <button
            type="button"
            (click)="tab.set(t.key)"
            [class]="tab() === t.key
              ? 'px-5 py-2.5 rounded-xl bg-brand-500 text-white font-medium whitespace-nowrap'
              : 'px-5 py-2.5 rounded-xl bg-white text-gray-600 hover:bg-gray-100 font-medium whitespace-nowrap transition'"
          >
            {{ t.label }}
          </button>
        }
      </div>

      @switch (tab()) {
        @case ('orders') {
          @if (orders.length) {
            <div class="space-y-4">
              @for (o of orders; track o.id) {
                <div class="bg-white rounded-2xl shadow-sm p-5">
                  <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <div class="font-semibold text-gray-900">Заказ №{{ o.id }}</div>
                      <div class="text-sm text-gray-500">{{ o.date }} · {{ orderDishes(o).length }} товар(ов)</div>
                    </div>
                    <span
                      class="text-xs px-3 py-1 rounded-full font-medium"
                      [class]="o.status === 'Доставлен' ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'"
                    >
                      {{ o.status }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div class="text-lg font-bold text-gray-900">
                      {{ orderTotal(o) | currency:'RUB':'symbol-narrow':'1.0-0' }}
                    </div>
                    <button
                      type="button"
                      (click)="repeatOrder.set(o)"
                      class="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 transition text-sm font-medium"
                    >
                      Повторить заказ
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400">
              У вас пока нет заказов
            </div>
          }
        }

        @case ('addresses') {
          <div class="space-y-4">
            @for (a of addresses; track a.id) {
              <div class="bg-white rounded-2xl shadow-sm p-5 flex items-start justify-between gap-4">
                <div class="flex gap-4">
                  <div class="text-2xl">📍</div>
                  <div>
                    <div class="font-semibold text-gray-900">
                      {{ a.title }}
                      @if (a.primary) {
                        <span class="ml-2 text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full">Основной</span>
                      }
                    </div>
                    <div class="text-sm text-gray-500 mt-0.5">{{ a.text }}</div>
                  </div>
                </div>
                <button type="button" class="text-sm text-brand-600 hover:text-brand-700">Изменить</button>
              </div>
            }
            <button
              type="button"
              class="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-brand-300 hover:text-brand-600 transition font-medium"
            >
              + Добавить адрес
            </button>
          </div>
        }

        @case ('settings') {
          <div class="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
            @for (s of settings; track s.title) {
              <label class="flex items-center justify-between p-5 cursor-pointer">
                <div>
                  <div class="font-medium text-gray-900">{{ s.title }}</div>
                  <div class="text-sm text-gray-500">{{ s.text }}</div>
                </div>
                <input type="checkbox" [checked]="s.on" class="w-5 h-5 accent-brand-500">
              </label>
            }
          </div>
        }
      }

      <!-- Избранное -->
      @if (favorites().length) {
        <section class="mt-10">
          <h2 class="text-xl font-bold text-gray-900 mb-5">Любимые блюда</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @for (dish of favorites(); track dish.id) {
              <app-dish-card [dish]="dish" />
            }
          </div>
        </section>
      }
    </div>

    <!-- Модальное окно повторения заказа -->
    @if (repeatOrder(); as order) {
      <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="repeatOrder.set(null)"></div>

        <div class="relative bg-white w-full sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl">
          <div class="flex items-center justify-between p-4 sm:p-5 pb-2 shrink-0">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Заказ №{{ order.id }}</h2>
              <p class="text-sm text-gray-500">{{ order.date }} · {{ orderDishes(order).length }} товар(ов)</p>
            </div>
            <button
              type="button"
              (click)="repeatOrder.set(null)"
              aria-label="Закрыть"
              class="w-9 h-9 rounded-full bg-gray-100 shadow flex items-center justify-center text-gray-600 hover:bg-gray-200 shrink-0"
            >
              ✕
            </button>
          </div>

          <div class="overflow-y-auto px-4 sm:px-5">
            <div class="space-y-2">
              @for (dish of orderDishes(order); track dish.id) {
                <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5">
                  <img
                    appImgFallback
                    [src]="dish.imageUrl"
                    [alt]="dish.name"
                    class="w-14 h-14 object-cover rounded-lg shrink-0"
                  >
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900 truncate">{{ dish.name }}</div>
                    <div class="text-sm text-gray-500">{{ dish.price | currency:'RUB':'symbol-narrow':'1.0-0' }}</div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="p-4 sm:p-5 pt-4 shrink-0 border-t border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-500">Итого</span>
              <span class="text-xl font-bold text-gray-900">{{ orderTotal(order) | currency:'RUB':'symbol-narrow':'1.0-0' }}</span>
            </div>
            <div class="flex gap-3">
              <button
                type="button"
                (click)="repeatOrder.set(null)"
                class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
              >
                Отмена
              </button>
              <button
                type="button"
                (click)="confirmRepeat(order)"
                class="flex-1 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition font-semibold"
              >
                Добавить в корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class Account {
  readonly catalog = inject(Catalog);
  readonly cart = inject(Cart);

  readonly tab = signal<Tab>('orders');
  readonly repeatOrder = signal<Order | null>(null);
  readonly bonusPoints = 350;

  readonly tabs: { key: Tab; label: string }[] = [
    { key: 'orders', label: 'Заказы' },
    { key: 'addresses', label: 'Адреса' },
    { key: 'settings', label: 'Настройки' },
  ];

  readonly user = {
    name: 'Алексей Петров',
    phone: '+7 (900) 123-45-67',
    email: 'alexey@example.com',
  };

  readonly orders: Order[] = [
    { id: 1042, date: '01.10.2026', status: 'В пути', dishIds: [2, 9, 17] },
    { id: 1017, date: '24.09.2026', status: 'Доставлен', dishIds: [5, 1, 21, 17, 18] },
    { id: 998, date: '12.09.2026', status: 'Доставлен', dishIds: [13, 20] },
  ];

  readonly addresses = [
    { id: 1, title: 'Дом', text: 'г. Москва, ул. Ленина, д. 15, кв. 42', primary: true },
    { id: 2, title: 'Работа', text: 'г. Москва, Пресненская наб., д. 12, офис 305', primary: false },
  ];

  readonly settings = [
    { title: 'Push-уведомления', text: 'Статус заказа и акции', on: true },
    { title: 'SMS-уведомления', text: 'О доставке курьером', on: false },
    { title: 'Email-рассылка', text: 'Новинки и персональные скидки', on: true },
  ];

  readonly deliveredCount = computed(() => this.orders.filter((o) => o.status === 'Доставлен').length);

  readonly favorites = computed(() => this.catalog.popular(4));

  orderDishes(order: Order): Dish[] {
    return order.dishIds
      .map((id) => this.catalog.findById(id))
      .filter((d): d is Dish => !!d);
  }

  orderTotal(order: Order): number {
    return this.orderDishes(order).reduce((sum, d) => sum + d.price, 0);
  }

  confirmRepeat(order: Order): void {
    for (const dish of this.orderDishes(order)) {
      this.cart.add(dish);
    }
    this.repeatOrder.set(null);
  }
}
