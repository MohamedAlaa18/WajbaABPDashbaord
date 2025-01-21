import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface BranchDto extends EntityDto<number> {
  name?: string;
  longitude: number;
  latitude: number;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  address?: string;
  status: number;
}

export interface CreateBranchDto {
  name?: string;
  longitude: number;
  latitude: number;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  zipCode?: string;
  address?: string;
  status: number;
}

export interface GetBranchInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface UpdateBranchDto {
  id: number;
  name?: string;
  longitude: number;
  latitude: number;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  address?: string;
  status: number;
}
