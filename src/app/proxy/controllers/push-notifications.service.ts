import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreatePushNotificationDto, GetPushnotificationinput, PushNotificationDto, UpdatePushNotificationDto } from '../dtos/push-notification-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationsService {
  apiName = 'Default';
  

  createByPushNotificationDto = (pushNotificationDto: CreatePushNotificationDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PushNotificationDto>>({
      method: 'POST',
      url: '/api/PushNotifications',
      body: pushNotificationDto,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/PushNotifications/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllByGet = (get: GetPushnotificationinput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PagedResultDto<PushNotificationDto>>>({
      method: 'GET',
      url: '/api/PushNotifications',
      params: { title: get.title, date: get.date, userId: get.userId, roleId: get.roleId, sorting: get.sorting, skipCount: get.skipCount, maxResultCount: get.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getByIdById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PushNotificationDto>>({
      method: 'GET',
      url: `/api/PushNotifications/GetbyId${id}`,
    },
    { apiName: this.apiName,...config });
  

  updateByDto = (dto: UpdatePushNotificationDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PushNotificationDto>>({
      method: 'PUT',
      url: '/api/PushNotifications',
      body: dto,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
