import type { EntityDto } from '@abp/ng.core';

export interface Base64ImageModel extends EntityDto<number> {
  fileName?: string;
  base64Content?: string;
}
