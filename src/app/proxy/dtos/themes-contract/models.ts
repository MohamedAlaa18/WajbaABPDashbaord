import type { EntityDto } from '@abp/ng.core';

export interface Base64ImageModel extends EntityDto<number> {
  fileName?: string;
  base64Content?: string;
}

export interface CreateThemesDto {
  logoUrl: Base64ImageModel;
  browserTabIconUrl: Base64ImageModel;
  footerLogoUrl: Base64ImageModel;
}

export interface UpdateThemeDto extends CreateThemesDto {
  id: number;
}
