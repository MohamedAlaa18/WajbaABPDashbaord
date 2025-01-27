import type { EntityDto } from '@abp/ng.core';

export interface CreateItemAttributeDto {
  name: string;
  status: number;
}

export interface ItemAttributeDto extends EntityDto<number> {
  name?: string;
  status: number;
}

export interface UpdateItemAttributeDto extends CreateItemAttributeDto {
  id: number;
}
