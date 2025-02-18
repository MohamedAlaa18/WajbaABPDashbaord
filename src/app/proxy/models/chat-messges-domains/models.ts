import type { FullAuditedEntity } from '../../volo/abp/domain/entities/auditing/models';
import type { WajbaUser } from '../wajba-user-domain/models';

export interface ChatMessage extends FullAuditedEntity<number> {
  senderRole: number;
  receiverRole: number;
  message?: string;
  timestamp?: string;
  isRead: boolean;
  readAt?: string;
  senderId: number;
  wajbaUserSender: WajbaUser;
  receiverId: number;
  wajbaUserReiver: WajbaUser;
}
