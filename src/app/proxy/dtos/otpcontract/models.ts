import type { OTPType } from '../../enums/otptype.enum';

export interface CreateUpdateOTPDto {
  type: OTPType;
  digitLimit: number;
  expiryTimeInMinutes: number;
}

export interface UpdateOtpDto {
  type: OTPType;
  digitLimit: number;
  expiryTimeInMinutes: number;
}
