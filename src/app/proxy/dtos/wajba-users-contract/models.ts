import type { BranchDto } from '../branch-contract/models';

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
}

export interface GetUserListDto {
  fullName?: string;
  type?: number;
  status?: number;
  email?: string;
  phone?: string;
  role?: number;
  maxResultCount: number;
  skipCount: number;
}

export interface LogInWajbaUserDto {
  phone?: string;
}

export interface UpdateWajbaUserDto {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  type: number;
  status: number;
  role?: number;
  branchList: number[];
}

export interface WajbaUserDto {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  type: number;
  status: number;
  role?: number;
  branchList: BranchDto[];
}
