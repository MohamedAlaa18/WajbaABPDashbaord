import { mapEnumToOptions } from '@abp/ng.core';

export enum Status {
  InActive = 1,
  Active = 2,
}

export const statusOptions = mapEnumToOptions(Status);
