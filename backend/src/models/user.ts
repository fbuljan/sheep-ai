export interface Preferences {
  // za sad bilo sto, kasnije ces definirat shape
  [key: string]: any;
}

export interface User {
  id: number; // auto-increment mock; kasnije sqlite id
  name: string;
  email: string;
  passwordHash: string;
  preferredWebsites: string[];
  preferences: Preferences;
  phoneNumber?: string | null;
}

// ovo će glumiti "bazu" dok ne ubacimo sqlite
export const users: User[] = [];
