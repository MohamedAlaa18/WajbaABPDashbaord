import type { Status } from '../../enums/status.enum';
import type { DiscountType } from '../../enums/discount-type.enum';
import type { IFormFile } from '../../microsoft/asp-net-core/http/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateOfferDto {
  name?: string;
  status: Status;
  startDate?: string;
  endDate?: string;
  discountPercentage: number;
  discountType: DiscountType;
  image: IFormFile;
  description?: string;
  branchId: number;
  itemIds: number[];
  categoryIds: number[];
}

export interface GetOfferInput extends PagedAndSortedResultRequestDto {
}

export interface UpdateOfferdto extends CreateUpdateOfferDto {
  id: number;
}
