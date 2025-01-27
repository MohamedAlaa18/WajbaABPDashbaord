
export interface CreateItemAddonDto {
  additionalPrice: number;
  itemId: number;
}

export interface ItemAddonDto {
  id: number;
  name?: string;
  additionalPrice: number;
  itemId: number;
}

export interface UpdateItemAddonDto extends CreateItemAddonDto {
  addonId: number;
}
