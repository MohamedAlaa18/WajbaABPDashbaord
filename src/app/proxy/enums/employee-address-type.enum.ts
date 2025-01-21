import { mapEnumToOptions } from '@abp/ng.core';

export enum EmployeeAddressType {
  Apartment = 0,
  Office = 1,
  House = 2,
}

export const employeeAddressTypeOptions = mapEnumToOptions(EmployeeAddressType);
