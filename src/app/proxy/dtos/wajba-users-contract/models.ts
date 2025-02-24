import type { Base64ImageModel } from '../themes-contract/models';
import type { BranchDto } from '../branch-contract/models';
import type { RolesDto } from '../role-contract/models';

export interface AccountInfoEditByWajbaUserId {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  genderType?: number;
}

export interface CreateUserDto {
  fullName?: string;
  email?: string;
  phone?: string;
  status?: number;
  type?: number;
  profilePhoto?: string;
  points: number;
  password?: string;
  confirmPassword?: string;
  role?: number;
  genderType?: number;
  branchList: number[];
}

export interface GetUserListDto {
  fullName?: string;
  type?: number;
  status?: number;
  email?: string;
  phone?: string;
  role?: number;
  genderType?: number;
  skipCount?: number;
  maxResultCount?: number;
}

export interface LogInUserDto {
  phone?: string;
}

export interface LogInWajbaUserDto {
  phone?: string;
  email?: string;
  password?: string;
  logInAPPCode?: string;
}

export interface OtpLoginDto {
  phone?: string;
  otp?: string;
}

export interface UpdateWajbaUserProfile {
  id: number;
  profilePhoto: Base64ImageModel;
}

export interface WajbaUserDto {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  type: number;
  status: number;
  role?: number;
  profilePhoto?: string;
  genderType?: number;
  branchList: BranchDto[];
  rolesDtos: RolesDto[];
}
