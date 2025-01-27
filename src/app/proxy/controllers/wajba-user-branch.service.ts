import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { WajbaUserBranchCreateDto, WajbaUserBranchDto } from '../dtos/wajba-user-branch-contract/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class WajbaUserBranchService {
  apiName = 'Default';
  

  create = (input: WajbaUserBranchCreateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/WajbaUserBranch',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getList = (WajbaUserBranchDto: WajbaUserBranchDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/WajbaUserBranch',
      params: { wajbaUserId: WajbaUserBranchDto.wajbaUserId, branchId: WajbaUserBranchDto.branchId, id: WajbaUserBranchDto.id },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
