import closeIcon from "@/assets/icons/ic_close_white.svg";
import infoIcon from "@/assets/icons/ic_info_cyan.svg";
import warningIcon from "@/assets/icons/ic_warning.svg";
import "./created-playlist-delete-modal.css";

interface CreatedPlaylistDeleteModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function CreatedPlaylistDeleteModal({ onCancel, onConfirm }: CreatedPlaylistDeleteModalProps) {
  return (
    <div
      className="created-playlist-delete-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        aria-describedby="created-playlist-delete-description"
        aria-labelledby="created-playlist-delete-title"
        aria-modal="true"
        className="created-playlist-delete-modal"
        role="dialog"
      >
        <button
          aria-label="생성한 예습 플레이리스트 삭제 모달 닫기"
          className="created-playlist-delete-modal__close"
          onClick={onCancel}
          type="button"
        >
          <img src={closeIcon} alt="" />
        </button>

        <div className="created-playlist-delete-modal__warning">
          <img src={warningIcon} alt="" />
        </div>

        <div className="created-playlist-delete-modal__copy">
          <h2 id="created-playlist-delete-title">예습 플레이리스트 기록을 삭제할까요?</h2>
          <p id="created-playlist-delete-description">
            삭제하면 SetPik의 생성한 예습 플레이리스트 목록에서
            <br />
            더 이상 표시되지 않아요.
          </p>
        </div>

        <div className="created-playlist-delete-modal__info">
          <img src={infoIcon} alt="" aria-hidden="true" />
          <p>
            Spotify에 저장된 플레이리스트는 Spotify 계정에
            <br />
            그대로 남아 있어요.
          </p>
        </div>

        <p className="created-playlist-delete-modal__notice">기존에 저장한 공연 기록은 유지됩니다.</p>

        <div className="created-playlist-delete-modal__actions">
          <button className="created-playlist-delete-modal__cancel" onClick={onCancel} type="button">
            취소
          </button>
          <button className="created-playlist-delete-modal__confirm" onClick={onConfirm} type="button">
            삭제
          </button>
        </div>
      </section>
    </div>
  );
}
