import { useEffect, useState, type ReactNode } from "react";
import { UserProfileContext, type UserProfile } from "@/contexts/user-profile-context";
import { getStorageItem, setStorageItem } from "@/utils/storage";

const DEFAULT_USER_PROFILE: UserProfile = {
  nickname: "SetPik User",
  accountEmail: "user@google.com",
  profileImage: null,
};

function readUserProfile() {
  return {
    ...DEFAULT_USER_PROFILE,
    ...getStorageItem<Partial<UserProfile>>("user-profile", {}),
  };
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(readUserProfile);

  useEffect(() => {
    setStorageItem("user-profile", profile);
  }, [profile]);

  function updateProfile(updates: Partial<UserProfile>) {
    setProfile((currentProfile) => ({ ...currentProfile, ...updates }));
  }

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}
