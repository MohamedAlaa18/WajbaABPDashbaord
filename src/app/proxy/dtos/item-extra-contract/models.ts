
export interface ItemExtraDto {
  id: number;
  name?: string;
  status: number;
  additionalPrice: number;
  itemId: number;
}

export interface CreateItemExtraDto {
  name?: string;
  status: number;
  additionalPrice: number;
  itemId: number;
}

export interface UpdateItemExtraDto extends CreateItemExtraDto {
  extraId: number;
}
