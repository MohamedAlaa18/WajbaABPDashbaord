import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { Base64ImageModel } from '../themes-contract/models';

export interface CategoryDto extends EntityDto<number> {
  name?: string;
  imageUrl?: string;
  status: number;
  description?: string;
}

export interface CreateUpdateCategoryDto {
  name: string;
  model: Base64ImageModel;
  status: number;
  description: string;
}

export interface GetCategoryInput extends PagedAndSortedResultRequestDto {
  name?: string;
  branchId?: number;
}

export interface UpdateCategory extends CreateUpdateCategoryDto {
  id: number;
}
