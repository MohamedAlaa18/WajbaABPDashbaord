import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CreateItemVariationDto, ItemVariationDto, UpdateItemVariationDto } from '../dtos/item-variation-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class ItemVariationService {
  apiName = 'Default';
  

  create = (input: CreateItemVariationDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/ItemVariation',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (itemId: number, variationId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/ItemVariation/item/${itemId}/variation/${variationId}`,
    },
    { apiName: this.apiName,...config });
  

  get = (itemId: number, variationId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<ItemVariationDto>>>({
      method: 'GET',
      url: `/api/ItemVariation/item/${itemId}/variation/${variationId}`,
    },
    { apiName: this.apiName,...config });
  

  getListByItemAttributeId = (itemAttributeId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/ItemVariation/item-variations/by-attribute/${itemAttributeId}`,
    },
    { apiName: this.apiName,...config });
  

  getVariationsByItemId = (itemId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/ItemVariation/item/${itemId}`,
    },
    { apiName: this.apiName,...config });
  

  updateVariationForItem = (input: UpdateItemVariationDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/ItemVariation',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
