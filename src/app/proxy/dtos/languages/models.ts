import type { Base64ImageModel } from '../themes-contract/models';
import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateLanguageDto {
  name: string;
  code: string;
  model: Base64ImageModel;
  status: number;
}

export interface GetLanguageInput extends PagedAndSortedResultRequestDto {
}

export interface LanguageDto extends EntityDto<number> {
  name?: string;
  code?: string;
  image?: string;
  status: number;
}

export interface UpdateLanguagedto extends CreateUpdateLanguageDto {
  id: number;
}
