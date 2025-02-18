
export interface CreateNotificationSettingsdto {
  eventName?: string;
  eventDescription?: string;
  notificationType: number;
  isEnabled: boolean;
}

export interface NotificationSettingDto {
  id: number;
  eventName?: string;
  eventDescription?: string;
  notificationType: number;
  isEnabled: boolean;
}

export interface UpdateNotificationSettings {
  id: number;
  isEnable: boolean;
}
