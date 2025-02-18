import type { FullAuditedEntity } from '../../volo/abp/domain/entities/auditing/models';
import type { Status } from '../../enums/status.enum';
import type { UserTypes } from '../../enums/user-types.enum';
import type { GenderType } from '../../enums/gender-type.enum';
import type { WajbaUserRoles } from '../wajba-user-role-domain/models';
import type { Coupon } from '../coupons-domain/models';
import type { ChatMessage } from '../chat-messges-domains/models';

export interface WajbaUser extends FullAuditedEntity<number> {
  fullName?: string;
  email?: string;
  phone?: string;
  status?: number;
  type?: number;
  genderType?: number;
  profilePhoto?: string;
  password?: string;
  customerRole?: number;
  wajbaUserRoles: WajbaUserRoles[];
  coupons: Coupon[];
  chatMessagesSender: ChatMessage[];
  chatMessagesReciver: ChatMessage[];
}
