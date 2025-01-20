import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateDineIntable {
  name: string;
  size: number;
  status: number;
  branchId: number;
}

export interface GetDiniTableInput extends PagedAndSortedResultRequestDto {
  name?: string;
  size?: number;
  status?: string;
  branchId?: number;
}

export interface UpdateDinInTable extends CreateDineIntable {
  id: number;
}
