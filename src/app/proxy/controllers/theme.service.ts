import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { Base64ImageModel, CreateThemesDto, UpdateThemeDto } from '../dtos/themes-contract/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  apiName = 'Default';
  

  create = (createThemes: CreateThemesDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Theme',
      body: createThemes,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: '/api/Theme',
      params: { id },
    },
    { apiName: this.apiName,...config });
  

  getByIdById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Theme',
      params: { id },
    },
    { apiName: this.apiName,...config });
  

  update = (themesDto: UpdateThemeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Theme',
      body: themesDto,
    },
    { apiName: this.apiName,...config });
  

  uploadBase64ImageByModel = (model: Base64ImageModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Theme/upload-base64',
      body: model,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
