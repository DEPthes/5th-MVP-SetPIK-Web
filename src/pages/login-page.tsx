import { useNavigate } from "react-router-dom";
import { SpotifyButton } from "@/components/common/spotify-button";
import "@/styles/auth.css";

export function LoginPage() {
  const navigate = useNavigate();

  function handleSpotifyLogin() {
    navigate("/onboarding/playlist-selection", { replace: true });
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
            fullWidth
            onClick={handleSpotifyLogin}
          >
            Spotify로 계속하기
          </SpotifyButton>
        </div>
      </div>
    </section>
  );
}
