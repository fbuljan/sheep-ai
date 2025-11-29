import { Request, Response } from 'express';
import { createHmac } from 'crypto';
import { AuthService } from '../services/authService';

const authService = new AuthService();
const JWT_SECRET = process.env.JWT_SECRET || '123456789abcdef';

const base64UrlEncode = (value: Buffer | string) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const signJwt = (payload: Record<string, unknown>, secret: string, expiresInSeconds = 3600) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const timestamp = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: timestamp, exp: timestamp + expiresInSeconds };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(body));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = base64UrlEncode(createHmac('sha256', secret).update(signingInput).digest());

  return `${signingInput}.${signature}`;
};

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ message: err.message ?? 'Register failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const user = await authService.login(req.body);
      const token = signJwt({ sub: user.id, email: user.email }, JWT_SECRET);
      return res.status(200).json({ user, token });
    } catch (err: any) {
      return res.status(401).json({ message: err.message ?? 'Login failed' });
    }
  }
}

export const authController = new AuthController();
