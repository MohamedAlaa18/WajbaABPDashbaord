import { mapEnumToOptions } from '@abp/ng.core';

export enum UserTypes {
  Admin = 0,
  Employee = 1,
  Deliveryboy = 2,
  Customer = 3,
}

export const userTypesOptions = mapEnumToOptions(UserTypes);
