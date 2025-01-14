import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface GetThemeInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface CreateThemesDto {
  logoUrl: Base64ImageModel;
  browserTabIconUrl: Base64ImageModel;
  footerLogoUrl: Base64ImageModel;
}
