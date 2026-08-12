import { useMemo, useState } from "react";
import checkIcon from "@/assets/icons/ic_check_white.svg";
import infoIcon from "@/assets/icons/ic_info_pink.svg";
import infoAltIcon from "@/assets/icons/ic_info.svg";
import starIcon from "@/assets/icons/ic_star_cyan.svg";
import spotifyIcon from "@/assets/icons/ic_spotify_white.svg";
import titleSearchIcon from "@/assets/icons/ic_search.svg";
import trashIcon from "@/assets/icons/ic_trash.svg";
import { Button } from "@/components/common/button";
import "@/styles/pre-study-playlist-create.css";

interface Artist {
  id: string;
  initial: string;
  isNew?: boolean;
  isPlaylistArtist?: boolean;
  name: string;
  representativeSong: string;
  tone: "blue" | "cyan" | "purple" | "red" | "yellow";
}

const ARTISTS: Artist[] = [
  { id: "silicagel", initial: "실", isPlaylistArtist: true, name: "실리카겔", representativeSong: "NO PAIN", tone: "purple" },
  { id: "jannabi", initial: "잔", isPlaylistArtist: true, name: "잔나비", representativeSong: "주저하는 연인들을 위해", tone: "blue" },
  { id: "wave-to-earth", initial: "w", isPlaylistArtist: true, name: "wave to earth", representativeSong: "light", tone: "cyan" },
  { id: "hyukoh", initial: "H", name: "HYUKOH", representativeSong: "TOMBOY", tone: "yellow" },
  { id: "leenalchi", initial: "이", isNew: true, name: "이날치", representativeSong: "범 내려온다", tone: "red" },
  { id: "se-so-neon", initial: "새", isNew: true, name: "새소년", representativeSong: "파도", tone: "cyan" },
  { id: "day6", initial: "D", isPlaylistArtist: true, name: "DAY6", representativeSong: "예뻤어", tone: "blue" },
];

const DEFAULT_SELECTED_ARTIST_IDS = new Set(["silicagel", "wave-to-earth", "hyukoh"]);

