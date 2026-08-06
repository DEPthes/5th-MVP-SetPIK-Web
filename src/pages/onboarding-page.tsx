import { useNavigate } from "react-router-dom";
import analysisCyanIcon from "@/assets/icons/ic-analysis-cyan.svg";
import analysisIcon from "@/assets/icons/ic-analysis-pink.svg";
import aiCyanIcon from "@/assets/icons/ic-ai-cyan.svg";
import aiIcon from "@/assets/icons/ic-ai-pink.svg";
import arrowRightIcon from "@/assets/icons/ic-arrow-right.svg";
import locationIcon from "@/assets/icons/ic-location.svg";
import noteCyanIcon from "@/assets/icons/ic-note-cyan.svg";
import noteIcon from "@/assets/icons/ic-note-pink.svg";
import ticketIcon from "@/assets/icons/ic-ticket.svg";
import billieImage from "@/assets/images/onboarding-mock-billie.png";
import coldplayImage from "@/assets/images/onboarding-mock-coldplay.png";
import theWeekndImage from "@/assets/images/onboarding-mock-theweekend.png";
import { SpotifyButton } from "@/components/common/spotify-button";

const BENEFITS = ["Spotify 플레이리스트 분석", "맞춤 공연 추천", "공연 예습 플레이리스트 생성"];

const STEPS = [
  {
    title: "Spotify 계정 연결",
    description: "Spotify 계정을 연결하여 플레이리스트에 접근합니다.",
    icon: noteIcon,
  },
  {
    title: "플레이리스트 분석",
    description: "장르, 아티스트, 트랙 패턴을 심층 분석합니다.",
    icon: analysisIcon,
  },
  {
    title: "취향 분석",
    description: "음악 취향을 학습하고 프로파일을 구성합니다.",
    icon: aiIcon,
  },
  {
    title: "맞춤 공연 추천",
    description: "취향에 맞는 공연을 추천하고 예습 플레이리스트를 생성합니다.",
    icon: ticketIcon,
  },
];

const FEATURES = [
  {
    label: "플레이리스트 분석",
    title: "Spotify 플레이리스트 분석",
    description: "Spotify 플레이리스트의 장르와 아티스트를 분석하여 사용자의 음악 취향을 정밀하게 파악합니다.",
    icon: analysisCyanIcon,
  },
  {
    label: "공연 추천",
    title: "맞춤 공연 추천",
    description: "음악 취향과 유사한 공연과 아티스트를 정확하게 추천합니다.",
    icon: aiCyanIcon,
  },
  {
    label: "공연 예습 플레이리스트",
    title: "예습 플리 생성",
    description: "추천된 공연을 더욱 즐길 수 있도록 예습 플레이리스트를 자동 생성합니다.",
    icon: noteCyanIcon,
  },
];

const CONCERT_MOCKS = [
  { artist: "Billie Eilish", location: "Jamsil Arena", match: "91% Match", image: billieImage },
  { artist: "The Weeknd", location: "KSPO Dome", match: "94% Match", image: theWeekndImage },
  { artist: "Coldplay", location: "Seoul", match: "98% Match", image: coldplayImage },
];

interface OnboardingConcertCardProps {
  artist: string;
  location: string;
  match: string;
  image: string;
  className?: string;
}

function OnboardingConcertCard({ artist, location, match, image, className }: OnboardingConcertCardProps) {
  return (
    <article className={["onboarding-concert-card", className].filter(Boolean).join(" ")}>
      <div className="onboarding-concert-card__image-wrap">
        <img className="onboarding-concert-card__image" src={image} alt="" />
      </div>
      <div className="onboarding-concert-card__content">
        <div>
          <h2 className="onboarding-concert-card__artist">{artist}</h2>
          <p className="onboarding-concert-card__location">
            <img src={locationIcon} width="14" height="14" alt="" />
            {location}
          </p>
        </div>
        <span className="onboarding-concert-card__match">{match}</span>
      </div>
    </article>
  );
}

export function OnboardingPage() {
  const navigate = useNavigate();

  function handleSpotifyStart() {
    navigate("/login");
  }

  return (
    <div className="onboarding-page">
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
            <SpotifyButton
              className="onboarding-hero__button"
              onClick={handleSpotifyStart}
              size="large"
            >
              Spotify로 시작하기
            </SpotifyButton>
            <ul className="onboarding-hero__benefits">
              {BENEFITS.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="onboarding-hero__mock-stack" aria-label="공연 추천 예시">
            {CONCERT_MOCKS.map((concert, index) => (
              <OnboardingConcertCard
                {...concert}
                className={`onboarding-concert-card--layer-${index + 1}`}
                key={concert.artist}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="onboarding-section" aria-labelledby="how-it-works-title">
        <div className="onboarding-section__heading">
          <p className="onboarding-section__eyebrow">How It Works</p>
          <h2 id="how-it-works-title">서비스 이용 방법</h2>
        </div>
        <ol className="onboarding-step-list">
          {STEPS.map((step, index) => (
            <li className="onboarding-step-card" key={step.title}>
              <span className="onboarding-step-card__number">{String(index + 1).padStart(2, "0")}</span>
              <span className="onboarding-step-card__icon">
                <img src={step.icon} width="22" height="22" alt="" />
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="onboarding-section onboarding-section--features" aria-labelledby="features-title">
        <div className="onboarding-section__heading">
          <p className="onboarding-section__eyebrow onboarding-section__eyebrow--accent">Core Features</p>
          <h2 id="features-title">주요 기능</h2>
        </div>
        <div className="onboarding-feature-list">
          {FEATURES.map((feature) => (
            <article className="onboarding-feature-card" key={feature.title}>
              <span className="onboarding-feature-card__icon">
                <img src={feature.icon} width="22" height="22" alt="" />
              </span>
              <p className="onboarding-feature-card__label">{feature.label}</p>
              <h3>{feature.title}</h3>
              <p className="onboarding-feature-card__description">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="onboarding-cta" aria-labelledby="onboarding-cta-title">
        <div className="onboarding-cta__content">
          <p className="onboarding-section__eyebrow">Get Started</p>
          <h2 id="onboarding-cta-title">당신의 음악 취향으로 새로운 공연을 만나보세요.</h2>
          <p>Spotify 계정을 연결하면 취향에 맞는 공연을 추천해 드려요.</p>
          <SpotifyButton
            className="onboarding-cta__button"
            onClick={handleSpotifyStart}
            size="large"
            trailingIcon={<img className="onboarding-cta__arrow" src={arrowRightIcon} width="18" height="18" alt="" />}
          >
            Spotify로 시작하기
          </SpotifyButton>
        </div>
      </section>
    </div>
  );
}
