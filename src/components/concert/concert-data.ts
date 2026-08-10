export type ConcertSort = "recommendation" | "date" | "recent" | "artist" | "saved";
export type PaymentFilter = "all" | "free" | "paid";

export interface Concert {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  artists: string;
  playlistArtistCount: number;
  playlistRelevance: number;
}

export interface ConcertFilterState {
  selectedDate: string | null;
  selectedRegions: string[];
  selectedTypes: string[];
  paymentFilter: PaymentFilter;
  onlySelectedArtists: boolean;
}

export const INITIAL_CONCERT_COUNT = 8;
export const CONCERT_BATCH_SIZE = 8;

// API 연동 전에는 한 가지 형태만 유지한다. API 응답 매퍼가 이 Concert 타입을 만들게 된다.
const CONCERT_TITLES = [
  "뷰티풀 민트 라이프 2026",
  "서울 재즈 페스티벌",
  "월드 EDM 나이트",
  "인천 K-POP 콘서트",
  "부산 록 페스티벌",
  "광주 클래식 인 더 파크",
  "대구 인디뮤직 쇼케이스",
  "제주 어쿠스틱 나이트",
  "춘천 힙합 서바이벌",
  "대전 일렉트로닉 파티",
  "수원 뮤지컬 갈라",
  "전주 판타지 콘서트",
  "울산 퓨전 국악 밤",
  "창원 소울 콘서트",
  "성남 팝 스타 라이브",
  "안양 R&B 나이트",
  "청주 뉴웨이브 페스티벌",
  "포항 블루스 데이",
  "평택 인디 록 쇼",
  "김해 퓨처 사운드",
  "광양 일렉트로니카",
  "여수 스테이지 댄스",
  "남양주 오케스트라 콘서트",
  "구미 팀버 축제",
  "속초 시티팝 나이트",
];

const CONCERT_LOCATIONS = [
  "올림픽공원",
  "서울월드컵경기장",
  "잠실실내체육관",
  "인천송도컨벤시아",
  "부산아시아드주경기장",
  "광주문화예술회관",
  "대구스타디움",
  "제주국제컨벤션센터",
  "춘천송암스포츠타운",
  "대전컨벤션센터",
  "수원월드컵경기장",
  "전주종합경기장",
  "울산문수경기장",
  "창원체육관",
  "성남탄천종합운동장",
  "안양실내체육관",
  "청주체육관",
  "포항실내체육관",
  "평택체육관",
  "김해문화의전당",
  "광양문화예술회관",
  "여수엑스포컨벤션센터",
  "남양주체육관",
  "구미스포츠센터",
];

const CONCERT_ARTISTS = [
  "DAY6, LUCY, 잔나비 외 4팀",
  "BTS, 아이유, 블랙핑크",
  "ZEA, EXO, NCT",
  "에일리, 헤이즈, 백현",
  "혁오, 잔나비, 넬",
  "첼로콰르텟, 바이올린 솔로",
  "인디밴드 10팀",
  "어쿠스틱 듀오, 싱어송라이터",
  "창모, 빈지노, 박재범",
  "NCT DREAM, 세븐틴",
  "뮤지컬 배우 15인",
  "아이들, (여자)아이들",
  "국악 앙상블, 판소리 가수",
  "소울 싱어 8인",
  "팝 아티스트 12인",
  "R&B 듀오 6팀",
  "뉴웨이브 밴드 10팀",
  "블루스 기타리스트 5인",
  "록 밴드 7팀",
  "퓨처 베이스 프로듀서 4인",
  "일렉트로닉 DJ 3팀",
  "댄스 크루 5팀",
  "오케스트라&솔리스트",
  "어쿠스틱 밴드 6팀",
];

const CONCERT_DATES = [
  "2026.05.16",
  "2026.05.22",
  "2026.06.03",
  "2026.06.10",
  "2026.06.18",
  "2026.06.25",
  "2026.07.02",
  "2026.07.09",
  "2026.07.15",
  "2026.07.22",
  "2026.07.29",
  "2026.08.05",
  "2026.08.12",
  "2026.08.19",
  "2026.08.26",
  "2026.09.02",
  "2026.09.09",
  "2026.09.16",
  "2026.09.23",
  "2026.09.30",
  "2026.10.07",
  "2026.10.14",
  "2026.10.21",
  "2026.10.28",
];

const PLAYLIST_ARTIST_COUNTS = [
  2, 3, 4, 5, 1, 2, 3, 6, 4, 5, 2, 3, 1, 2, 5, 4, 3, 2, 4, 1, 5, 3, 2, 4,
];

export const ALL_CONCERTS: Concert[] = Array.from({ length: 24 }, (_, index) => ({
  id: `concert-${index + 1}`,
  title: CONCERT_TITLES[index],
  category: "페스티벌",
  date: CONCERT_DATES[index],
  location: CONCERT_LOCATIONS[index],
  artists: CONCERT_ARTISTS[index],
  playlistArtistCount: PLAYLIST_ARTIST_COUNTS[index],
  playlistRelevance: 80 + (index % 20),
}));

export const SORT_OPTIONS: Array<{ value: ConcertSort; label: string }> = [
  { value: "recommendation", label: "관련도 높은 순" },
  { value: "date", label: "날짜 가까운 순" },
  { value: "recent", label: "최신 등록순" },
  { value: "artist", label: "아티스트 이름순" },
  { value: "saved", label: "관심 등록순" },
];

export const DATE_FILTER_OPTIONS = ["오늘", "이번 주", "이번 달", "기간 선택"];
export const REGION_FILTER_OPTIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "전국"];
export const CONCERT_TYPE_FILTER_OPTIONS = ["단독 공연", "합동 공연", "페스티벌", "콘서트", "클럽 공연"];

export const EMPTY_CONCERT_FILTERS: ConcertFilterState = {
  selectedDate: null,
  selectedRegions: [],
  selectedTypes: [],
  paymentFilter: "all",
  onlySelectedArtists: false,
};

export function getActiveFilterCount(filters: ConcertFilterState) {
  return Number(filters.selectedDate !== null)
    + filters.selectedRegions.length
    + filters.selectedTypes.length
    + Number(filters.paymentFilter !== "all")
    + Number(filters.onlySelectedArtists);
}