export function PreStudyPlaylistCreatePage() {
  const [excludedArtistIds, setExcludedArtistIds] = useState<Set<string>>(() => new Set());
  const [excludeKnownSongs, setExcludeKnownSongs] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);
  const [newArtistsOnly, setNewArtistsOnly] = useState(false);
  const [hasTitleFocus, setHasTitleFocus] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [savedToSpotify, setSavedToSpotify] = useState(false);
  const [selectedArtistIds, setSelectedArtistIds] = useState<Set<string>>(() => new Set(DEFAULT_SELECTED_ARTIST_IDS));

  const visibleArtists = useMemo(
    () => ARTISTS.filter((artist) => !excludedArtistIds.has(artist.id)),
    [excludedArtistIds],
  );
  const selectedArtists = visibleArtists.filter((artist) => selectedArtistIds.has(artist.id));
  const allVisibleArtistsSelected = visibleArtists.length > 0 && visibleArtists.every((artist) => selectedArtistIds.has(artist.id));
  const estimatedTrackCount = selectedArtists.length * 6;
  const hasTitleError = hasTitleFocus && !playlistTitle.trim();

  function toggleArtist(id: string) {
    setSelectedArtistIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(id)) nextIds.delete(id);
      else nextIds.add(id);
      return nextIds;
    });
  }

  function toggleAllArtists() {
    setSelectedArtistIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (allVisibleArtistsSelected) visibleArtists.forEach((artist) => nextIds.delete(artist.id));
      else visibleArtists.forEach((artist) => nextIds.add(artist.id));
      return nextIds;
    });
  }

  function toggleNewArtistsOnly() {
    if (newArtistsOnly) {
      setNewArtistsOnly(false);
      return;
    }

    setSelectedArtistIds(new Set(visibleArtists.filter((artist) => artist.isNew).map((artist) => artist.id)));
    setNewArtistsOnly(true);
  }

  function excludeArtist(id: string) {
    setExcludedArtistIds((currentIds) => new Set(currentIds).add(id));
    setSelectedArtistIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(id);
      return nextIds;
    });
  }

  return (
    <section className="pre-study-create" aria-labelledby="pre-study-create-title">
      <div className="pre-study-create__inner">
        <header className="pre-study-create__heading">
          <h1 id="pre-study-create-title">예습 플레이리스트 만들기</h1>
          <p>공연 라인업에서 듣고 싶은 아티스트를 선택하고 Spotify에 저장할 예습 플레이리스트를 만들어 보세요.</p>
        </header>

        <div className="pre-study-create__field">
          <label htmlFor="playlist-title">플레이리스트 제목</label>
          <div className={`pre-study-create__title-input${hasTitleError ? " is-error" : ""}`}>
            <img alt="" src={titleSearchIcon} />
            <input
              aria-describedby={hasTitleError ? "playlist-title-error" : undefined}
              aria-invalid={hasTitleError}
              id="playlist-title"
              onBlur={() => setHasTitleFocus(false)}
              onChange={(event) => setPlaylistTitle(event.target.value)}
              onFocus={() => setHasTitleFocus(true)}
              placeholder="플레이리스트 제목을 입력해 주세요."
              value={playlistTitle}
            />
          </div>
          {hasTitleError ? <p id="playlist-title-error" role="alert">플레이리스트 제목을 입력해 주세요.</p> : null}
        </div>

        <section className="pre-study-create__privacy" aria-labelledby="privacy-title">
          <h2 id="privacy-title">공개 설정</h2>
          <div aria-label="플레이리스트 공개 설정" className={`pre-study-create__segmented${isPrivate ? "" : " is-public"}`} role="radiogroup">
            <button aria-checked={isPrivate} className={isPrivate ? "is-active" : ""} onClick={() => setIsPrivate(true)} role="radio" type="button">비공개</button>
            <button aria-checked={!isPrivate} className={!isPrivate ? "is-active" : ""} onClick={() => setIsPrivate(false)} role="radio" type="button">공개</button>
          </div>
          <p>{isPrivate ? "나만 볼 수 있는 플레이리스트로 저장됩니다." : "Spotify에서 다른 사람도 볼 수 있는 플레이리스트로 저장됩니다."}</p>
        </section>

        <section className="pre-study-create__artist-settings" aria-label="아티스트 선택 설정">
          <button aria-pressed={excludeKnownSongs} className={`pre-study-create__setting-chip${excludeKnownSongs ? " is-active" : ""}`} onClick={() => setExcludeKnownSongs((isExcluded) => !isExcluded)} type="button">
            <span className="pre-study-create__chip-check">{excludeKnownSongs ? <img alt="" src={checkIcon} /> : null}</span>
            이미 아는 곡 제외
            <img alt="이미 아는 곡 제외 안내" src={excludeKnownSongs ? infoIcon : infoAltIcon} />
          </button>
          <button aria-pressed={allVisibleArtistsSelected} className={`pre-study-create__setting-chip${allVisibleArtistsSelected ? " is-active" : ""}`} onClick={toggleAllArtists} type="button">
            <span className="pre-study-create__chip-check">{allVisibleArtistsSelected ? <img alt="" src={checkIcon} /> : null}</span>
            전체 아티스트 선택
          </button>
          <button aria-pressed={newArtistsOnly} className={`pre-study-create__setting-chip${newArtistsOnly ? " is-active" : ""}`} onClick={toggleNewArtistsOnly} type="button">
            <span className="pre-study-create__chip-check">{newArtistsOnly ? <img alt="" src={checkIcon} /> : null}</span>
            새로운 아티스트만 선택
            <img alt="새로운 아티스트만 선택 안내" src={newArtistsOnly ? infoIcon : infoAltIcon} />
          </button>
        </section>

        <div className="pre-study-create__artist-list" aria-label="공연 아티스트 목록">
          {visibleArtists.map((artist) => {
            const isSelected = selectedArtistIds.has(artist.id);
            const knownSongExcluded = excludeKnownSongs && artist.isPlaylistArtist;

            return (
              <article className={`pre-study-create__artist${isSelected ? " is-selected" : ""}`} key={artist.id}>
                <button aria-label={`${artist.name} ${isSelected ? "선택 해제" : "선택"}`} aria-pressed={isSelected} className="pre-study-create__artist-check" onClick={() => toggleArtist(artist.id)} type="button">
                  {isSelected ? <img alt="" src={checkIcon} /> : null}
                </button>
                <span aria-hidden="true" className={`pre-study-create__artist-avatar pre-study-create__artist-avatar--${artist.tone}`}>{artist.initial}</span>
                <div className="pre-study-create__artist-copy">
                  <div>
                    <h3>{artist.name}</h3>
                    {artist.isNew ? <span className="pre-study-create__artist-badge pre-study-create__artist-badge--new"><img alt="" src={starIcon} />새로운 아티스트</span> : null}
                    {artist.isPlaylistArtist ? <span className="pre-study-create__artist-badge">내 플레이리스트</span> : null}
                  </div>
                  <p>대표곡 <span className={knownSongExcluded ? "is-excluded" : ""}>{artist.representativeSong}</span>{knownSongExcluded ? <em>기존 곡 제외됨</em> : null}</p>
                </div>
                <button className="pre-study-create__exclude" onClick={() => excludeArtist(artist.id)} type="button"><img alt="" src={trashIcon} />목록에서 제외</button>
              </article>
            );
          })}
        </div>

        <section className="pre-study-create__summary" aria-live="polite">
          <div>
            <div className="pre-study-create__summary-title">
              <h2>선택된 아티스트 {selectedArtists.length}명</h2>
              <span><img alt="" src={starIcon} />예상 수록곡 {estimatedTrackCount}곡</span>
            </div>
            <p>선택한 아티스트의 곡으로 예습 플레이리스트를 만들어요.</p>
          </div>
          <Button disabled={!playlistTitle.trim() || !selectedArtists.length} leadingIcon={<img alt="" src={spotifyIcon} />} onClick={() => setSavedToSpotify(true)} size="large">
            {savedToSpotify ? "Spotify에 저장됨" : "Spotify에 저장"}
          </Button>
        </section>
      </div>
    </section>
  );
}
