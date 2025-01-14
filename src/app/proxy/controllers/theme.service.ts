import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
<<<<<<< Updated upstream
import type { GetThemeInput } from '../dtos/themes-contract/models';
import type { IFormFile } from '../microsoft/asp-net-core/http/models';
=======
import type { Base64ImageModel, CreateThemesDto } from '../dtos/themes-contract/models';
>>>>>>> Stashed changes
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  apiName = 'Default';
  

<<<<<<< Updated upstream
  create = (BrowserTabIconUrl: IFormFile, FooterLogoUrl: IFormFile, LogoUrl: IFormFile, config?: Partial<Rest.Config>) =>
=======
  create = (createThemes: CreateThemesDto, config?: Partial<Rest.Config>) =>
>>>>>>> Stashed changes
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Theme',
      body: createThemes,
    },
    { apiName: this.apiName,...config });
  

<<<<<<< Updated upstream
  delete = (id: number, config?: Partial<Rest.Config>) =>
=======
  delete = (config?: Partial<Rest.Config>) =>
>>>>>>> Stashed changes
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/Theme/${id}`,
    },
    { apiName: this.apiName,...config });
  

<<<<<<< Updated upstream
  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/Theme/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetThemeInput, config?: Partial<Rest.Config>) =>
=======
  get = (config?: Partial<Rest.Config>) =>
>>>>>>> Stashed changes
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Theme',
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

<<<<<<< Updated upstream
  update = (id: number, BrowserTabIconUrl: IFormFile, FooterLogoUrl: IFormFile, LogoUrl: IFormFile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: `/api/Theme/${id}`,
      body: LogoUrl,
    },
    { apiName: this.apiName,...config });

=======
  update = (themesDto: CreateThemesDto, config?: Partial<Rest.Config>) =>
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

>>>>>>> Stashed changes
  constructor(private restService: RestService) {}
}
