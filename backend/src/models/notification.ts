export interface NotificationOption {
  key: string;
  label: string;
}

export const NOTIFICATION_TYPES: NotificationOption[] = [
  { key: 'none', label: 'None' },
  { key: 'email', label: 'Email' },
  { key: 'whatsapp', label: 'Whatsapp' },
  { key: 'both', label: 'Both' },
];

export const NOTIFICATION_FREQUENCIES: NotificationOption[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export interface NotificationPreferences {
  notificationType?: string;
  notificationFrequency?: string;
}
