export interface SourceCategoryPreference {
  source: string;
  categories: string[];
}

export interface Preferences {
  sourceCategories?: SourceCategoryPreference[];
  [key: string]: any;
}

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  preferredWebsites: string[];
  preferences: Preferences;
  phoneNumber?: string | null;
}
