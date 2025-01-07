import type { IFormFile } from '../../microsoft/asp-net-core/http/models';
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
  imageUrl: IFormFile;
}

export interface GetNotificationInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface UpdateNotificationDto {
  id: number;
  fireBasePublicVapidKey?: string;
  fireBaseAPIKey?: string;
  fireBaseProjectId?: string;
  fireBaseAuthDomain?: string;
  fireBaseStorageBucket?: string;
  fireBaseMessageSenderId?: string;
  fireBaseAppId?: string;
  fireBaseMeasurementId?: string;
  imageUrl: IFormFile;
}
