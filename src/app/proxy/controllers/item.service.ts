import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { ItemWithDependenciesDto } from '../dtos/items-dtos/item-dependencies/models';
import type { AddPointsToItemDto, CreateItemDto, GetItemInput, ItemDto, UpdateItemDTO } from '../dtos/items-dtos/models';
import type { Base64ImageModel } from '../dtos/themes-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  apiName = 'Default';
  

  addPointsToItemByInput = (input: AddPointsToItemDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Item/add-points-to-item',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateItemDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Item',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/Item/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deletePointsFromItemByInput = (input: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: '/api/Item/Delete-points-From-item',
      params: { input },
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
  

  getItemWithTransformedDetailsById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<ItemWithDependenciesDto>>>({
      method: 'GET',
      url: `/api/Item/${id}/details-transformed`,
    },
    { apiName: this.apiName,...config });
  

  getItemsByBranchByBranchId = (branchId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<PagedResultDto<ItemDto>>>>({
      method: 'GET',
      url: `/api/Item/by-branch/${branchId}`,
    },
    { apiName: this.apiName,...config });
  

  getItemsByCategoryByCategoryIdAndName = (categoryId: number, name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<PagedResultDto<ItemDto>>>>({
      method: 'GET',
      url: '/api/Item/nameAndcategoryid',
      params: { categoryId, name },
    },
    { apiName: this.apiName,...config });
  

  getItemsByCategoryNameByBranchidAndItemnameAndCategoryname = (branchid: number, itemname: string, categoryname: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<PagedResultDto<ItemDto>>>>({
      method: 'GET',
      url: '/api/Item/nameAndcategoryname',
      params: { branchid, itemname, categoryname },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetItemInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Item',
      params: { name: input.name, categoryId: input.categoryId, itemType: input.itemType, isFeatured: input.isFeatured, isDeleted: input.isDeleted, status: input.status, minPrice: input.minPrice, maxPrice: input.maxPrice, minTaxValue: input.minTaxValue, maxTaxValue: input.maxTaxValue, branchId: input.branchId, itemId: input.itemId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  updatImageByIdAndModel = (id: number, model: Base64ImageModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Item/editimage',
      params: { id },
      body: model,
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdateItemDTO, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Item',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updatePointsOfItemByInput = (input: AddPointsToItemDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Item/Update-points-Of-item',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
