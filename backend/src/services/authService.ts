import bcrypt from 'bcryptjs';
import { Preferences, User } from '../models/user';
import { prisma } from '../prisma';

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
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const created = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        preferredWebsites: data.preferredWebsites,
        preferences: data.preferences ?? {},
        phoneNumber: data.phoneNumber ?? null,
      },
    });

    const safeUser: Omit<User, 'passwordHash'> = {
      id: created.id,
      name: created.name,
      email: created.email,
      preferredWebsites: created.preferredWebsites as unknown as string[],
      preferences: created.preferences as unknown as Preferences,
      phoneNumber: created.phoneNumber ?? null,
    };

    console.log('Registered new user:', safeUser);
    return safeUser;
  }

  async login(data: LoginDto): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const safeUser: Omit<User, 'passwordHash'> = {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredWebsites: user.preferredWebsites as unknown as string[],
      preferences: user.preferences as unknown as Preferences,
      phoneNumber: user.phoneNumber ?? null,
    };

    console.log('User logged in:', safeUser);
    return safeUser;
  }
}
