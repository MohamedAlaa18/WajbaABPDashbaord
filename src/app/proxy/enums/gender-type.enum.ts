import { mapEnumToOptions } from '@abp/ng.core';

export enum GenderType {
  Male = 1,
  Female = 2,
}

export const genderTypeOptions = mapEnumToOptions(GenderType);
