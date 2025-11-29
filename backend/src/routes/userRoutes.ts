import { Router } from 'express';
import { userController } from '../controllers/userController';

export const userRouter = Router();

// GET /users/:id
userRouter.get('/:id', (req, res) => userController.getUserById(req, res));

// PUT /users/:id/preferred-websites
userRouter.put('/:id/preferred-websites', (req, res) => userController.updatePreferredWebsites(req, res));

// PUT /users/:id/phone-number
userRouter.put('/:id/phone-number', (req, res) => userController.updatePhoneNumber(req, res));
