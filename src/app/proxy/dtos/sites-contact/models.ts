import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateSiteDto {
  name: string;
  email: string;
  iosappLink: string;
  androidAPPLink: string;
  copyrights: string;
  googleMapKey: string;
  digitAfterDecimal: number;
  currencyPosition: number;
  languageSwitch: number;
  defaultBranch: number;
  defaultCurrency: number;
  defaultLanguage: number;
}

export interface GetSiteInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface UpdateSiteDto extends CreateSiteDto {
  id: number;
}
