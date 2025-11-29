import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export class UserController {
  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (err: any) {
      return res.status(500).json({ message: err.message ?? 'Failed to fetch user' });
    }
  }

  async updatePreferredWebsites(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const { preferredWebsites } = req.body;
      if (!preferredWebsites || !Array.isArray(preferredWebsites)) {
        return res.status(400).json({ message: 'preferredWebsites must be an array' });
      }

      const user = await userService.updatePreferredWebsites(id, preferredWebsites);
      return res.status(200).json(user);
    } catch (err: any) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(500).json({ message: err.message ?? 'Failed to update preferred websites' });
    }
  }

  async updatePhoneNumber(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const { phoneNumber } = req.body;
      if (phoneNumber === undefined) {
        return res.status(400).json({ message: 'phoneNumber is required' });
      }

      const user = await userService.updatePhoneNumber(id, phoneNumber);
      return res.status(200).json(user);
    } catch (err: any) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(500).json({ message: err.message ?? 'Failed to update phone number' });
    }
  }

  async setSourceCategories(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const { source } = req.params;
      const { categories } = req.body;

      if (!categories || !Array.isArray(categories)) {
        return res.status(400).json({ message: 'categories must be an array' });
      }

      const result = await userService.setSourceCategories(id, source, categories);
      return res.status(200).json(result);
    } catch (err: any) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(500).json({ message: err.message ?? 'Failed to set source categories' });
    }
  }

  async getSourceCategories(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const { source } = req.params;

      const result = await userService.getSourceCategories(id, source);
      if (!result) {
        return res.status(200).json({ source, categories: [] });
      }

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err.message ?? 'Failed to get source categories' });
    }
  }

  async getArticlesByPreferredCategories(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const { source } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

      const result = await userService.getArticlesByPreferredCategories(id, source, limit);

      return res.status(200).json({
        success: true,
        count: result.articles.length,
        preferredCategories: result.preferredCategories,
        articles: result.articles,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message ?? 'Failed to get articles' });
    }
  }
}

export const userController = new UserController();
