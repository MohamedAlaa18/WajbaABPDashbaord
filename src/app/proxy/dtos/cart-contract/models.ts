
export interface CartItemAddonDto {
  id: number;
  name?: string;
  price: number;
}

export interface CartItemDto {
  itemId: number;
  quantity: number;
  notes?: string;
  variations: CartItemVariationDto[];
  addons: CartItemAddonDto[];
  extras: ExtraDto[];
}

export interface CartItemVariationDto {
  id: number;
  name?: string;
  additionalPrice: number;
  attributeName?: string;
}

export interface ExtraDto {
  id: number;
  name?: string;
  additionalPrice: number;
}
