import { mapEnumToOptions } from '@abp/ng.core';

export enum Status {
  InActive = 0,
  Active = 1,
}

export const statusOptions = mapEnumToOptions(Status);
