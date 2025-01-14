import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateDineIntable {
  id:number;
  name: string;
  size: number;
  isActive: boolean;
  branchId: number;
}

export interface GetDiniTableInput extends PagedAndSortedResultRequestDto {
  name?: string;
  size?: number;
  status?: string;
}
