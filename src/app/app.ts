import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Cart } from './core/services/cart';
import { BottomNav } from './shared/components/bottom-nav';
import { Footer } from './shared/components/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BottomNav, Footer],
  template: `
    <header class="fixed inset-x-0 top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <a routerLink="/" class="flex items-center gap-2 text-xl sm:text-2xl font-bold text-brand-600 shrink-0">
          <span class="text-2xl">🍔</span> FoodShop
        </a>

        <nav class="hidden md:flex items-center gap-1">
          <a
            routerLink="/catalog"
            routerLinkActive="text-brand-600 bg-brand-50"
            class="px-4 py-2 rounded-lg text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition font-medium"
          >
            Меню
          </a>
          <a
            routerLink="/account"
            routerLinkActive="text-brand-600 bg-brand-50"
            class="px-4 py-2 rounded-lg text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition font-medium"
          >
            Кабинет
          </a>
        </nav>

        <a
          routerLink="/cart"
          class="relative hidden md:flex items-center gap-2 px-3 py-2 text-brand-700 hover:text-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 rounded-lg transition font-medium shrink-0"
        >
          <span>🛒</span>
          <span class="hidden sm:inline">Корзина</span>
          @if (cart.itemCount() > 0) {
            <span class="absolute -top-2 -right-2 bg-rose-400 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center font-bold">
              {{ cart.itemCount() }}
            </span>
          }
        </a>
      </div>
    </header>

    <main class="min-h-screen bg-brand-50/60 pt-16 pb-16 md:pb-0">
      <router-outlet />
    </main>

    <app-footer />

    <app-bottom-nav />
  `,
})
export class App {
  readonly cart = inject(Cart);
}
