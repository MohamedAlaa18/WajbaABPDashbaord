import type { Base64ImageModel } from '../themes-contract/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { ItemDto } from '../items-dtos/models';
import type { CategoryDto } from '../categories/models';

export interface CreateUpdateOfferDto {
  name?: string;
  status: number;
  startDate?: string;
  endDate?: string;
  discountPercentage: number;
  discountType: number;
  model: Base64ImageModel;
  description?: string;
  branchId: number;
  itemIds: number[];
  categoryIds: number[];
}

export interface GetOfferInput extends PagedAndSortedResultRequestDto {
  name?: string;
  status?: number;
  startDate?: string;
  endDate?: string;
}

export interface OfferDto {
  id: number;
  name?: string;
  status: number;
  startDate?: string;
  endDate?: string;
  image?: string;
  discountPercentage: number;
  discountType: number;
  description?: string;
  branchId: number;
  itemDtos: ItemDto[];
  categoryDtos: CategoryDto[];
}

export interface UpdateOfferdto extends CreateUpdateOfferDto {
  id: number;
}
