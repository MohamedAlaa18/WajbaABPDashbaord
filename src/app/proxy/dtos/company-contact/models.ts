import type { EntityDto } from '@abp/ng.core';

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

export interface CreateUpdateComanyDto {
  name: string;
  email: string;
  phone: string;
  websiteURL: string;
  city: string;
  state: string;
  countryCode: string;
  zipCode: string;
  address: string;
}
