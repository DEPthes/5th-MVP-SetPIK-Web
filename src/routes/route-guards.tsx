import { Navigate, Outlet } from "react-router-dom";
import { getOnboardingPath } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/use-auth";

export function PublicAccessRoute() {
  const { isOnboardingComplete } = useAuth();

  return isOnboardingComplete ? <Navigate replace to="/concerts" /> : <Outlet />;
}

export function SelectionAccessRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
}

export function ArtistSelectionAccessRoute() {
  const { isAuthenticated, isOnboardingComplete, onboardingStep } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return isOnboardingComplete || onboardingStep === "artist"
    ? <Outlet />
    : <Navigate replace to="/onboarding/playlist-selection" />;
}

export function AuthenticatedAccessRoute() {
  const { isAuthenticated, isOnboardingComplete, onboardingStep } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return isOnboardingComplete
    ? <Outlet />
    : <Navigate replace to={getOnboardingPath(onboardingStep)} />;
}

export function RouteFallback() {
  const { isAuthenticated, isOnboardingComplete, onboardingStep } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return isOnboardingComplete
    ? <Navigate replace to="/concerts" />
    : <Navigate replace to={getOnboardingPath(onboardingStep)} />;
}
