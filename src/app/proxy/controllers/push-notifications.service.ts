import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreatePushNotificationDto, PushNotificationDto } from '../dtos/push-notification-contract/models';
import type { ActionResult } from '../microsoft/asp-net-core/mvc/models';

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

  constructor(private restService: RestService) {}
}
