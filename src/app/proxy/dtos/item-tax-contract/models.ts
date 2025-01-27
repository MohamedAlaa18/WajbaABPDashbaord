import type { EntityDto } from '@abp/ng.core';

export interface CreateItemTaxDto {
  name?: string;
  code: number;
  taxRate: number;
  status: number;
}

export interface ItemTaxDto extends EntityDto<number> {
  name?: string;
  code: number;
  taxRate: number;
  status: number;
}

export interface UpdateItemTaxDto extends CreateItemTaxDto {
  id: number;
}
