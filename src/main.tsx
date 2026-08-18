import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "@/app";
import { AuthProvider } from "@/contexts/auth-provider";
import { SavedConcertsProvider } from "@/contexts/saved-concerts-context";
import { RecentlyViewedProvider } from "@/contexts/recently-viewed-context";
import { UserProfileProvider } from "@/contexts/user-profile-provider";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProfileProvider>
          <SavedConcertsProvider>
            <RecentlyViewedProvider>
              <App />
            </RecentlyViewedProvider>
          </SavedConcertsProvider>
        </UserProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
