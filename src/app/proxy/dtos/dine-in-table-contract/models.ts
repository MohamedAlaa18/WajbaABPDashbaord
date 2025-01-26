import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateDineIntable {
  name: string;
  size: number;
  status: number;
  branchId: number;
}

export interface DiniINTableDto extends EntityDto<number> {
  name?: string;
  size: number;
  status: number;
  branchId: number;
  branchName?: string;
  phone?: string;
  address?: string;
  url?: string;
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
