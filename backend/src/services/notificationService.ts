import { prisma } from '../prisma';
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_FREQUENCIES,
  NotificationPreferences,
  NotificationOption,
} from '../models/notification';
import { Prisma } from '@prisma/client';

export class NotificationService {
  getNotificationTypes(): NotificationOption[] {
    return NOTIFICATION_TYPES;
  }

  getNotificationFrequencies(): NotificationOption[] {
    return NOTIFICATION_FREQUENCIES;
  }

  async getNotificationPreferences(userId: number): Promise<NotificationPreferences | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const preferences = user.preferences as Record<string, unknown> | null;
    if (!preferences || !preferences.notification) {
      return null;
    }

    return preferences.notification as NotificationPreferences;
  }

  async saveNotificationPreferences(
    userId: number,
    notificationPreferences: NotificationPreferences
  ): Promise<NotificationPreferences> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const existingPreferences = (user.preferences as Record<string, unknown>) ?? {};
    const existingNotification = (existingPreferences.notification as NotificationPreferences) ?? {};

    const updatedNotification = {
      ...existingNotification,
      ...notificationPreferences,
    };

    const updatedPreferences = {
      ...existingPreferences,
      notification: updatedNotification,
    };

    await prisma.user.update({
      where: { id: userId },
      data: {
        preferences: updatedPreferences as unknown as Prisma.JsonObject,
      },
    });

    return updatedNotification;
  }
}
