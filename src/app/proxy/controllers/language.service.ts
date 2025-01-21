import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CreateUpdateLanguageDto, GetLanguageInput, LanguageDto, UpdateLanguagedto } from '../dtos/languages/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  apiName = 'Default';
  

  createasyncByLanguageDto = (languageDto: CreateUpdateLanguageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Language',
      body: languageDto,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/Language/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAllByDto = (dto: GetLanguageInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Language',
      params: { sorting: dto.sorting, skipCount: dto.skipCount, maxResultCount: dto.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<LanguageDto>>>({
      method: 'GET',
      url: `/api/Language/${id}`,
    },
    { apiName: this.apiName,...config });
  

  upadteByUpdate = (update: UpdateLanguagedto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Language',
      body: update,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
