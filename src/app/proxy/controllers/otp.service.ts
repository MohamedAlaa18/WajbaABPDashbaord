import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateOTPDto, UpdateOtpDto } from '../dtos/otpcontract/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class OTPService {
  apiName = 'Default';
  

  create = (input: CreateOTPDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/OTP',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: '/api/OTP',
    },
    { apiName: this.apiName,...config });
  

  getAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/OTP',
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdateOtpDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/OTP',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
