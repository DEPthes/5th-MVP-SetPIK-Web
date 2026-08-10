import { useNavigate } from "react-router-dom";
import { OnboardingCta } from "@/components/onboarding/onboarding-cta";
import { OnboardingGuide } from "@/components/onboarding/onboarding-guide";
import { OnboardingHero } from "@/components/onboarding/onboarding-hero";
import "@/styles/onboarding.css";

export function OnboardingPage() {
  const navigate = useNavigate();
  const handleSpotifyStart = () => navigate("/login");

  return (
    <div className="onboarding-page">
      <OnboardingHero onSpotifyStart={handleSpotifyStart} />
      <OnboardingGuide />
      <OnboardingCta onSpotifyStart={handleSpotifyStart} />
    </div>
  );
}
