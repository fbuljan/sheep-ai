import { Request, Response } from 'express';
import { DisplayTypeService } from '../services/displayTypeService';

const displayTypeService = new DisplayTypeService();

export class DisplayTypeController {
  async getAllDisplayTypes(_req: Request, res: Response) {
    try {
      const types = displayTypeService.getAllDisplayTypes();
      return res.status(200).json(types);
    } catch (err: any) {
      return res.status(500).json({ message: err.message ?? 'Failed to fetch display types' });
    }
  }

  async saveUserPreferences(req: Request, res: Response) {
    try {
      const { userId, displayTypeIds } = req.body;

      if (!userId || typeof userId !== 'number') {
        return res.status(400).json({ message: 'userId is required and must be a number' });
      }

      if (!Array.isArray(displayTypeIds)) {
        return res.status(400).json({ message: 'displayTypeIds must be an array' });
      }

      await displayTypeService.saveUserDisplayPreferences(userId, displayTypeIds);
      return res.status(200).json({ message: 'Preferences saved successfully' });
    } catch (err: any) {
      if (err.message === 'User not found') {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message ?? 'Failed to save preferences' });
    }
  }

  async getUserPreferences(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);

      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid userId' });
      }

      const preferences = await displayTypeService.getUserDisplayPreferences(userId);
      return res.status(200).json(preferences);
    } catch (err: any) {
      if (err.message === 'User not found') {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message ?? 'Failed to fetch preferences' });
    }
  }
}

export const displayTypeController = new DisplayTypeController();
