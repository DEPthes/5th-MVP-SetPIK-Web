import { createContext } from "react";

export interface UserProfile {
  nickname: string;
  accountEmail: string;
  profileImage: string | null;
}

export interface UserProfileContextValue {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);
