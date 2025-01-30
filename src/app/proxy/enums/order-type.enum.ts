import { mapEnumToOptions } from '@abp/ng.core';

export enum OrderType {
  Delivery = 1,
  DriveThru = 2,
  DineIn = 3,
  PickUp = 4,
  PosOrder = 5,
  PosDelivery = 6,
}

export const orderTypeOptions = mapEnumToOptions(OrderType);
