import type { Base64ImageModel } from '../themes-contract/models';
import type { FullAuditedEntityDto } from '@abp/ng.core';

export interface CreatePushNotificationDto {
  title?: string;
  description?: string;
  imageUrl: Base64ImageModel;
  date?: string;
  userId: number;
}

export interface PushNotificationDto extends FullAuditedEntityDto<number> {
  title?: string;
  description?: string;
  imageUrl?: string;
  date?: string;
  roleId?: number;
  userId?: number;
  roleName?: string;
  userName?: string;
}
