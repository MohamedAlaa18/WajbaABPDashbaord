import type { IFormFile } from '../../microsoft/asp-net-core/http/models';
import type { FullAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateItemDto {
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

export interface ItemDto extends FullAuditedEntityDto<number> {
  id: number;
  name?: string;
  description?: string;
  note?: string;
  status?: string;
  isFeatured: boolean;
  imageUrl?: string;
  price: number;
  taxValue?: number;
  categoryId: number;
  categoryName?: string;
  itemType?: string;
  isDeleted: boolean;
}
