import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CreateItemExtraDto, ItemExtraDto, UpdateItemExtraDto } from '../dtos/item-extra-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class ItemExtraService {
  apiName = 'Default';
  

  create = (input: CreateItemExtraDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/ItemExtra',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (itemId: number, extraId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/ItemExtra/item/${itemId}/extra/${extraId}`,
    },
    { apiName: this.apiName,...config });
  

  get = (itemId: number, extraId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<ItemExtraDto>>>({
      method: 'GET',
      url: `/api/ItemExtra/item/${itemId}/extra/${extraId}`,
    },
    { apiName: this.apiName,...config });
  

  getExtrasByItemId = (itemId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/ItemExtra/item/${itemId}`,
    },
    { apiName: this.apiName,...config });
  

  updateExtraForItem = (input: UpdateItemExtraDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/ItemExtra',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
