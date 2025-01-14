import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateItemDto, GetItemInput, ItemDto } from '../dtos/items-dtos/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  apiName = 'Default';
  

  create = (input: CreateItemDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Item',
      params: { name: input.name, price: input.price, isFeatured: input.isFeatured, status: input.status, itemType: input.itemType, note: input.note, description: input.description, taxValue: input.taxValue, categoryId: input.categoryId, branchIds: input.branchIds },
      body: input.imageUrl,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/Item/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/Item/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getItemWithDetailsById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ItemDto>({
      method: 'GET',
      url: `/api/Item/${id}/details`,
    },
    { apiName: this.apiName,...config });
  

  getItemsByBranchByBranchId = (branchId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ItemDto[]>({
      method: 'GET',
      url: `/api/Item/by-branch/${branchId}`,
    },
    { apiName: this.apiName,...config });
  

  getItemsByCategoryByCategoryId = (categoryId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ItemDto[]>({
      method: 'GET',
      url: `/api/Item/by-category/${categoryId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetItemInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Item',
      params: { filter: input.filter, categoryId: input.categoryId, itemType: input.itemType, isFeatured: input.isFeatured, isDeleted: input.isDeleted, status: input.status, minPrice: input.minPrice, maxPrice: input.maxPrice, minTaxValue: input.minTaxValue, maxTaxValue: input.maxTaxValue, branchId: input.branchId, itemId: input.itemId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: number, input: CreateItemDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Item',
      params: { id, name: input.name, price: input.price, isFeatured: input.isFeatured, status: input.status, itemType: input.itemType, note: input.note, description: input.description, taxValue: input.taxValue, categoryId: input.categoryId, branchIds: input.branchIds },
      body: input.imageUrl,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
