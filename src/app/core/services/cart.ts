import { Injectable, computed, signal } from '@angular/core';
import { Dish } from './catalog';

export interface CartItem extends Dish {
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class Cart {
  private readonly STORAGE_KEY = 'food-shop-cart';

  private readonly _items = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this._items.asReadonly();

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  readonly itemCount = computed(() =>
    this._items().reduce((count, item) => count + item.quantity, 0)
  );

  add(dish: Dish) {
    this._items.update(items => {
      const existing = items.find(i => i.id === dish.id);
      const next = existing
        ? items.map(i => (i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...items, { ...dish, quantity: 1 }];
      this.saveToStorage(next);
      return next;
    });
  }

  remove(id: number) {
    this._items.update(items => {
      const next = items.filter(i => i.id !== id);
      this.saveToStorage(next);
      return next;
    });
  }

  /** Количество блюда в корзине по id */
  qty(id: number): number {
    return this._items().find(i => i.id === id)?.quantity ?? 0;
  }

  changeQuantity(id: number, delta: number) {
    this._items.update(items => {
      const next = items
        .map(i => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter(i => i.quantity > 0);
      this.saveToStorage(next);
      return next;
    });
  }

  clear() {
    this._items.set([]);
    this.saveToStorage([]);
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }
}