import { createContext } from "react";

export type OnboardingStep = "playlist" | "artist";

export interface AuthState {
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  onboardingStep: OnboardingStep;
}

export interface AuthContextValue extends AuthState {
  completeOnboarding: () => void;
  login: () => void;
  setOnboardingStep: (step: OnboardingStep) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function getOnboardingPath(step: OnboardingStep) {
  return step === "artist" ? "/onboarding/artists" : "/onboarding/playlist-selection";
}
