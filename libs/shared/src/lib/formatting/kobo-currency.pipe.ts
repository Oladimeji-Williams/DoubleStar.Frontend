// libs/shared/src/lib/formatting/kobo-currency.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'koboCurrency', standalone: true })
export class KoboCurrencyPipe implements PipeTransform {
  transform(valueInKobo: number | null | undefined): string {
    if (valueInKobo === null || valueInKobo === undefined) return '';
    const naira = valueInKobo / 100;
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(naira);
  }
}