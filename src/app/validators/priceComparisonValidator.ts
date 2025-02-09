import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function priceComparisonValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const prePrice = control.get('prePrice')?.value;
    const currentPrice = control.get('currentPrice')?.value;

    if (prePrice && currentPrice && currentPrice >= prePrice) {
      return { 'currentPriceSmallerThanPrePrice': true };
    }
    return null;
  };
}
