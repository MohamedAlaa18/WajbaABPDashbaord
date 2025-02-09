
export interface CarItemExtraDto {
  id: number;
}

export interface CartDto {
  customerId: number;
  items: CartItemDto[];
  totalAmount?: number;
  subTotal?: number;
  serviceFee?: number;
  deliveryFee?: number;
  voucherCode?: number;
  discountAmount?: number;
  note?: string;
}

export interface CartItemAddonDto {
  id: number;
}

export interface CartItemDto {
  itemId: number;
  quantity: number;
  itemName?: string;
  price: number;
  notes?: string;
  cartItemId: number;
  imgUrl?: string;
  voucherCode: number;
  variations: ReturnCartItemVariationDto[];
  addons: ReturnCartItemAddonDto[];
  extras: ReturnCartItemExtraDto[];
}

export interface CartItemVariationDto {
  id: number;
}

export interface CreateCartItemDto {
  itemId: number;
  quantity: number;
  notes?: string;
  variations: CartItemVariationDto[];
  addons: CartItemAddonDto[];
  extras: CarItemExtraDto[];
}

export interface ReturnCartItemAddonDto {
  id: number;
  name?: string;
  price: number;
}

export interface ReturnCartItemExtraDto {
  id: number;
  name?: string;
  additionalPrice: number;
}

export interface ReturnCartItemVariationDto {
  id: number;
  name?: string;
  additionalPrice: number;
  attributeName?: string;
}
