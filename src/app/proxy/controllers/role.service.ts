import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CreateRole, RolesDto } from '../dtos/role-contract/models';
import type { ActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  apiName = 'Default';
  

  createasyncByCreate = (create: CreateRole, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<RolesDto>>>({
      method: 'POST',
      url: '/api/Role',
      body: create,
    },
    { apiName: this.apiName,...config });
  

  getall = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<PagedResultDto<RolesDto>>>>({
      method: 'GET',
      url: '/api/Role',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
