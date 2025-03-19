
export interface CreateOrderDto {
  orderItemDto: OrderItemDto[];
  ordertype: number;
  paymentMethod?: number;
  branchId: number;
  pickUpOrder: PickUpOrderDTO;
  deliveryOrder: DeliveryOrderDTO;
  driveThruOrder: DriveThruOrderDTO;
  dineInOrder: DineInOrderDTO;
  posOrder: PosOrderDTO;
  posDeliveryOrder: PosDeliveryOrderDTO;
}

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

export interface OrderItemAddonDto {
  addonName?: string;
  additionalPrice: number;
}

export interface OrderItemDto {
  itemId: number;
  quantity: number;
  price: number;
  instruction?: string;
  selectedVariations: OrderItemVariationDto[];
  selectedAddons: OrderItemAddonDto[];
  selectedExtras: OrderItemExtraDto[];
}

export interface OrderItemExtraDto {
  extraName?: string;
  additionalPrice: number;
}

export interface OrderItemVariationDto {
  variationName?: string;
  attributeName?: string;
  additionalPrice: number;
}

export interface PickUpOrderDTO {
  time?: string;
  branchId: number;
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
