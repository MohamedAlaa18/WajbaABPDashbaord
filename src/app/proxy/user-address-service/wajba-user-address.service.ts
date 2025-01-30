import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUserAddressDto, UpdateUserAddressDto, UserAddressDto } from '../dtos/user-address-contract/models';

@Injectable({
  providedIn: 'root',
})
export class WajbaUserAddressService {
  apiName = 'Default';
  

  create = (input: CreateUserAddressDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CreateUserAddressDto>({
      method: 'POST',
      url: '/api/app/wajba-user-address',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/wajba-user-address/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllByWajbaUser = (WajbaUserId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserAddressDto[]>({
      method: 'GET',
      url: `/api/app/wajba-user-address/by-wajba-user/${WajbaUserId}`,
    },
    { apiName: this.apiName,...config });
  

  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserAddressDto>({
      method: 'GET',
      url: `/api/app/wajba-user-address/${id}/by-id`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdateUserAddressDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserAddressDto>({
      method: 'PUT',
      url: '/api/app/wajba-user-address',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
