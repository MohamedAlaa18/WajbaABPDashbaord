import type { Base64ImageModel } from '../themes-contract/models';
import type { FullAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreatePushNotificationDto {
  title?: string;
  description?: string;
  imageUrl: Base64ImageModel;
  date?: string;
  roleId?: number;
  userId: number;
}

export interface GetPushnotificationinput extends PagedAndSortedResultRequestDto {
  title?: string;
  date?: string;
  userId?: number;
  roleId?: number;
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

export interface UpdatePushNotificationDto extends CreatePushNotificationDto {
  id: number;
}
