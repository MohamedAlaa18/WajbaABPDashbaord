import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateNotificationSettingsdto, NotificationSettingDto, UpdateNotificationSettings } from '../dtos/notifications-settings-dtoes/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class NotificationSettingsService {
  apiName = 'Default';
  

  createByNotificationSettingsdto = (notificationSettingsdto: CreateNotificationSettingsdto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<NotificationSettingDto>>({
      method: 'POST',
      url: '/api/NotificationSettings',
      body: notificationSettingsdto,
    },
    { apiName: this.apiName,...config });
  

  getAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PagedResultDto<NotificationSettingDto>>>({
      method: 'GET',
      url: '/api/NotificationSettings',
    },
    { apiName: this.apiName,...config });
  

  updateNotificationSettingsBySettingsToUpdate = (settingsToUpdate: UpdateNotificationSettings, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/NotificationSettings/update-settings',
      body: settingsToUpdate,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
