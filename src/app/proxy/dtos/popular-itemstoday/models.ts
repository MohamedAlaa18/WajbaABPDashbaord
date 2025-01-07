import type { IFormFile } from '../../microsoft/asp-net-core/http/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreatePopularitem {
  id: number;
  name?: string;
  status: number;
  imgFile: IFormFile;
  preprice: number;
  currentprice: number;
  description?: string;
  branchId: number;
}

export interface GetPopulariteminput extends PagedAndSortedResultRequestDto {
}

export interface UpdatePopularItemdto extends CreatePopularitem {
  itemId: number;
}
