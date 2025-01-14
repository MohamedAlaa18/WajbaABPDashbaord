
export interface CreateItemAddonDto {
  addonName?: string;
  additionalPrice: number;
  itemId: number;
}

export interface UpdateItemAddonDto {
  itemId: number;
  addonId: number;
  addonName?: string;
  additionalPrice: number;
  // itemId: number;
}
