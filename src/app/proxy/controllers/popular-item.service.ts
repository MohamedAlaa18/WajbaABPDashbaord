import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreatePopularitem, GetPopulariteminput, UpdatePopularItemdto } from '../dtos/popular-itemstoday/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class PopularItemService {
  apiName = 'Default';
  

  create = (input: CreatePopularitem, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/PopularItem',
      params: { id: input.id, name: input.name, status: input.status, preprice: input.preprice, currentprice: input.currentprice, description: input.description, branchId: input.branchId },
      body: input.imgFile,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: '/api/PopularItem',
      params: { id },
    },
    { apiName: this.apiName,...config });
  

  get = (input: GetPopulariteminput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/PopularItem',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/PopularItem/${id}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdatePopularItemdto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/PopularItem',
      params: { itemId: input.itemId, id: input.id, name: input.name, status: input.status, preprice: input.preprice, currentprice: input.currentprice, description: input.description, branchId: input.branchId },
      body: input.imgFile,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
