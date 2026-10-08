import { Directive, HostListener } from '@angular/core';

/**
 * Подстраховка для изображений: если картинка из интернета не загрузилась,
 * подставляем случайное изображение с picsum.photos по seed из alt.
 */
@Directive({
  selector: 'img[appImgFallback]',
})
export class ImgFallback {
  @HostListener('error', ['$event'])
  onError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.dataset['fallback']) return;
    img.dataset['fallback'] = '1';
    const seed = encodeURIComponent(img.alt || 'food');
    img.src = `https://picsum.photos/seed/${seed}/900/700`;
  }
}
