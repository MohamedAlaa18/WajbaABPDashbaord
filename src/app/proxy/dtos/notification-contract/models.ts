import type { Base64ImageModel } from '../themes-contract/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateNotificationDto {
  fireBasePublicVapidKey?: string;
  fireBaseAPIKey?: string;
  fireBaseProjectId?: string;
  fireBaseAuthDomain?: string;
  fireBaseStorageBucket?: string;
  fireBaseMessageSenderId?: string;
  fireBaseAppId?: string;
  fireBaseMeasurementId?: string;
  model: Base64ImageModel;
}

export interface GetNotificationInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface NotificationDto {
  id: number;
  fireBasePublicVapidKey?: string;
  fireBaseAPIKey?: string;
  fireBaseProjectId?: string;
  fireBaseAuthDomain?: string;
  fireBaseStorageBucket?: string;
  fireBaseMessageSenderId?: string;
  fireBaseAppId?: string;
  fireBaseMeasurementId?: string;
  imageUrl?: string;
}
