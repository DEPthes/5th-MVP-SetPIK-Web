import analysisCyanIcon from "@/assets/icons/ic_analysis_cyan.svg";
import analysisIcon from "@/assets/icons/ic_analysis_pink.svg";
import aiCyanIcon from "@/assets/icons/ic_shine_cyan.svg";
import aiIcon from "@/assets/icons/ic_shine_pink.svg";
import noteCyanIcon from "@/assets/icons/ic_music2_cyan.svg";
import noteIcon from "@/assets/icons/ic_music2_pink.svg";
import ticketIcon from "@/assets/icons/ic_ticket_pink.svg";
import coldplayImage from "@/assets/images/onboarding-mock-coldplay.png";

export const ONBOARDING_BENEFITS = ["Spotify 플레이리스트 분석", "맞춤 공연 추천", "공연 예습 플레이리스트 생성"];

export const ONBOARDING_STEPS = [
  {
    title: "Spotify 계정 연결",
    description: "Spotify 계정을 연결하여\n플레이리스트에 접근합니다.",
    icon: noteIcon,
  },
  {
    title: "플레이리스트 분석",
    description: "장르, 아티스트, 트랙 패턴을\n심층 분석합니다.",
    icon: analysisIcon,
  },
  {
    title: "취향 분석",
    description: "음악 취향을 학습하고\n프로파일을 구성합니다.",
    icon: aiIcon,
  },
  {
    title: "맞춤 공연 추천",
    description: "취향에 맞는 공연을 추천하고 예\n습 플레이리스트를 생성합니다.",
    icon: ticketIcon,
  },
];

export const ONBOARDING_FEATURES = [
  {
    label: "플레이리스트 분석",
    title: "Spotify 플레이리스트 분석",
    description: "Spotify 플레이리스트의 장르와 아티스트를 분석하여\n사용자의 음악 취향을 정밀하게 파악합니다.",
    icon: analysisCyanIcon,
  },
  {
    label: "공연 추천",
    title: "공연 추천",
    description: "음악 취향과 유사한 공연과 아티스트를\n정확하게 추천합니다.",
    icon: aiCyanIcon,
  },
  {
    label: "공연 예습 플레이리스트",
    title: "예습 플리 생성",
    description: "추천된 공연을 더욱 즐길 수 있도록\n예습 플레이리스트를 자동 생성합니다.",
    icon: noteCyanIcon,
  },
];

const CONCERT_MOCK = { artist: "Coldplay", location: "Seoul", match: "98% Match", image: coldplayImage };
export const ONBOARDING_CONCERTS = Array.from({ length: 3 }, () => CONCERT_MOCK);
