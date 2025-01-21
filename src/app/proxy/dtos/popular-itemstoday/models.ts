import type { Base64ImageModel } from '../themes-contract/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreatePopularitem {
  itemId: number;
  model: Base64ImageModel;
  prePrice: number;
  currentPrice: number;
  description?: string;
}

export interface GetPopulariteminput extends PagedAndSortedResultRequestDto {
}

export interface UpdatePopularItemdto extends CreatePopularitem {
  id: number;
}
