import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateCategoryDto, GetCategoryInput, UpdateCategory } from '../dtos/categories/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiName = 'Default';
  

  create = (input: CreateUpdateCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Category',
      params: { name: input.name, status: input.status, description: input.description },
      body: input.image,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/Category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/Category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCategoryItemsdtoByBranchid = (branchid: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/Category/getcategoryItems${branchid}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetCategoryInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Category',
      params: { name: input.name, branchId: input.branchId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdateCategory, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Category',
      params: { id: input.id, name: input.name, status: input.status, description: input.description },
      body: input.image,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
