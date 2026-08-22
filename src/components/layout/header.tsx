import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-user-profile";
import { requestLogout } from "@/services/auth-logout";
import setPikLogo from "@/assets/icons/ic_setpik_logo.svg";
import logoutIcon from "@/assets/icons/ic_logout.svg";
import spotifyIcon from "@/assets/icons/ic_spotify_white.svg";
import userIcon from "@/assets/icons/ic_user.svg";
import "./header.css";

interface HeaderProps {
  variant: "public" | "authenticated";
}

function getNavigationClassName(isActive: boolean) {
  return `site-nav__link${isActive ? " site-nav__link--active" : ""}`;
}

export function Header({ variant }: HeaderProps) {
  const { pathname } = useLocation();
  const { isOnboardingComplete, logout } = useAuth();
  const { profile } = useUserProfile();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const isConcertsPage = pathname.startsWith("/concerts");
  const isPreStudyPlaylistPage = pathname.startsWith("/pre-study-playlists");
  const isMyPage = pathname.startsWith("/mypage")
    || pathname.startsWith("/saved-concerts")
    || pathname.startsWith("/recently-viewed")
    || pathname.startsWith("/created-playlists");
  const isOnboardingSelectionPage = pathname === "/onboarding/playlist-selection"
    || pathname === "/onboarding/artists"
    || pathname === "/preferences/playlists";

  useEffect(() => {
    if (!isProfileMenuOpen) return undefined;

    function handleDocumentPointerDown(event: PointerEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    }

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [isProfileMenuOpen]);

  async function handleLogout() {
    setIsProfileMenuOpen(false);

    try {
      await requestLogout();
    } finally {
      // 서버 통신이 끊겨도 이 기기의 로그인 화면은 즉시 정리한다.
      logout();
    }
  }

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

            <div className="site-header__actions" ref={profileMenuRef}>
              <button
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="menu"
                className="profile-button"
                onClick={() => setIsProfileMenuOpen((current) => !current)}
                type="button"
                aria-label="프로필 메뉴 열기"
              >
                <img
                  src={profile.profileImage ?? userIcon}
                  alt=""
                  aria-hidden="true"
                  className={profile.profileImage ? "profile-button__image--uploaded" : ""}
                />
              </button>
              {isProfileMenuOpen ? (
                <div className="profile-dropdown" role="menu" aria-label="프로필 메뉴">
                  <div className="profile-dropdown__user">
                    <div className="profile-dropdown__avatar">
                      <img
                        src={profile.profileImage ?? userIcon}
                        alt=""
                        aria-hidden="true"
                        className={profile.profileImage ? "profile-dropdown__image--uploaded" : ""}
                      />
                    </div>
                    <div className="profile-dropdown__user-info">
                      <strong>{profile.nickname}</strong>
                      <span>{profile.accountEmail}</span>
                    </div>
                  </div>
                  <div className="profile-dropdown__divider" />
                  <button className="profile-dropdown__logout" onClick={handleLogout} role="menuitem" type="button">
                    <img src={logoutIcon} alt="" aria-hidden="true" />
                    <span>로그아웃</span>
                  </button>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
