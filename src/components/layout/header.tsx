import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import notificationIcon from "@/assets/icons/ic_notification.svg";
import setPikLogo from "@/assets/icons/ic_setpik_logo.svg";
import spotifyIcon from "@/assets/icons/ic_spotify_white.svg";
import { IconButton } from "@/components/common/icon-button";
import "./header.css";

interface HeaderProps {
  variant: "public" | "authenticated";
  userInitial?: string;
}

function getNavigationClassName(isActive: boolean) {
  return `site-nav__link${isActive ? " site-nav__link--active" : ""}`;
}

export function Header({ variant, userInitial = "U" }: HeaderProps) {
  const { pathname } = useLocation();
  const { isOnboardingComplete } = useAuth();
  const isConcertsPage = pathname.startsWith("/concerts");
  const isPreStudyPlaylistPage = pathname.startsWith("/pre-study-playlists");
  const isMyPage = pathname.startsWith("/mypage")
    || pathname.startsWith("/saved-concerts")
    || pathname.startsWith("/recently-viewed")
    || pathname.startsWith("/created-playlists");
  const isOnboardingSelectionPage = pathname === "/onboarding/playlist-selection"
    || pathname === "/onboarding/artists"
    || pathname === "/preferences/playlists";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          className="site-logo"
          to={variant === "authenticated" && isOnboardingComplete ? "/concerts" : "/"}
          aria-label="SetPik 홈"
        >
          <img src={setPikLogo} alt="" />
        </Link>

        {variant === "public" ? (
          <Link className="spotify-connect-link" to="/login" aria-label="Spotify로 시작하기">
            <img src={spotifyIcon} width="16" height="16" alt="" />
            <span>Spotify로 시작하기</span>
          </Link>
        ) : (
          <>
            {!isOnboardingSelectionPage ? (
              <nav className="site-nav" aria-label="주요 메뉴">
                <Link
                  className={getNavigationClassName(isConcertsPage)}
                  to="/concerts"
                  aria-current={isConcertsPage ? "page" : undefined}
                >
                  공연 홈
                </Link>
                <Link
                  className={getNavigationClassName(isPreStudyPlaylistPage)}
                  to="/pre-study-playlists"
                  aria-current={isPreStudyPlaylistPage ? "page" : undefined}
                >
                  예습 플리 생성
                </Link>
                <Link
                  className={getNavigationClassName(isMyPage)}
                  to="/mypage"
                  aria-current={isMyPage ? "page" : undefined}
                >
                  마이페이지
                </Link>
              </nav>
            ) : null}

            <div className="site-header__actions">
              <IconButton className="notification-button" aria-label="알림 확인">
                <img src={notificationIcon} width="20" height="20" alt="" />
              </IconButton>
              <button className="profile-button" type="button" aria-label="프로필 메뉴 열기">
                {userInitial.slice(0, 1).toUpperCase()}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
