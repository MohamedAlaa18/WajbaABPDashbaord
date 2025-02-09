import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CreateRole, RolesDto, UpdateRole } from '../dtos/role-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

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
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/Role/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<RolesDto>>>({
      method: 'GET',
      url: `/api/Role/GetById${id}`,
    },
    { apiName: this.apiName,...config });
  

  getall = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<PagedResultDto<RolesDto>>>>({
      method: 'GET',
      url: '/api/Role',
    },
    { apiName: this.apiName,...config });
  

  update = (updateRole: UpdateRole, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<RolesDto>>>({
      method: 'PUT',
      url: '/api/Role',
      body: updateRole,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
