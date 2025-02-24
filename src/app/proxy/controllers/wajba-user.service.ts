import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { RolesDto } from '../dtos/role-contract/models';
import type { ForgetPasswordDTO } from '../dtos/user-dto/models';
import type { AccountInfoEditByWajbaUserId, CreateUserDto, GetUserListDto, LogInUserDto, LogInWajbaUserDto, OtpLoginDto, UpdateWajbaUserProfile, WajbaUserDto } from '../dtos/wajba-users-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class WajbaUserService {
  apiName = 'Default';


  accountInfoEditByAccountInfoEditByWajbaUserId = (AccountInfoEditByWajbaUserId: AccountInfoEditByWajbaUserId, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/WajbaUser/AccountInfoEdit',
      body: AccountInfoEditByWajbaUserId,
    },
    { apiName: this.apiName,...config });


  accountInfoGetByWajbaUserIdById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<WajbaUserDto>>({
      method: 'GET',
      url: '/api/WajbaUser/AccountInfoGetByWajbaUserId',
      params: { id },
    },
    { apiName: this.apiName,...config });


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


  createUserByInput = (input: CreateUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/Create-User',
      body: input,
    },
    { apiName: this.apiName,...config });


  deleteWajbaUserById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/WajbaUser/${id}`,
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
    this.restService.request<any, ActionResult<WajbaUserDto>>({
      method: 'GET',
      url: `/api/WajbaUser/${id}`,
    },
    { apiName: this.apiName,...config });


  getWajbaUserByInput = (input: GetUserListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PagedResultDto<WajbaUserDto>>>({
      method: 'GET',
      url: '/api/WajbaUser/listWajbaUser',
      params: { fullName: input.fullName, type: input.type, status: input.status, email: input.email, phone: input.phone, role: input.role, genderType: input.genderType, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });


  getrolesbyuseridById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<PagedResultDto<RolesDto>>>({
      method: 'GET',
      url: '/api/WajbaUser/GetRolebyUserId',
      params: { id },
    },
    { apiName: this.apiName,...config });


  // logIn = (loginDto: LogInUserDto, config?: Partial<Rest.Config>) =>
  //   this.restService.request<any, IActionResult>({
  //     method: 'POST',
  //     url: '/api/WajbaUser/LogIn',
  //     body: loginDto,
  //   },
  //   { apiName: this.apiName,...config });


  logIn = (LogInDto: LogInWajbaUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/LogIn-web',
      body: LogInDto,
    },
    { apiName: this.apiName,...config });


  registerByInput = (input: CreateUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/Register-web',
      body: input,
    },
    { apiName: this.apiName,...config });


  resendActivationByPhone = (Phone: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/ResendActivation',
      params: { phone: Phone },
    },
    { apiName: this.apiName,...config });


  updateProfilePhotoByInput = (input: UpdateWajbaUserProfile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/WajbaUser/UpdateProfilePhoto',
      body: input,
    },
    { apiName: this.apiName,...config });


  verifyOTPCodeByVerifyOTPCodeAndLoginDto = (VerifyOTPCode: number, loginDto: LogInWajbaUserDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/VerifyOTPCode',
      params: { verifyOTPCode: VerifyOTPCode },
      body: loginDto,
    },
    { apiName: this.apiName,...config });


  verifyOtpLoginByLoginDto = (loginDto: OtpLoginDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUser/VerifyOtpLogin',
      body: loginDto,
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
