import { Link } from "react-router-dom";
import { useSavedConcerts } from "@/contexts/saved-concerts-context";
import { useRecentlyViewed } from "@/contexts/recently-viewed-context";
import spotifyIcon from "@/assets/icons/ic_spotify_green.svg";
import heartIcon from "@/assets/icons/ic_heart_pink.svg";
import clockIcon from "@/assets/icons/ic_time_cyan.svg";
import headphonesIcon from "@/assets/icons/ic_headphone_cyan.svg";
import chevronRightIcon from "@/assets/icons/ic_chevron_right.svg";
import userIcon from "@/assets/icons/ic_user.svg";
import "@/styles/my-page.css";

export function MyPage() {
  const { savedConcertIds } = useSavedConcerts();
  const { recentlyViewedConcertIds } = useRecentlyViewed();

  return (
    <section className="my-page page-shell" aria-labelledby="mypage-title">
      <div className="my-page__header">
        <h1 className="text-heading-1" id="mypage-title">
          마이페이지
        </h1>
        <p className="text-body-1 my-page__description">
          SetPik에서 저장한 공연과 예습 플레이리스트, Spotify 연동 정보를 확인할 수 있어요.
        </p>
      </div>

      <div className="my-page__top-grid">
        <div className="my-page__section">
          <div className="my-page__section-heading">
            <h2 className="text-heading-2">기본 정보</h2>
          </div>
          <article className="my-page__card" aria-label="기본 정보">
            <div className="my-page__profile-row">
              <div className="my-page__avatar-group">
                <div className="my-page__avatar-ring">
                  <img src={userIcon} alt="사용자 프로필 아이콘" className="my-page__avatar-icon" />
                </div>
                <div className="my-page__avatar-action">프로필 사진 변경</div>
              </div>
              <div className="my-page__info-list">
                <div className="my-page__info-row">
                  <div className="my-page__label">닉네임</div>
                  <div className="my-page__value">SetPik User</div>
                  <button type="button" className="my-page__small-button">
                    변경
                  </button>
                </div>
                <div className="my-page__info-row">
                  <div className="my-page__label">생년월일</div>
                  <div className="my-page__value" style={{ color: "#4d4d4d" }}>
                    등록된 생년월일이 없습니다.
                  </div>
                  <button type="button" className="my-page__small-button">
                    정보 등록
                  </button>
                </div>
                <div className="my-page__info-row">
                  <div className="my-page__label">연결 계정</div>
                  <div className="my-page__row-actions">
                    <span className="my-page__value">user@google.com</span>
                    <span className="my-page__status-pill">
                      <span className="my-page__status-dot" />
                      연결됨
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="my-page__section">
          <div className="my-page__section-heading">
            <h2 className="text-heading-2">계정 연동 관리</h2>
          </div>
          <article className="my-page__card" aria-label="계정 연동 관리">
            <div className="my-page__account-card">
              <div className="my-page__account-icon">
                <div className="my-page__avatar-ring" style={{ width: 56, height: 56, borderRadius: 16, borderColor: "rgba(29,185,84,0.2)", background: "rgba(29,185,84,0.08)" }}>
                  <img src={spotifyIcon} alt="Spotify 아이콘" className="my-page__avatar-icon" style={{ width: 28, height: 28 }} />
                </div>
              </div>
              <div className="my-page__account-description">
                <div>
                  <div className="my-page__activity-title">
                    <h3 className="text-title-2" style={{ color: "var(--color-white)" }}>
                      Spotify 계정 연결됨
                    </h3>
                    <span className="my-page__status-pill">
                      <span className="my-page__status-dot" />
                      연결됨
                    </span>
                  </div>
                  <p className="my-page__activity-description" style={{ color: "#b3b3b3", fontSize: "0.875rem" }}>
                    현재 Spotify 계정과 정상적으로 연동되어 있어요.
                  </p>
                  <p className="my-page__activity-description" style={{ color: "#4d4d4d", fontSize: "0.875rem" }}>
                    연결된 계정: user@spotify.com
                  </p>
                </div>
                <div className="my-page__account-actions">
                  <button type="button" className="my-page__account-action">연동 상태 확인</button>
                  <button type="button" className="my-page__account-action my-page__account-action--danger">연동 해제</button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <section className="my-page__activity-section" aria-labelledby="activity-title">
        <div className="my-page__activity-heading">
          <div className="my-page__section-heading">
            <h2 className="text-heading-2" id="activity-title">
              활동 내역
            </h2>
          </div>
          <p className="text-body-1 my-page__description">
            SetPik에서 저장하거나 확인한 공연과 플레이리스트 활동을 관리해 보세요.
          </p>
        </div>

        <div className="my-page__activity-grid">
          <Link to="/saved-concerts" className="my-page__activity-card my-page__activity-card--link" aria-label="저장한 관심 공연">
            <div className="my-page__activity-card-content">
              <div className="my-page__activity-icon">
                <img src={heartIcon} alt="하트 아이콘" className="my-page__avatar-icon" style={{ width: 22, height: 22 }} />
              </div>
              <div className="my-page__activity-info">
                <div className="my-page__activity-title">
                  <p className="my-page__activity-title-text" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                    저장한 관심 공연
                  </p>
                  <span className="my-page__activity-tag my-page__activity-tag--pink">{savedConcertIds.size}개</span>
                </div>
                <p className="my-page__activity-description">
                  관심 공연으로 저장한 공연을 한곳에서 확인해 보세요.
                </p>
              </div>
            </div>
            <img src={chevronRightIcon} alt="바로가기" className="my-page__activity-card-end" />
          </Link>

          <Link to="/recently-viewed" className="my-page__activity-card my-page__activity-card--link" aria-label="최근 본 공연">
            <div className="my-page__activity-card-content">
              <div className="my-page__activity-icon">
                <img src={clockIcon} alt="시계 아이콘" className="my-page__avatar-icon" style={{ width: 22, height: 22 }} />
              </div>
              <div className="my-page__activity-info">
                <div className="my-page__activity-title">
                  <p className="my-page__activity-title-text" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                    최근 본 공연
                  </p>
                  <span className="my-page__activity-tag">최근 {recentlyViewedConcertIds.length}개</span>
                </div>
                <p className="my-page__activity-description">
                  최근 확인한 공연을 다시 빠르게 찾아볼 수 있어요.
                </p>
              </div>
            </div>
            <img src={chevronRightIcon} alt="바로가기" className="my-page__activity-card-end" />
          </Link>

          <Link to="/created-playlists" className="my-page__playlist-card my-page__activity-card--link" aria-label="생성한 예습 플레이리스트">
            <div className="my-page__activity-card-content">
              <div className="my-page__activity-icon">
                <img src={headphonesIcon} alt="헤드폰 아이콘" className="my-page__avatar-icon" style={{ width: 22, height: 22 }} />
              </div>
              <div className="my-page__playlist-info">
                <div className="my-page__playlist-title">
                  <p className="my-page__activity-title-text my-page__playlist-title-text">
                    생성한 예습 플레이리스트
                  </p>
                  <span className="my-page__playlist-tag">Spotify에 저장된 플레이리스트 4개</span>
                </div>
                <p className="my-page__playlist-description">
                  공연 라인업을 바탕으로 만든 예습 플레이리스트를 확인해 보세요.
                </p>
              </div>
            </div>
            <img src={chevronRightIcon} alt="바로가기" className="my-page__playlist-end" />
          </Link>
        </div>
      </section>
    </section>
  );
}
