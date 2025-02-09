import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CreatePopularitem, GetPopulariteminput, Popularitemdto, UpdateImage, UpdatePopularItemdto } from '../dtos/popular-itemstoday/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class PopularItemsService {
  apiName = 'Default';
  

  create = (input: CreatePopularitem, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/PopularItems',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: '/api/PopularItems',
      params: { id },
    },
    { apiName: this.apiName,...config });
  

  get = (input: GetPopulariteminput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/PopularItems',
      params: { name: input.name, status: input.status, description: input.description, currentprice: input.currentprice, prePrice: input.prePrice, branchid: input.branchid, createdAtStart: input.createdAtStart, createdAtEnd: input.createdAtEnd, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<Popularitemdto>>>({
      method: 'GET',
      url: `/api/PopularItems/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getbyNameByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<PagedResultDto<Popularitemdto>>>>({
      method: 'GET',
      url: '/api/PopularItems/byname',
      params: { name },
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdatePopularItemdto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/PopularItems',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateImageByUpdateImage = (updateImage: UpdateImage, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/PopularItems/UpdateImage',
      body: updateImage,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
