import type { Base64ImageModel } from '../themes-contract/models';
import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { ItemAddonDto } from '../item-addon-contract/models';
import type { ItemExtraDto } from '../item-extra-contract/models';
import type { ItemVariationDto } from '../item-variation-contract/models';

export interface AddPointsToItemDto {
  itemId: number;
  points: number;
}

export interface CreateItemDto {
  name: string;
  model: Base64ImageModel;
  price: number;
  isFeatured: boolean;
  status: number;
  itemType: number;
  note: string;
  description: string;
  taxValue?: number;
  categoryId: number;
  branchIds: number[];
}

export interface GetItemInput extends PagedAndSortedResultRequestDto {
  name?: string;
  categoryId?: number;
  itemType?: number;
  isFeatured?: boolean;
  isDeleted?: boolean;
  status?: number;
  minPrice?: number;
  maxPrice?: number;
  minTaxValue?: number;
  maxTaxValue?: number;
  branchId?: number;
  itemId?: number;
}

export interface ItemDto extends EntityDto<number> {
  id: number;
  name?: string;
  description?: string;
  note?: string;
  status: number;
  isFeatured: boolean;
  imageUrl?: string;
  price: number;
  taxValue?: number;
  categoryId: number;
  points: number;
  categoryName?: string;
  itemType: number;
  isDeleted: boolean;
  branchIds: number[];
  itemAddons: ItemAddonDto[];
  itemExtras: ItemExtraDto[];
  itemVariations: ItemVariationDto[];
}

export interface UpdateItemDTO extends CreateItemDto {
  id: number;
}
