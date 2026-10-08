import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Catalog, Dish } from '../../core/services/catalog';
import { ImgFallback } from '../directives/img-fallback';

interface Suggestion {
  type: 'dish' | 'category';
  id: number;
  title: string;
  subtitle: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-search-box',
  imports: [ImgFallback],
  template: `
    <div class="relative flex-1 min-w-0">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
      <input
        type="text"
        [value]="value()"
        (input)="onInput($any($event.target).value)"
        (focus)="open.set(true)"
        (blur)="onBlur()"
        (keydown)="onKeydown($event)"
        [placeholder]="placeholder()"
        [class]="inputClass()"
        autocomplete="off"
      >

      @if (open() && suggestions().length) {
        <div class="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          @for (s of suggestions(); track s.type + '-' + s.id; let i = $index) {
            <button
              type="button"
              (mousedown)="$event.preventDefault()"
              (click)="choose(s)"
              (mouseenter)="active.set(i)"
              [class]="i === active()
                ? 'w-full flex items-center gap-3 px-3 py-2.5 text-left bg-brand-50 transition'
                : 'w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition'"
            >
              @if (s.type === 'dish') {
                <img
                  appImgFallback
                  [src]="s.imageUrl!"
                  [alt]="s.title"
                  class="w-10 h-10 rounded-lg object-cover shrink-0"
                >
              } @else {
                <span class="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center text-xl shrink-0">{{ s.subtitle }}</span>
              }
              <span class="min-w-0">
                <span class="block text-sm font-medium text-gray-900 truncate">{{ s.title }}</span>
                <span class="block text-xs text-gray-400 truncate">{{ s.type === 'dish' ? s.subtitle : 'Категория' }}</span>
              </span>
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class SearchBox {
  private readonly catalog = inject(Catalog);
  private readonly router = inject(Router);

  readonly value = input('');
  readonly placeholder = input('Поиск...');
  readonly inputClass = input('w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent');

  readonly valueChange = output<string>();
  readonly submit = output<string>();

  readonly open = signal(false);
  readonly active = signal(0);

  readonly suggestions = computed<Suggestion[]>(() => {
    const q = this.value().toLowerCase().trim();
    if (q.length < 1) return [];

    const categories: Suggestion[] = this.catalog.categories
      .filter((c) => c.name.toLowerCase().includes(q))
      .map((c) => ({ type: 'category', id: c.id, title: c.name, subtitle: c.emoji }));

    const dishes: Suggestion[] = this.catalog
      .dishes()
      .filter((d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q))
      .slice(0, 6)
      .map((d) => this.toDishSuggestion(d));

    return [...categories.slice(0, 2), ...dishes].slice(0, 7);
  });

  onInput(text: string): void {
    this.valueChange.emit(text);
    this.open.set(true);
    this.active.set(0);
  }

  onBlur(): void {
    // задержка, чтобы успел сработать клик по подсказке
    setTimeout(() => this.open.set(false), 150);
  }

  onKeydown(event: KeyboardEvent): void {
    const list = this.suggestions();

    if (event.key === 'ArrowDown' && list.length) {
      event.preventDefault();
      this.open.set(true);
      this.active.set((this.active() + 1) % list.length);
    } else if (event.key === 'ArrowUp' && list.length) {
      event.preventDefault();
      this.active.set((this.active() - 1 + list.length) % list.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const chosen = this.open() ? list[this.active()] : undefined;
      if (chosen) {
        this.choose(chosen);
      } else {
        this.submit.emit(this.value().trim());
        this.open.set(false);
      }
    } else if (event.key === 'Escape') {
      this.open.set(false);
    }
  }

  choose(s: Suggestion): void {
    this.open.set(false);
    if (s.type === 'dish') {
      this.router.navigate(['/dish', s.id]);
    } else {
      this.router.navigate(['/catalog'], { queryParams: { cat: s.id } });
    }
  }

  private toDishSuggestion(d: Dish): Suggestion {
    return {
      type: 'dish',
      id: d.id,
      title: d.name,
      subtitle: `${this.catalog.categoryName(d.categoryId)} · ${d.price} ₽`,
      imageUrl: d.imageUrl,
    };
  }
}
