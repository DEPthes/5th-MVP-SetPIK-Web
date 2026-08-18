import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "@/app";
import { AuthProvider } from "@/contexts/auth-provider";
import { SavedConcertsProvider } from "@/contexts/saved-concerts-context";
import { RecentlyViewedProvider } from "@/contexts/recently-viewed-context";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SavedConcertsProvider>
          <RecentlyViewedProvider>
            <App />
          </RecentlyViewedProvider>
        </SavedConcertsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
