import { useNavigate } from "react-router-dom";
import disconnectedIcon from "@/assets/icons/ic_disconnected.svg";
import refreshIcon from "@/assets/icons/ic_reload.svg";
import { Button } from "@/components/common/button";
import { StatusState } from "@/components/common/status-state";
import { ConcertCardSkeleton } from "./concert-card";

export function ConcertLoadingState() {
  return (
    <section className="concert-home concert-home--loading" aria-labelledby="concert-home-loading-title" aria-live="polite">
      <div className="concert-home__inner concert-home__loading-inner">
        <div className="concert-home__loading-heading">
          <h1 className="sr-only" id="concert-home-loading-title">추천 공연을 찾는 중</h1>
          <span className="skeleton-reflection" />
          <i className="skeleton-reflection" />
        </div>
        <p className="concert-home__loading-message">
          추천 공연을 찾고 있어요.
          <span>플레이리스트와 아티스트 정보를 분석하는 중입니다.</span>
        </p>
        <div className="concert-home__loading-grid">
          {Array.from({ length: 8 }, (_, index) => <ConcertCardSkeleton key={index} />)}
        </div>
      </div>
    </section>
  );
}

export function ConcertErrorState() {
  const navigate = useNavigate();

  return (
    <section className="concert-home concert-home--error" aria-labelledby="concert-home-error-title" aria-live="assertive">
      <StatusState
        action={
          <Button
            className="concert-home__error-retry"
            leadingIcon={<img src={refreshIcon} alt="" />}
            onClick={() => navigate("/concerts?state=loading")}
            variant="neutral"
          >
            다시 시도
          </Button>
        }
        description="잠시 후 다시 시도해 주세요."
        icon={disconnectedIcon}
        title="공연 정보를 불러오지 못했어요."
        titleId="concert-home-error-title"
      />
    </section>
  );
}
