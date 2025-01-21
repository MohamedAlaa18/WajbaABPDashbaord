
export interface ItemVariationDto {
  id: number;
  name?: string;
  note?: string;
  status: number;
  additionalPrice: number;
  itemAttributesId: number;
  itemId: number;
}

export interface CreateItemVariationDto {
  name?: string;
  note?: string;
  status: number;
  additionalPrice: number;
  itemAttributesId: number;
  itemId: number;
}

export interface UpdateItemVariationDto extends CreateItemVariationDto {
  variationId: number;
}
