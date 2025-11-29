export interface Preferences {
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
