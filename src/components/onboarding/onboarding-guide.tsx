import { ONBOARDING_FEATURES, ONBOARDING_STEPS } from "./onboarding-data";
import "./onboarding-guide.css";

export function OnboardingGuide() {
  return (
    <>
      <section className="onboarding-section" aria-labelledby="how-it-works-title">
        <div className="onboarding-section__heading">
          <p className="onboarding-section__eyebrow">How It Works</p>
          <h2 id="how-it-works-title">서비스 이용 방법</h2>
        </div>
        <ol className="onboarding-step-list">
          {ONBOARDING_STEPS.map((step, index) => (
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
          {ONBOARDING_FEATURES.map((feature) => (
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
    </>
  );
}
