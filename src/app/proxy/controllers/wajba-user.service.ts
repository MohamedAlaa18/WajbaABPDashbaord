// import { RestService, Rest } from '@abp/ng.core';
// import type { PagedResultDto } from '@abp/ng.core';
// import { Injectable } from '@angular/core';
// import type { CreateUserDto, GetUserDto, GetUserListDto, UpdateWajbaUserDto, WajbaUserDto } from '../dtos/customer-contract/models';
// import type { LogInDto } from '../dtos/user-dto/models';
// import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

// @Injectable({
//   providedIn: 'root',
// })
// export class WajbaUserService {
//   apiName = 'Default';


//   deleteWajbaUserById = (id: number, config?: Partial<Rest.Config>) =>
//     this.restService.request<any, ActionResult>({
//       method: 'DELETE',
//       url: `/api/WajbaUser/${id}`,
//     },
//     { apiName: this.apiName,...config });


//   getWajbaUserById = (id: number, config?: Partial<Rest.Config>) =>
//     this.restService.request<any, ActionResult<GetUserDto>>({
//       method: 'GET',
//       url: `/api/WajbaUser/${id}`,
//     },
//     { apiName: this.apiName,...config });


//   getWajbaUserByInput = (input: GetUserListDto, config?: Partial<Rest.Config>) =>
//     this.restService.request<any, ActionResult<PagedResultDto<WajbaUserDto>>>({
//       method: 'GET',
//       url: '/api/WajbaUser/listWajbaUser',
//       params: { fullName: input.fullName, type: input.type, status: input.status, maxResultCount: input.maxResultCount, skipCount: input.skipCount },
//     },
//     { apiName: this.apiName,...config });


//   logInByLogInDto = (LogInDto: LogInDto, config?: Partial<Rest.Config>) =>
//     this.restService.request<any, IActionResult>({
//       method: 'POST',
//       url: '/api/WajbaUser/LogIn',
//       body: LogInDto,
//     },
//     { apiName: this.apiName,...config });


//   registerByInput = (input: CreateUserDto, config?: Partial<Rest.Config>) =>
//     this.restService.request<any, ActionResult>({
//       method: 'POST',
//       url: '/api/WajbaUser/Register',
//       body: input,
//     },
//     { apiName: this.apiName,...config });


//   updateWajbaUserByInput = (input: UpdateWajbaUserDto, config?: Partial<Rest.Config>) =>
//     this.restService.request<any, ActionResult>({
//       method: 'PUT',
//       url: '/api/WajbaUser/update-WajbaUser',
//       body: input,
//     },
//     { apiName: this.apiName,...config });

//   constructor(private restService: RestService) {}
// }
