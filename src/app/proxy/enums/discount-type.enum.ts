import { mapEnumToOptions } from '@abp/ng.core';

export enum DiscountType {
  Fixed = 0,
  Percentage = 1,
}

export const discountTypeOptions = mapEnumToOptions(DiscountType);
