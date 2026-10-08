import { Component, effect, input, signal } from '@angular/core';
import { ImgFallback } from '../directives/img-fallback';

@Component({
  selector: 'app-carousel',
  imports: [ImgFallback],
  template: `
    <div class="relative">
      <div class="relative overflow-hidden rounded-2xl bg-gray-100">
        <img
          appImgFallback
          [src]="images()[index()]"
          [alt]="alt()"
          class="w-full h-64 sm:h-80 lg:h-96 object-cover transition-opacity duration-300"
        >

        @if (images().length > 1) {
          <button
            type="button"
            (click)="prev()"
            aria-label="Предыдущее фото"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-gray-700 hover:bg-white shadow-md transition"
          >
            ‹
          </button>
          <button
            type="button"
            (click)="next()"
            aria-label="Следующее фото"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-gray-700 hover:bg-white shadow-md transition"
          >
            ›
          </button>

          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            @for (img of images(); track $index) {
              <button
                type="button"
                (click)="index.set($index)"
                [attr.aria-label]="'Фото ' + ($index + 1)"
                class="h-2 rounded-full transition-all"
                [class]="$index === index() ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'"
              ></button>
            }
          </div>
        }
      </div>

      @if (images().length > 1) {
        <div class="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
          @for (img of images(); track $index) {
            <button
              type="button"
              (click)="index.set($index)"
              class="overflow-hidden rounded-xl ring-2 transition"
              [class]="$index === index() ? 'ring-brand-400' : 'ring-transparent opacity-70 hover:opacity-100'"
            >
              <img appImgFallback [src]="img" [alt]="alt()" class="w-full h-16 sm:h-20 object-cover">
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class Carousel {
  readonly images = input.required<string[]>();
  readonly alt = input('');

  readonly index = signal(0);

  constructor() {
    effect(() => {
      // сбрасываем индекс при смене набора изображений
      const list = this.images();
      if (this.index() >= list.length) {
        this.index.set(0);
      }
    });
  }

  next(): void {
    const len = this.images().length;
    if (!len) return;
    this.index.set((this.index() + 1) % len);
  }

  prev(): void {
    const len = this.images().length;
    if (!len) return;
    this.index.set((this.index() - 1 + len) % len);
  }
}
