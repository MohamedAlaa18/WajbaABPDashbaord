import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CompanyDto extends EntityDto<number> {
  name?: string;
  email?: string;
  phone?: string;
  websiteURL?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  zipCode?: string;
  address?: string;
}

export interface CreateComanyDto {
  name?: string;
  email?: string;
  phone?: string;
  websiteURL?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  zipCode?: string;
  address?: string;
}

export interface GetComanyInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface UpdateCompanyDto extends CreateComanyDto {
}
