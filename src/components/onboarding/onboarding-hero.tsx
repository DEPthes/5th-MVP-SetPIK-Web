import { SpotifyButton } from "@/components/common/spotify-button";
import { OnboardingConcertCard } from "./onboarding-concert-card";
import { ONBOARDING_BENEFITS, ONBOARDING_CONCERTS } from "./onboarding-data";
import "./onboarding-hero.css";

export function OnboardingHero({ onSpotifyStart }: { onSpotifyStart: () => void }) {
  return (
    <section className="onboarding-hero" aria-labelledby="onboarding-title">
      <div className="onboarding-hero__wave" aria-hidden="true" />
      <div className="onboarding-hero__inner">
        <div className="onboarding-hero__content">
          <h1 className="onboarding-hero__title" id="onboarding-title">
            <span>당신의 플레이리스트가</span>
            <span className="onboarding-hero__title--brand">새로운 공연을</span>
            <span>만나는 가장 쉬운 방법</span>
          </h1>
          <p className="onboarding-hero__description">
            Spotify 플레이리스트를 분석하여 당신의 음악 취향에 맞는 공연을
            <br />
            추천하고 공연 예습 플레이리스트를 자동으로 생성합니다.
          </p>
          <SpotifyButton className="onboarding-hero__button" onClick={onSpotifyStart} size="large">
            Spotify로 시작하기
          </SpotifyButton>
          <ul className="onboarding-hero__benefits">
            {ONBOARDING_BENEFITS.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        </div>
        <div className="onboarding-hero__mock-stack" aria-label="공연 추천 예시">
          {ONBOARDING_CONCERTS.map((concert, index) => (
            <OnboardingConcertCard
              {...concert}
              className={`onboarding-concert-card--layer-${index + 1}`}
              key={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
