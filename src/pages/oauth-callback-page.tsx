import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SpotifyButton } from "@/components/common/spotify-button";
import { getOnboardingPath } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/use-auth";
import { confirmSpotifyLogin, SpotifyAuthError } from "@/services/spotify-auth";
import "@/styles/auth.css";

type OAuthCallbackOutcome = "success" | "failure";

interface OAuthCallbackPageProps {
  outcome: OAuthCallbackOutcome;
}

export function OAuthCallbackPage({ outcome }: OAuthCallbackPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOnboardingComplete, login, onboardingStep } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (outcome !== "success") return;

    let isActive = true;

    async function verifyLogin() {
      try {
        await confirmSpotifyLogin();

        if (!isActive) return;

        login();
        navigate(
          isOnboardingComplete ? "/concerts" : getOnboardingPath(onboardingStep),
          { replace: true },
        );
      } catch (error) {
        if (!isActive) return;

        setErrorMessage(
          error instanceof SpotifyAuthError
            ? error.message
            : "Spotify 로그인 확인 중 오류가 발생했습니다.",
        );
      }
    }

    void verifyLogin();

    return () => {
      isActive = false;
    };
  }, [isOnboardingComplete, login, navigate, onboardingStep, outcome]);

  const failureCode = new URLSearchParams(location.search).get("code");
  const description = outcome === "failure"
    ? failureCode
      ? `Spotify 로그인에 실패했습니다. 오류 코드: ${failureCode}`
      : "Spotify 로그인에 실패했습니다. 다시 시도해주세요."
    : errorMessage || "Spotify 로그인 정보를 확인하고 있습니다.";

  return (
    <section className="login-page" aria-labelledby="oauth-callback-title">
      <div className="login-card login-card--callback">
        <p className="login-card__eyebrow">Spotify 계정 연결</p>
        <h1 className="login-card__title" id="oauth-callback-title">
          {outcome === "failure" || errorMessage ? "로그인에 실패했어요" : "로그인하는 중이에요"}
        </h1>
        <p className="login-card__description" role={errorMessage || outcome === "failure" ? "alert" : "status"}>
          {description}
        </p>
        {outcome === "failure" || errorMessage ? (
          <div className="login-card__actions">
            <SpotifyButton className="login-card__button" fullWidth onClick={() => navigate("/login", { replace: true })}>
              Spotify 로그인 다시 시도하기
            </SpotifyButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}
