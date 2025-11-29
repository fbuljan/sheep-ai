import { Preferences, User } from '../models/user';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

export class UserService {
  async getUserById(id: number): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredWebsites: user.preferredWebsites as unknown as string[],
      preferences: user.preferences as unknown as Preferences,
      phoneNumber: user.phoneNumber ?? null,
    };
  }

  async updatePreferredWebsites(
    userId: number,
    preferredWebsites: string[]
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        preferredWebsites: preferredWebsites as Prisma.JsonArray,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredWebsites: user.preferredWebsites as unknown as string[],
      preferences: user.preferences as unknown as Preferences,
      phoneNumber: user.phoneNumber ?? null,
    };
  }

  async updatePhoneNumber(
    userId: number,
    phoneNumber: string | null
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        phoneNumber,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredWebsites: user.preferredWebsites as unknown as string[],
      preferences: user.preferences as unknown as Preferences,
      phoneNumber: user.phoneNumber ?? null,
    };
  }
}
