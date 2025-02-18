import type { FullAuditedEntity } from '../../volo/abp/domain/entities/auditing/models';
import type { WajbaUser } from '../wajba-user-domain/models';

export interface UserRole extends FullAuditedEntity<number> {
  roleName?: string;
  userRoles: WajbaUser[];
}

export interface WajbaUserRoles extends FullAuditedEntity<number> {
  wajbaUserId: number;
  wajbaUser: WajbaUser;
  roleId: number;
  userRole: UserRole;
}
