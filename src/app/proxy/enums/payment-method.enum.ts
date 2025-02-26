import { mapEnumToOptions } from '@abp/ng.core';

export enum PaymentMethod {
  CashOnDelivery = 1,
  CreditCard = 2,
  PayPal = 3,
}

export const paymentMethodOptions = mapEnumToOptions(PaymentMethod);
