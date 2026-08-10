import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { ArtistSelectionPage } from "@/pages/artist-selection-page";
import { ConcertDetailPage } from "@/pages/concert-detail-page";
import { ConcertsPage } from "@/pages/concerts-page";
import { LoginPage } from "@/pages/login-page";
import { MyPage } from "@/pages/my-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { OnboardingPage } from "@/pages/onboarding-page";
import { PlaylistSelectionPage } from "@/pages/playlist-selection-page";
import { PreStudyPlaylistPage } from "@/pages/pre-study-playlist-page";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout headerVariant="public" />}>
        <Route index element={<OnboardingPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route element={<AppLayout headerVariant="authenticated" />}>
        <Route path="onboarding/playlist-selection" element={<PlaylistSelectionPage />} />
        <Route path="onboarding/artists" element={<ArtistSelectionPage />} />
        <Route path="preferences/playlists" element={<Navigate to="/onboarding/playlist-selection" replace />} />
        <Route path="pre-study-playlists" element={<PreStudyPlaylistPage />} />
        <Route path="concerts" element={<ConcertsPage />} />
        <Route path="concerts/:concertId" element={<ConcertDetailPage />} />
        <Route path="mypage" element={<MyPage />} />
      </Route>
      <Route element={<AppLayout headerVariant="public" />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
