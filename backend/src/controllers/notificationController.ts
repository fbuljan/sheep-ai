import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';

const notificationService = new NotificationService();

export class NotificationController {
  getNotificationTypes(_req: Request, res: Response) {
    const types = notificationService.getNotificationTypes();
    return res.status(200).json(types);
  }

  getNotificationFrequencies(_req: Request, res: Response) {
    const frequencies = notificationService.getNotificationFrequencies();
    return res.status(200).json(frequencies);
  }

  async getNotificationPreferences(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const preferences = await notificationService.getNotificationPreferences(userId);
      return res.status(200).json(preferences);
    } catch (err: any) {
      return res.status(400).json({ message: err.message ?? 'Failed to get notification preferences' });
    }
  }

  async saveNotificationPreferences(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const { notificationType, notificationFrequency } = req.body;
      if (!notificationType && !notificationFrequency) {
        return res.status(400).json({ message: 'At least one of notificationType or notificationFrequency is required' });
      }

      const preferencesToSave: { notificationType?: string; notificationFrequency?: string } = {};
      if (notificationType) preferencesToSave.notificationType = notificationType;
      if (notificationFrequency) preferencesToSave.notificationFrequency = notificationFrequency;

      const preferences = await notificationService.saveNotificationPreferences(userId, preferencesToSave);
      return res.status(200).json(preferences);
    } catch (err: any) {
      return res.status(400).json({ message: err.message ?? 'Failed to save notification preferences' });
    }
  }
}

export const notificationController = new NotificationController();
