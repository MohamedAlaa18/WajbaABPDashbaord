import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CreateUpdateOfferDto, GetOfferInput, OfferDto, UpdateOfferdto } from '../dtos/offers-contract/models';
import type { Base64ImageModel } from '../dtos/themes-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  apiName = 'Default';
  

  create = (input: CreateUpdateOfferDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Offer',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/Offer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteItemsByOfferidAndItemid = (offerid: number, itemid: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: '/api/Offer/DeleteItemsoffer',
      params: { offerid, itemid },
    },
    { apiName: this.apiName,...config });
  

  deletecategorysByOfferidAndCategoryid = (offerid: number, categoryid: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: '/api/Offer/Deletecategoryoffer',
      params: { offerid, categoryid },
    },
    { apiName: this.apiName,...config });
  

  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<OfferDto>>>({
      method: 'GET',
      url: `/api/Offer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetOfferInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Offer',
      params: { name: input.name, status: input.status, startDate: input.startDate, endDate: input.endDate, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdateOfferdto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Offer',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateimageByIdAndModel = (id: number, model: Base64ImageModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Offer/Editimage',
      params: { id },
      body: model,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
