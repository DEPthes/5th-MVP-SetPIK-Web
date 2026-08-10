import arrowRightIcon from "@/assets/icons/ic-arrow-right.svg";
import { SpotifyButton } from "@/components/common/spotify-button";
import "./onboarding-cta.css";

export function OnboardingCta({ onSpotifyStart }: { onSpotifyStart: () => void }) {
  return (
    <section className="onboarding-cta" aria-labelledby="onboarding-cta-title">
      <div className="onboarding-cta__content">
        <p className="onboarding-section__eyebrow">Get Started</p>
        <h2 id="onboarding-cta-title">당신의 음악 취향으로 새로운 공연을 만나보세요.</h2>
        <p>Spotify 계정을 연결하면 취향에 맞는 공연을 추천해 드려요.</p>
        <SpotifyButton
          className="onboarding-cta__button"
          onClick={onSpotifyStart}
          size="large"
          trailingIcon={<img className="onboarding-cta__arrow" src={arrowRightIcon} width="18" height="18" alt="" />}
        >
          Spotify로 시작하기
        </SpotifyButton>
      </div>
    </section>
  );
}
