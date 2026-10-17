import { Injectable, inject, signal } from '@angular/core';
import { CartItem } from './cart';
import { Catalog } from './catalog';

export type OrderStatus = 'Оформлен' | 'В пути' | 'Доставлен';

export interface OrderItem {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class Orders {
  private readonly STORAGE_KEY = 'food-shop-orders';

  private readonly catalog = inject(Catalog);

  private readonly _orders = signal<Order[]>(this.load());

  readonly orders = this._orders.asReadonly();

  /** Создаёт заказ из позиций корзины и возвращает его */
  place(items: CartItem[]): Order {
    const order: Order = {
      id: this.nextId(),
      date: new Date().toLocaleDateString('ru-RU'),
      status: 'Оформлен',
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        imageUrl: i.imageUrl,
        price: i.price,
        quantity: i.quantity,
      })),
    };
    this.update([order, ...this._orders()]);
    return order;
  }

  total(order: Order): number {
    return order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  itemCount(order: Order): number {
    return order.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  private nextId(): number {
    return this._orders().reduce((max, o) => Math.max(max, o.id), 1000) + 1;
  }

  private update(list: Order[]): void {
    this._orders.set(list);
    this.save(list);
  }

  private load(): Order[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return this.seed();
  }

  private save(list: Order[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }

  /** Демонстрационная история заказов */
  private seed(): Order[] {
    const build = (id: number, date: string, status: OrderStatus, ids: number[]): Order => ({
      id,
      date,
      status,
      items: ids
        .map((dishId) => this.catalog.findById(dishId))
        .filter((d): d is NonNullable<typeof d> => !!d)
        .map((d) => ({ id: d.id, name: d.name, imageUrl: d.imageUrl, price: d.price, quantity: 1 })),
    });

    return [
      build(1042, '01.10.2026', 'В пути', [2, 9, 17]),
      build(1017, '24.09.2026', 'Доставлен', [5, 1, 21, 17, 18]),
      build(998, '12.09.2026', 'Доставлен', [13, 20]),
    ];
  }
}
