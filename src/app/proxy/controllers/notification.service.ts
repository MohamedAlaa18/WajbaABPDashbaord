import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateNotificationDto, GetNotificationInput, UpdateNotificationDto } from '../dtos/notification-contract/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  apiName = 'Default';
  

  create = (input: CreateNotificationDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Notification',
      params: { fireBasePublicVapidKey: input.fireBasePublicVapidKey, fireBaseAPIKey: input.fireBaseAPIKey, fireBaseProjectId: input.fireBaseProjectId, fireBaseAuthDomain: input.fireBaseAuthDomain, fireBaseStorageBucket: input.fireBaseStorageBucket, fireBaseMessageSenderId: input.fireBaseMessageSenderId, fireBaseAppId: input.fireBaseAppId, fireBaseMeasurementId: input.fireBaseMeasurementId },
      body: input.imageUrl,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/Notification/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAll = (input: GetNotificationInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Notification',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/Notification/${id}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdateNotificationDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Notification',
      params: { id: input.id, fireBasePublicVapidKey: input.fireBasePublicVapidKey, fireBaseAPIKey: input.fireBaseAPIKey, fireBaseProjectId: input.fireBaseProjectId, fireBaseAuthDomain: input.fireBaseAuthDomain, fireBaseStorageBucket: input.fireBaseStorageBucket, fireBaseMessageSenderId: input.fireBaseMessageSenderId, fireBaseAppId: input.fireBaseAppId, fireBaseMeasurementId: input.fireBaseMeasurementId },
      body: input.imageUrl,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
