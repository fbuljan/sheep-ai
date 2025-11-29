import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';

export const notificationRouter = Router();

// GET /notifications/types - get all notification types
notificationRouter.get('/types', (req, res) => notificationController.getNotificationTypes(req, res));

// GET /notifications/frequencies - get all notification frequencies
notificationRouter.get('/frequencies', (req, res) => notificationController.getNotificationFrequencies(req, res));

// GET /notifications/preferences/:userId - get notification preferences for a user
notificationRouter.get('/preferences/:userId', (req, res) =>
  notificationController.getNotificationPreferences(req, res)
);

// PUT /notifications/preferences/:userId - save notification preferences for a user
notificationRouter.put('/preferences/:userId', (req, res) =>
  notificationController.saveNotificationPreferences(req, res)
);
