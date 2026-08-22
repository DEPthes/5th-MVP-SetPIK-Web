import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { ArtistSelectionPage } from "@/pages/artist-selection-page";
import { ConcertDetailPage } from "@/pages/concert-detail-page";
import { ConcertsPage } from "@/pages/concerts-page";
import { CreatedPlaylistsPage } from "@/pages/created-playlists-page";
import { LoginPage } from "@/pages/login-page";
import { MyPage } from "@/pages/my-page";
import { OnboardingPage } from "@/pages/onboarding-page";
import { OAuthCallbackPage } from "@/pages/oauth-callback-page";
import { PlaylistSelectionPage } from "@/pages/playlist-selection-page";
import { PreStudyPlaylistPage } from "@/pages/pre-study-playlist-page";
import { PreStudyPlaylistCreatePage } from "@/pages/pre-study-playlist-create-page";
import { SavedConcertsPage } from "@/pages/saved-concerts-page";
import { RecentlyViewedPage } from "@/pages/recently-viewed-page";
import {
  ArtistSelectionAccessRoute,
  AuthenticatedAccessRoute,
  PublicAccessRoute,
  RouteFallback,
  SelectionAccessRoute,
} from "@/routes/route-guards";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout headerVariant="public" />}>
        <Route element={<PublicAccessRoute />}>
          <Route index element={<OnboardingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="oauth/success" element={<OAuthCallbackPage outcome="success" />} />
          <Route path="oauth/failure" element={<OAuthCallbackPage outcome="failure" />} />
        </Route>
      </Route>
      <Route element={<AppLayout headerVariant="authenticated" />}>
        <Route element={<SelectionAccessRoute />}>
          <Route path="onboarding/playlist-selection" element={<PlaylistSelectionPage />} />
          <Route element={<ArtistSelectionAccessRoute />}>
            <Route path="onboarding/artists" element={<ArtistSelectionPage />} />
          </Route>
          <Route path="preferences/playlists" element={<Navigate to="/onboarding/playlist-selection" replace />} />
        </Route>
        <Route element={<AuthenticatedAccessRoute />}>
          <Route path="pre-study-playlists" element={<PreStudyPlaylistPage />} />
          <Route path="pre-study-playlists/create" element={<PreStudyPlaylistCreatePage />} />
          <Route path="created-playlists" element={<CreatedPlaylistsPage />} />
          <Route path="concerts" element={<ConcertsPage />} />
          <Route path="concerts/:concertId" element={<ConcertDetailPage />} />
          <Route path="saved-concerts" element={<SavedConcertsPage />} />
          <Route path="recently-viewed" element={<RecentlyViewedPage />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>
      </Route>
      <Route path="*" element={<RouteFallback />} />
    </Routes>
  );
}
