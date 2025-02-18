import type { Base64ImageModel } from '../themes-contract/models';
import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreatePopularitem {
  itemId: number;
  model: Base64ImageModel;
  preprice?: number;
  currentprice: number;
  description?: string;
}

export interface GetPopulariteminput extends PagedAndSortedResultRequestDto {
  name?: string;
  status?: number;
  description?: string;
  currentprice?: number;
  prePrice?: number;
  branchid?: number;
  createdAtStart?: string;
  createdAtEnd?: string;
}

export interface Popularitemdto extends EntityDto<number> {
  name?: string;
  imageUrl?: string;
  prePrice: number;
  currentPrice: number;
  status: number;
  description?: string;
  categoryName?: string;
  branchId: number[];
  itemId: number;
}

export interface UpdateImage {
  id: number;
  model: Base64ImageModel;
}

export interface UpdatePopularItemdto extends CreatePopularitem {
  id: number;
}
