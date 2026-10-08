import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Catalog } from '../../core/services/catalog';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="bg-white border-t border-gray-100 pb-20 md:pb-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <!-- Бренд -->
          <div class="col-span-2 md:col-span-1">
            <a routerLink="/" class="flex items-center gap-2 text-xl font-bold text-brand-600 mb-3">
              <span class="text-2xl">🍔</span> FoodShop
            </a>
            <p class="text-sm text-gray-500 leading-relaxed mb-4">
              Вкусная еда с доставкой за 30 минут. Более 40 блюд на любой вкус.
            </p>
          </div>

          <!-- Меню -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">Меню</h3>
            <ul class="space-y-2 text-sm">
              @for (cat of catalog.categories; track cat.id) {
                <li>
                  <a [routerLink]="['/catalog']" [queryParams]="{ cat: cat.id }"
                    class="text-gray-500 hover:text-brand-600 transition">{{ cat.name }}</a>
                </li>
              }
            </ul>
          </div>

          <!-- Сервис -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">Сервис</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/" class="text-gray-500 hover:text-brand-600 transition">Главная</a></li>
              <li><a routerLink="/catalog" class="text-gray-500 hover:text-brand-600 transition">Всё меню</a></li>
              <li><a routerLink="/cart" class="text-gray-500 hover:text-brand-600 transition">Корзина</a></li>
              <li><a routerLink="/account" class="text-gray-500 hover:text-brand-600 transition">Личный кабинет</a></li>
              <li><a routerLink="/account" class="text-gray-500 hover:text-brand-600 transition">Мои заказы</a></li>
            </ul>
          </div>

          <!-- Контакты -->
          <div class="col-span-2 md:col-span-1">
            <h3 class="font-semibold text-gray-900 mb-3">Контакты</h3>
            <ul class="flex flex-wrap gap-x-5 gap-y-2 md:block md:space-y-2 text-sm">
              <li>
                <a href="tel:+78001234567" class="text-gray-500 hover:text-brand-600 transition whitespace-nowrap">📞 +7 (800) 123-45-67</a>
              </li>
              <li>
                <a href="mailto:hello@foodshop.ru" class="text-gray-500 hover:text-brand-600 transition whitespace-nowrap">✉️ hello@foodshop.ru</a>
              </li>
              <li>
                <a href="https://yandex.ru/maps/" target="_blank" rel="noopener"
                  class="text-gray-500 hover:text-brand-600 transition">📍 г. Кострома, ул. Ивановская, 24а</a>
              </li>
              <li class="text-gray-500 whitespace-nowrap">🕒 Ежедневно 10:00–23:00</li>
            </ul>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400 text-center sm:text-left">
          <span>© {{ year }} FoodShop. Все права защищены.</span>
          <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a routerLink="/" class="hover:text-brand-600 transition">Публичная оферта</a>
            <a routerLink="/" class="hover:text-brand-600 transition">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  readonly catalog = inject(Catalog);
  readonly year = new Date().getFullYear();
}
