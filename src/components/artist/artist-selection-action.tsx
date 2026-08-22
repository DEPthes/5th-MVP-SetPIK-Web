import arrowRightIcon from "@/assets/icons/ic_arrow_right.svg";
import { Button } from "@/components/common/button";

interface ArtistSelectionActionProps {
  isSaving: boolean;
  onComplete: () => void;
  saveError: string | null;
  selectedArtistCount: number;
}

export function ArtistSelectionAction({
  isSaving,
  onComplete,
  saveError,
  selectedArtistCount,
}: ArtistSelectionActionProps) {

  return (
    <div
      className={`artist-selection__footer-action${selectedArtistCount ? " artist-selection__footer-action--selected" : ""}`}
    >
      <div>
        <strong>선택한 아티스트 <em>{selectedArtistCount}명</em></strong>
        <p>
          {selectedArtistCount
            ? "선택한 아티스트의 공연 정보를 찾을 준비가 되었어요."
            : "공연 추천을 받으려면 최소 1명을 선택해 주세요."}
        </p>
        {saveError ? <p className="artist-selection__save-error" role="alert">{saveError}</p> : null}
      </div>
      <Button
        className="artist-selection__next-button button--selection-cta"
        disabled={!selectedArtistCount || isSaving}
        onClick={onComplete}
        trailingIcon={<img src={arrowRightIcon} alt="" />}
      >
        {isSaving ? "선택 저장 중" : "선택한 아티스트로 공연 찾기"}
      </Button>
    </div>
  );
}
