import { useState } from "react";
import { SpotifyButton } from "@/components/common/spotify-button";
import { requestSpotifyLoginUrl, SpotifyAuthError } from "@/services/spotify-auth";
import "@/styles/auth.css";

export function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleSpotifyLogin() {
    if (isLoggingIn) return;

    setErrorMessage("");
    setIsLoggingIn(true);

    try {
      const loginUrl = await requestSpotifyLoginUrl();
      window.location.assign(loginUrl);
    } catch (error) {
      setErrorMessage(
        error instanceof SpotifyAuthError
          ? error.message
          : "Spotify 로그인 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
      setIsLoggingIn(false);
    }
  }

  return (
    <section className="login-page" aria-labelledby="login-title">
      <div className="login-card">
        <p className="login-card__eyebrow">당신의 플레이리스트를 공연으로</p>
        <h1 className="login-card__title" id="login-title">
          Spotify 계정 연결
        </h1>
        <p className="login-card__description">
          Spotify 계정으로 로그인하여 플레이리스트를 분석하고,
          <br />
          맞춤형 공연을 만나보세요.
        </p>

        <div className="login-card__actions">
          <SpotifyButton
            className="login-card__button"
            disabled={isLoggingIn}
            fullWidth
            onClick={handleSpotifyLogin}
          >
            {isLoggingIn ? "Spotify 로그인 준비 중..." : "Spotify로 계속하기"}
          </SpotifyButton>
          {errorMessage ? (
            <p className="login-card__error" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
