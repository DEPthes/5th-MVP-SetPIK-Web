import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthState } from "@/contexts/auth-context";
import { getStorageItem, setStorageItem } from "@/utils/storage";

const DEFAULT_AUTH_STATE: AuthState = {
  isAuthenticated: false,
  isOnboardingComplete: false,
  onboardingStep: "playlist",
};

function readAuthState(): AuthState {
  const storedState = getStorageItem<Partial<AuthState>>("auth", {});

  return {
    ...DEFAULT_AUTH_STATE,
    ...storedState,
    onboardingStep: storedState.onboardingStep === "artist" ? "artist" : "playlist",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(readAuthState);

  useEffect(() => {
    setStorageItem("auth", authState);
  }, [authState]);

  function login() {
    setAuthState((currentState) => ({
      ...currentState,
      isAuthenticated: true,
    }));
  }

  function setOnboardingStep(step: AuthState["onboardingStep"]) {
    setAuthState((currentState) => ({
      ...currentState,
      onboardingStep: step,
    }));
  }

  function completeOnboarding() {
    setAuthState((currentState) => ({
      ...currentState,
      isAuthenticated: true,
      isOnboardingComplete: true,
    }));
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        completeOnboarding,
        login,
        setOnboardingStep,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
