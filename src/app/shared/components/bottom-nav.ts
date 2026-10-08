import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Cart } from '../../core/services/cart';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 md:hidden pb-[env(safe-area-inset-bottom)]">
      <div class="grid grid-cols-4">
        <a
          routerLink="/"
          routerLinkActive="text-brand-600"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center gap-1 py-2.5 text-xs text-gray-500 transition"
        >
          <span class="text-xl leading-none">🏠</span>
          Главная
        </a>
        <a
          routerLink="/catalog"
          routerLinkActive="text-brand-600"
          class="flex flex-col items-center gap-1 py-2.5 text-xs text-gray-500 transition"
        >
          <span class="text-xl leading-none">🍽️</span>
          Меню
        </a>
        <a
          routerLink="/cart"
          routerLinkActive="text-brand-600"
          class="relative flex flex-col items-center gap-1 py-2.5 text-xs text-gray-500 transition"
        >
          <span class="text-xl leading-none">🛒</span>
          Корзина
          @if (cart.itemCount() > 0) {
            <span class="absolute top-1 right-1/4 bg-rose-400 text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-bold">
              {{ cart.itemCount() }}
            </span>
          }
        </a>
        <a
          routerLink="/account"
          routerLinkActive="text-brand-600"
          class="flex flex-col items-center gap-1 py-2.5 text-xs text-gray-500 transition"
        >
          <span class="text-xl leading-none">👤</span>
          Профиль
        </a>
      </div>
    </nav>
  `,
})
export class BottomNav {
  readonly cart = inject(Cart);
}
