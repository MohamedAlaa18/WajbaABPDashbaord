
export interface CreateItemAddonDto {
  addonName?: string;
  additionalPrice: number;
  itemId: number;
}

export interface UpdateItemAddonDto extends CreateItemAddonDto {
  addonId: number;
}

export interface ItemAddonDto {
  id: number;
  addonName?: string;
  additionalPrice: number;
  itemId: number;
}
