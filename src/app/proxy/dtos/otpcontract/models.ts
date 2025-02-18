import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateOTPDto {
  type: number;
  digitLimit: number;
  expiryTimeInMinutes: number;
}

export interface GetOtpInput extends PagedAndSortedResultRequestDto {
}

export interface UpdateOtpDto {
  id: number;
  type: number;
  digitLimit: number;
  expiryTimeInMinutes: number;
}
