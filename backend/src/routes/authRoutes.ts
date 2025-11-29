import { Router } from 'express';
import { authController } from '../controllers/authController';

export const authRouter = Router();

// POST /auth/register
authRouter.post('/register', (req, res) => authController.register(req, res));

// POST /auth/login
authRouter.post('/login', (req, res) => authController.login(req, res));
