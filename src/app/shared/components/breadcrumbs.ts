import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  label: string;
  link?: string | unknown[];
  queryParams?: Record<string, unknown>;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  template: `
    <nav aria-label="Хлебные крошки" class="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
      @for (crumb of items(); track $index; let last = $last) {
        @if (crumb.link && !last) {
          <a
            [routerLink]="crumb.link"
            [queryParams]="crumb.queryParams ?? {}"
            class="hover:text-brand-600 transition"
          >
            {{ crumb.label }}
          </a>
        } @else {
          <span class="text-gray-800 font-medium">{{ crumb.label }}</span>
        }
        @if (!last) {
          <span class="text-gray-300 select-none">/</span>
        }
      }
    </nav>
  `,
})
export class Breadcrumbs {
  readonly items = input.required<Crumb[]>();
}
