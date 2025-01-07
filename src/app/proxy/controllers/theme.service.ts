import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { Base64ImageModel } from '../dtos/themes-contract/models';
import type { IFormFile } from '../microsoft/asp-net-core/http/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  apiName = 'Default';


  create = (BrowserTabIconUrl: IFormFile, FooterLogoUrl: IFormFile, LogoUrl: IFormFile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Theme',
      body: LogoUrl,
    },
      { apiName: this.apiName, ...config });


  delete = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: '/api/Theme',
    },
      { apiName: this.apiName, ...config });


  getById = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Theme',
    },
      { apiName: this.apiName, ...config });


  update = (BrowserTabIconUrl: IFormFile, FooterLogoUrl: IFormFile, LogoUrl: IFormFile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Theme',
      body: LogoUrl,
    },
      { apiName: this.apiName, ...config });


  updateBrowserTabIconUrlByBrowserTabIconUrl = (BrowserTabIconUrl: IFormFile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Theme/UpdateBrowserTabIconUrl',
      body: BrowserTabIconUrl,
    },
      { apiName: this.apiName, ...config });


  updateFooterLogoUrlasyncByBrowserTabIconUrl = (BrowserTabIconUrl: IFormFile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Theme/UpdateFooterLogoUrl',
      body: BrowserTabIconUrl,
    },
      { apiName: this.apiName, ...config });


  updateLogoUrlasyncByBrowserTabIconUrl = (BrowserTabIconUrl: IFormFile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Theme/UpdateLogoUrl',
      body: BrowserTabIconUrl,
    },
      { apiName: this.apiName, ...config });


  // uploadBase64ImageByModel = (model: Base64ImageModel, config?: Partial<Rest.Config>) =>
  //   this.restService.request<any, IActionResult>({
  //     method: 'POST',
  //     url: '/api/Theme/upload-base64',
  //     body: model,
  //   },
  //   { apiName: this.apiName,...config },{console.log(model)});

  uploadBase64ImageByModel = (model: Base64ImageModel, config?: Partial<Rest.Config>) => {
    // Log the model object to check its contents
    console.log('Model being sent:', model);

    // Make the request
    return this.restService.request<any, IActionResult>(
      {
        method: 'POST',
        url: '/api/Theme/upload-base64',
        body: model,
      },
      { apiName: this.apiName, ...config }
    );
  };


  constructor(private restService: RestService) { }
}
