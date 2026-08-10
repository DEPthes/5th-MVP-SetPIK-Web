import locationIcon from "@/assets/icons/ic-location.svg";
import "./onboarding-card.css";

interface OnboardingConcertCardProps {
  artist: string;
  className?: string;
  image: string;
  location: string;
  match: string;
}

export function OnboardingConcertCard({ artist, className, image, location, match }: OnboardingConcertCardProps) {
  return (
    <article className={["onboarding-concert-card", className].filter(Boolean).join(" ")}>
      <div className="onboarding-concert-card__image-wrap">
        <img className="onboarding-concert-card__image" src={image} alt="" />
      </div>
      <div className="onboarding-concert-card__content">
        <div>
          <h2 className="onboarding-concert-card__artist">{artist}</h2>
          <p className="onboarding-concert-card__location"><img src={locationIcon} width="14" height="14" alt="" />{location}</p>
        </div>
        <span className="onboarding-concert-card__match">{match}</span>
      </div>
    </article>
  );
}
