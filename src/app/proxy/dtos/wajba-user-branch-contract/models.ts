import type { EntityDto } from '@abp/ng.core';

export interface WajbaUserBranchCreateDto {
  wajbaUserId: number;
  branchId: number;
}

export interface WajbaUserBranchDto extends EntityDto<number> {
  wajbaUserId: number;
  branchId: number;
}
