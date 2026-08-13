import musicIcon from "@/assets/icons/ic_music1.svg";
import playIcon from "@/assets/icons/ic_play.svg";
import timeIcon from "@/assets/icons/ic_time_gray.svg";
import "./playlist-track-table.css";

export interface PlaylistTrackTableItem {
  id?: string;
  title: string;
  artist: string;
  album: string;
  addedAt: string;
  duration: string;
  coverUrl?: string;
}

interface PlaylistTrackTableProps {
  tracks: PlaylistTrackTableItem[];
  showPreviewButton?: boolean;
  coverBackgrounds?: string[];
}

export function PlaylistTrackTable({ tracks, showPreviewButton = false, coverBackgrounds = [] }: PlaylistTrackTableProps) {
  return (
    <div className={`playlist-track-table-shared${showPreviewButton ? " playlist-track-table-shared--with-preview" : ""}`} role="table" aria-label="수록곡">
      <div className="playlist-track-table-shared__header" role="row">
        <span role="columnheader">#</span>
        <span aria-hidden="true" />
        <span role="columnheader">제목</span>
        <span role="columnheader">앨범</span>
        <span role="columnheader">추가된 날짜</span>
        <span role="columnheader">
          <img src={timeIcon} alt="재생 시간" />
        </span>
        {showPreviewButton ? <span aria-hidden="true" /> : null}
      </div>
      <ol className="playlist-track-table-shared__body">
        {tracks.map((track, index) => {
          const coverStyle = track.coverUrl
            ? { backgroundImage: `url(${track.coverUrl})` }
            : coverBackgrounds.length
              ? { backgroundImage: coverBackgrounds[index % coverBackgrounds.length] }
              : undefined;

          return (
            <li key={track.id ?? `${track.title}-${index}`} role="row">
              <span className="playlist-track-table-shared__index" role="cell">{index + 1}</span>
              <span className="playlist-track-table-shared__cover" style={coverStyle} role="cell">
                <img src={musicIcon} alt="" />
              </span>
              <span className="playlist-track-table-shared__title" role="cell">
                <strong>{track.title}</strong>
                <small>{track.artist}</small>
              </span>
              <span className="playlist-track-table-shared__album" role="cell">{track.album}</span>
              <span role="cell">{track.addedAt}</span>
              <span role="cell">{track.duration}</span>
              {showPreviewButton ? (
                <button className="playlist-track-table-shared__preview" type="button">
                  <img src={playIcon} alt="" />
                  미리듣기
                </button>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
