// libs/notifications/src/lib/models/notification-log.model.ts
export interface NotificationLogEntry {
  id: number;
  channel: string;
  recipient: string;
  templateName: string;
  status: string;
  errorMessage: string | null;
  createdAt: string;
}