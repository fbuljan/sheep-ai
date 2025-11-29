import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';
import { DisplayType, displayTypes } from '../models/displayType';
import { Preferences } from '../models/user';

export class DisplayTypeService {
  getAllDisplayTypes(): DisplayType[] {
    return displayTypes;
  }

  getDisplayTypesByIds(ids: string[]): DisplayType[] {
    return displayTypes.filter((dt) => ids.includes(dt.id));
  }

  async saveUserDisplayPreferences(userId: number, displayTypeIds: string[]): Promise<void> {
    const validIds = displayTypeIds.filter((id) =>
      displayTypes.some((dt) => dt.id === id)
    );

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentPreferences = (user.preferences as Preferences) || {};
    const updatedPreferences = {
      ...currentPreferences,
      displayTypeIds: validIds,
    };

    await prisma.user.update({
      where: { id: userId },
      data: {
        preferences: updatedPreferences as Prisma.JsonObject,
      },
    });
  }

  async getUserDisplayPreferences(userId: number): Promise<DisplayType[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const preferences = user.preferences as Preferences;
    const displayTypeIds: string[] = preferences?.displayTypeIds || [];

    return this.getDisplayTypesByIds(displayTypeIds);
  }
}
