import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthState } from "@/contexts/auth-context";
import { clearSpotifyAccessToken } from "@/services/spotify-auth";
import { getStorageItem, setStorageItem } from "@/utils/storage";

const DEFAULT_AUTH_STATE: AuthState = {
  isAuthenticated: false,
  isOnboardingComplete: false,
  onboardingStep: "playlist",
};

// 로컬에서 로그인 이후 화면을 개발할 때만 사용한다.
// Vite 개발 모드가 아니면 환경 변수 값이 있어도 절대 적용하지 않는다.
const isDevelopmentAuthBypass =
  import.meta.env.DEV && import.meta.env.VITE_DEV_AUTH_BYPASS === "true";

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

  const visibleAuthState: AuthState = isDevelopmentAuthBypass
    ? {
        ...authState,
        isAuthenticated: true,
        isOnboardingComplete: true,
      }
    : authState;

  useEffect(() => {
    setStorageItem("auth", authState);
  }, [authState]);

  function login() {
    setAuthState((currentState) => ({
      ...currentState,
      isAuthenticated: true,
    }));
  }

  function logout() {
    clearSpotifyAccessToken();
    setAuthState(DEFAULT_AUTH_STATE);
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
        ...visibleAuthState,
        completeOnboarding,
        login,
        logout,
        setOnboardingStep,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
