import type { FullAuditedEntityDto } from '@abp/ng.core';
import type { WajbaUser } from '../../models/wajba-user-domain/models';

export interface ChatMessagesDto extends FullAuditedEntityDto<number> {
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
