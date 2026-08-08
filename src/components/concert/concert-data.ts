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
export const MOCK_CONCERT: Omit<Concert, "id"> = {
  title: "뷰티풀 민트 라이프 2026",
  category: "페스티벌",
  date: "2026.05.16",
  location: "올림픽공원",
  artists: "DAY6, LUCY, 잔나비 외 4팀",
  playlistArtistCount: 2,
  playlistRelevance: 86,
};

export const ALL_CONCERTS: Concert[] = Array.from({ length: 24 }, (_, index) => ({
  ...MOCK_CONCERT,
  id: `concert-${index + 1}`,
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
