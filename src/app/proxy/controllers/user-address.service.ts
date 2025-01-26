import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CreateUserAddressDto, UpdateUserAddressDto, UserAddressDto } from '../dtos/user-address-contract/models';
import type { ActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class UserAddressService {
  apiName = 'Default';
  constructor(private restService: RestService) { }


  create = (input: CreateUserAddressDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<UserAddressDto>>>({
      method: 'POST',
      url: '/api/UserAddress',
      body: input,
    },
      { apiName: this.apiName, ...config });


  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<object>>>({
      method: 'DELETE',
      url: `/api/UserAddress/${id}`,
    },
      { apiName: this.apiName, ...config });


  // getAllByCustomer = (customerId: string, config?: Partial<Rest.Config>) =>
  //   this.restService.request < any, ActionResult<ApiResponse<any<UserAddressDto>>>> ({
  //     method: 'GET',
  //     url: `/api/UserAddress/customer/${customerId}`,
  //   },
  //     { apiName: this.apiName, ...config });


getById = (id: number, config?: Partial<Rest.Config>) =>
  this.restService.request<any, ActionResult<ApiResponse<UserAddressDto>>>({
    method: 'GET',
    url: `/api/UserAddress/${id}`,
  },
    { apiName: this.apiName, ...config });


update = (input: UpdateUserAddressDto, config?: Partial<Rest.Config>) =>
  this.restService.request<any, ActionResult<ApiResponse<UserAddressDto>>>({
    method: 'PUT',
    url: '/api/UserAddress',
    body: input,
  },
    { apiName: this.apiName, ...config });

}
