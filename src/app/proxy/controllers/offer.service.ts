import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateOfferDto, GetOfferInput, UpdateOfferdto } from '../dtos/offers-contract/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  apiName = 'Default';
  

  create = (input: CreateUpdateOfferDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Offer',
      body: input.image,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/Offer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/Offer/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetOfferInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Offer',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdateOfferdto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Offer',
      body: input.image,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
