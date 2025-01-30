import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateRole, RolesDto } from '../dtos/role-contract/models';

@Injectable({
  providedIn: 'root',
})
export class RoleAppservicesService {
  apiName = 'Default';
  

  create = (createRole: CreateRole, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RolesDto>({
      method: 'POST',
      url: '/api/app/role-appservices',
      body: createRole,
    },
    { apiName: this.apiName,...config });
  

  getAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<RolesDto>>({
      method: 'GET',
      url: '/api/app/role-appservices',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
