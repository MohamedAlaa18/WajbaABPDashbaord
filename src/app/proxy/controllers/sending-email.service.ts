import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateSendingEmailDto } from '../dtos/email-contract/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class SendingEmailService {
  apiName = 'Default';
  

  create = (input: CreateUpdateSendingEmailDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/SendingEmail/create',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getFirst = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/SendingEmail/get-first',
    },
    { apiName: this.apiName,...config });
  

  update = (input: CreateUpdateSendingEmailDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/SendingEmail/update',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
