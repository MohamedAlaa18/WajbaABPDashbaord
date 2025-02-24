import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateOrderSetupDto, GetOrderSetupInput, UpdateOrderSetupDto } from '../dtos/order-setup-contract/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class OrderSetupService {
  apiName = 'Default';
  

  create = (input: CreateOrderSetupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/OrderSetup',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/OrderSetup/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getById = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/OrderSetup/byId',
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetOrderSetupInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/OrderSetup',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdateOrderSetupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/OrderSetup',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
