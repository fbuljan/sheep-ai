import bcrypt from 'bcryptjs';
import { User, users, Preferences } from '../models/user';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  preferredWebsites: string[];
  preferences?: Preferences;
  phoneNumber?: string | null;
}

export interface LoginDto {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    const existing = users.find(u => u.email === data.email);
    if (existing) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser: User = {
      id: users.length + 1,
      name: data.name,
      email: data.email,
      passwordHash,
      preferredWebsites: data.preferredWebsites || [],
      preferences: data.preferences || {},
      phoneNumber: data.phoneNumber ?? null,
    };

    users.push(newUser);

    const { passwordHash: _, ...safeUser } = newUser;
    console.log('Registered new user:', safeUser);
    return safeUser;
  }

  async login(data: LoginDto): Promise<Omit<User, 'passwordHash'>> {
    const user = users.find(u => u.email === data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const { passwordHash: _, ...safeUser } = user;
    console.log('User logged in:', safeUser);
    return safeUser;
  }
}
