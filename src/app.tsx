import { Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { ConcertsPage } from "@/pages/concerts-page";
import { LoginPage } from "@/pages/login-page";
import { MyPage } from "@/pages/my-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { OnboardingPage } from "@/pages/onboarding-page";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout headerVariant="public" />}>
        <Route index element={<OnboardingPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route element={<AppLayout headerVariant="authenticated" />}>
        <Route path="preferences/*" element={<OnboardingPage />} />
        <Route path="concerts" element={<ConcertsPage />} />
        <Route path="mypage" element={<MyPage />} />
      </Route>
      <Route element={<AppLayout headerVariant="public" />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
