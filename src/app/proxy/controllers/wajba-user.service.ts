import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ForgetPasswordDTO } from '../dtos/user-dto/models';
import type { CreateUserDto, GetUserDto, GetUserListDto, LogInWajbaUserDto, UpdateWajbaUserDto, WajbaUserDto } from '../dtos/wajba-users-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class WajbaUserService {
  apiName = 'Default';
  

  activateAccountByPhone = (Phone: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/ActivateEmailAccount',
      params: { phone: Phone },
    },
    { apiName: this.apiName,...config });
  

  activateViaCodeByGetCode = (getCode: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/WajbaUser/ActivateAccountOTP',
      params: { getCode },
    },
    { apiName: this.apiName,...config });
  

  deleteWajbaUserById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/WajbaUser/${id}`,
    },
    { apiName: this.apiName,...config });
  

  forgetPasswordOTPByOTPCode = (OTPCode: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/ForgetPasswordOTP',
      body: OTPCode,
    },
    { apiName: this.apiName,...config });
  

  forgetPasswordPostByForgetPasswordDTO = (forgetPasswordDTO: ForgetPasswordDTO, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/ForgetPasswordPost',
      body: forgetPasswordDTO,
    },
    { apiName: this.apiName,...config });
  

  getWajbaUserById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<GetUserDto>>({
      method: 'GET',
      url: `/api/WajbaUser/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getWajbaUserByInput = (input: GetUserListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PagedResultDto<WajbaUserDto>>>({
      method: 'GET',
      url: '/api/WajbaUser/listWajbaUser',
      params: { fullName: input.fullName, type: input.type, status: input.status, maxResultCount: input.maxResultCount, skipCount: input.skipCount },
    },
    { apiName: this.apiName,...config });
  

  logIn = (LogInDto: LogInWajbaUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/LogIn',
      body: LogInDto,
    },
    { apiName: this.apiName,...config });
  

  registerByInput = (input: CreateUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/Register',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateWajbaUserByInput = (input: UpdateWajbaUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/WajbaUser/update-WajbaUser',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getAllOtpCodes = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/getAllOtpCodes',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
