import { prisma } from '../prisma';
import { NotificationPreferences } from '../models/notification';
import { sendNotificationEmail } from './emailService';

interface ScheduledNotification {
  userId: number;
  timeoutId: NodeJS.Timeout;
}

const scheduledNotifications: Map<number, ScheduledNotification> = new Map();

const DEMO_DELAY_MS = 30 * 1000; // 30 seconds for demo

async function sendNotification(userId: number): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, phoneNumber: true, preferences: true },
  });

  if (!user) {
    console.log(`[Notification] User ${userId} not found, skipping notification`);
    return;
  }

  const preferences = user.preferences as Record<string, unknown> | null;
  const notification = preferences?.notification as NotificationPreferences | undefined;

  if (!notification) {
    console.log(`[Notification] No notification preferences for user ${userId}, skipping`);
    return;
  }

  const { notificationType, notificationFrequency } = notification;

  const message = `🐑 SIKUM Update: Here's your ${notificationFrequency} digest of personalized news and insights!`;

  switch (notificationType) {
    case 'email':
      await sendNotificationEmail({
        to: user.email,
        subject: `🐑 Your ${notificationFrequency} SIKUM digest`,
        userName: user.name,
        frequency: notificationFrequency || 'daily',
        userId,
      });
      break;
    case 'whatsapp':
      // TODO: Implement WhatsApp API
      console.log(`[WhatsApp Notification] To: ${user.phoneNumber || 'No phone number'}`);
      console.log(`[WhatsApp Notification] Message: ${message}`);
      break;
    case 'both':
      await sendNotificationEmail({
        to: user.email,
        subject: `🐑 Your ${notificationFrequency} SIKUM digest`,
        userName: user.name,
        frequency: notificationFrequency || 'daily',
        userId,
      });
      // TODO: Implement WhatsApp API
      console.log(`[WhatsApp Notification] To: ${user.phoneNumber || 'No phone number'}`);
      console.log(`[WhatsApp Notification] Message: ${message}`);
      break;
    case 'none':
    default:
      console.log(`[Notification] User ${userId} has notifications disabled`);
      return;
  }

  // Reschedule the next notification
  // scheduleNotification(userId);
}

export function scheduleNotification(userId: number): void {
  // Cancel any existing scheduled notification for this user
  cancelScheduledNotification(userId);

  const timeoutId = setTimeout(() => {
    sendNotification(userId);
  }, DEMO_DELAY_MS);

  scheduledNotifications.set(userId, { userId, timeoutId });
  console.log(`[Scheduler] Notification scheduled for user ${userId} in ${DEMO_DELAY_MS / 1000} seconds`);
}

export function cancelScheduledNotification(userId: number): void {
  const existing = scheduledNotifications.get(userId);
  if (existing) {
    clearTimeout(existing.timeoutId);
    scheduledNotifications.delete(userId);
    console.log(`[Scheduler] Cancelled scheduled notification for user ${userId}`);
  }
}
