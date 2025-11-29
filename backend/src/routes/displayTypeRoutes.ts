import { Router } from 'express';
import { displayTypeController } from '../controllers/displayTypeController';

export const displayTypeRouter = Router();

// GET /display-types - Get all available display types
displayTypeRouter.get('/', (req, res) => displayTypeController.getAllDisplayTypes(req, res));

// POST /display-types/preferences - Save user display preferences
displayTypeRouter.post('/preferences', (req, res) => displayTypeController.saveUserPreferences(req, res));

// GET /display-types/preferences/:userId - Get user display preferences
displayTypeRouter.get('/preferences/:userId', (req, res) => displayTypeController.getUserPreferences(req, res));
