import type { FullAuditedEntityDto } from '@abp/ng.core';

export interface DeliveryOrderDTO {
  title?: string;
  longitude: number;
  latitude: number;
  approximateTime?: string;
}

export interface DineInOrderDTO {
  time?: string;
  numberOfPersons: number;
  date?: string;
}

export interface DriveThruOrderDTO {
  time?: string;
  date?: string;
  carColor?: string;
  carType?: string;
  carNumber?: string;
}

export interface OrderDTO extends FullAuditedEntityDto<number> {
  status: number;
  ordertype: number;
  paymentMethod: number;
  branchId: number;
  pickUpOrder: PickUpOrderDTO;
  deliveryOrder: DeliveryOrderDTO;
  driveThruOrder: DriveThruOrderDTO;
  dineInOrder: DineInOrderDTO;
  posOrder: PosOrderDTO;
  posDeliveryOrder: PosDeliveryOrderDTO;
}

export interface PickUpOrderDTO {
  time?: string;
}

export interface PosDeliveryOrderDTO {
  buildingName?: string;
  apartmentNumber?: string;
  floor?: string;
  street?: string;
  phoneNumber?: string;
  additionalDirection?: string;
  addressLabel?: string;
}

export interface PosOrderDTO {
  phoneNumber?: string;
  tokenNumber?: string;
}
