import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUserAddressDto, UpdateUserAddressDto } from '../dtos/user-address-contract/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class UserAddressService {
  apiName = 'Default';
  

  create = (input: CreateUserAddressDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/app/user-address',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/app/user-address/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllByWajbaUser = (WajbaUserId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/app/user-address',
      params: { wajbaUserId: WajbaUserId },
    },
    { apiName: this.apiName,...config });
  

  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/app/user-address/${id}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdateUserAddressDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/app/user-address',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
