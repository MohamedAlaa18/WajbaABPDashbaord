import { mapEnumToOptions } from '@abp/ng.core';

export enum OrderStatus {
  Pending = 0,
  processing = 1,
  OutForDelivery = 2,
  delivered = 3,
  Canceled = 4,
  Rejected = 5,
  Returned = 6,
}

export const orderStatusOptions = mapEnumToOptions(OrderStatus);
