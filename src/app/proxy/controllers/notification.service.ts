import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CreateNotificationDto, GetNotificationInput, NotificationDto } from '../dtos/notification-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  apiName = 'Default';
  

  create = (input: CreateNotificationDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Notification',
      body: input,
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
  

  getById = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<NotificationDto>>>({
      method: 'GET',
      url: '/api/Notification/get',
    },
    { apiName: this.apiName,...config });
  

  update = (input: CreateNotificationDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Notification',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
