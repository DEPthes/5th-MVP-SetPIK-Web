import closeIcon from "@/assets/icons/ic_close_white.svg";
import warningIcon from "@/assets/icons/ic_warning.svg";
import "./recently-viewed-delete-modal.css";

interface RecentlyViewedDeleteModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function RecentlyViewedDeleteModal({ onCancel, onConfirm }: RecentlyViewedDeleteModalProps) {
  return (
    <div className="recently-viewed-delete-modal-backdrop">
      <section
        aria-describedby="recently-viewed-delete-description"
        aria-labelledby="recently-viewed-delete-title"
        aria-modal="true"
        className="recently-viewed-delete-modal"
        role="dialog"
      >
        <button
          aria-label="최근 본 공연 삭제 모달 닫기"
          className="recently-viewed-delete-modal__close"
          onClick={onCancel}
          type="button"
        >
          <img src={closeIcon} alt="" />
        </button>

        <div className="recently-viewed-delete-modal__warning">
          <img src={warningIcon} alt="" />
        </div>

        <div className="recently-viewed-delete-modal__copy">
          <h2 id="recently-viewed-delete-title">선택한 공연 열람 기록을 삭제할까요?</h2>
          <p id="recently-viewed-delete-description">
            삭제하면 SetPik의 최근 본 공연 목록에서
            <br />
            더 이상 표시되지 않아요.
          </p>
        </div>

        <div className="recently-viewed-delete-modal__actions">
          <button className="recently-viewed-delete-modal__cancel" onClick={onCancel} type="button">
            취소
          </button>
          <button className="recently-viewed-delete-modal__confirm" onClick={onConfirm} type="button">
            삭제
          </button>
        </div>
      </section>
    </div>
  );
}
