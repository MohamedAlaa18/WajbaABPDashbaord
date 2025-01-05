import type { IFormFile } from '../../microsoft/asp-net-core/http/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateItemDto {
  id: number;
  name: string;
  imageUrl: IFormFile;
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
  filter?: string;
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
