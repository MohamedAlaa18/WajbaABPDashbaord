import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateOrderSetupDto {
  foodPreparationTime: number;
  scheduleOrderSlotDuration: number;
  freeDeliveryKilometer: number;
  basicDeliveryCharge: number;
  chargePerKilo: number;
  isTakeawayEnabled: boolean;
  isDeliveryEnabled: boolean;
  ontime?: string;
  warning?: string;
  delayTime?: string;
}

export interface GetOrderSetupInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface UpdateOrderSetupDto {
  foodPreparationTime: number;
  scheduleOrderSlotDuration: number;
  freeDeliveryKilometer: number;
  basicDeliveryCharge: number;
  chargePerKilo: number;
  isTakeawayEnabled: boolean;
  isDeliveryEnabled: boolean;
  ontime?: string;
  warning?: string;
  delayTime?: string;
}
