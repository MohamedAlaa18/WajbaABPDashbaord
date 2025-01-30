import type { BranchDto } from '../branch-contract/models';

export interface AccountInfoEditByWajbaUserId {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  type: number;
  status: number;
  role?: number;
  genderType?: number;
}

export interface CreateUserDto {
  fullName?: string;
  email?: string;
  phone?: string;
  status: number;
  type: number;
  profilePhoto?: string;
  points: number;
  password?: string;
  confirmPassword?: string;
  role?: number;
  genderType?: number;
  branchList: number[];
}

export interface GetUserDto {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  type: number;
  status: number;
  role?: number;
  genderType?: number;
}

export interface GetUserListDto {
  fullName?: string;
  type?: number;
  status?: number;
  email?: string;
  phone?: string;
  role?: number;
  genderType?: number;
  maxResultCount: number;
  skipCount: number;
}

export interface LogInWajbaUserDto {
  phone?: string;
  email?: string;
  password?: string;
  logInAPPCode?: string;
}

export interface WajbaUserDto {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  type: number;
  status: number;
  role?: number;
  genderType?: number;
  branchList: BranchDto[];
}
