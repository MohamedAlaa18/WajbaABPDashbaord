import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CreateItemAddonDto, ItemAddonDto, UpdateItemAddonDto } from '../dtos/item-addon-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class ItemAddonService {
  apiName = 'Default';
  

  create = (input: CreateItemAddonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/ItemAddon',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  deleteAddonForItem = (itemId: number, addonId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/ItemAddon/item/${itemId}/addon/${addonId}`,
    },
    { apiName: this.apiName,...config });
  

  getAddonsByItemId = (itemId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/ItemAddon/item/${itemId}`,
    },
    { apiName: this.apiName,...config });
  

  getById = (itemId: number, addonId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<ItemAddonDto>>>({
      method: 'GET',
      url: `/api/ItemAddon/item/${itemId}/addon/${addonId}`,
    },
    { apiName: this.apiName,...config });
  

  updateAddonForItem = (input: UpdateItemAddonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/ItemAddon',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
