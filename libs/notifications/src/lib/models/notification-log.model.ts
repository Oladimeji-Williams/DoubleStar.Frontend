export type NotificationChannel =
  | 'Email'
  | 'Sms';

export type NotificationStatus =
  | 'Sent'
  | 'Failed';

export interface NotificationLogEntry {
  id: number;
  channel: NotificationChannel;
  recipient: string;
  templateName: string;
  status: NotificationStatus;
  errorMessage: string | null;
  createdAt: string;
}