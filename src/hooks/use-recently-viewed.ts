import { createContext, useContext } from "react";

interface RecentlyViewedContextValue {
  recentlyViewedConcertIds: string[];
  addRecentlyViewedConcert: (concertId: string) => void;
  removeRecentlyViewedConcert: (concertId: string) => void;
  clearRecentlyViewedConcerts: () => void;
}

export const RecentlyViewedContext = createContext<RecentlyViewedContextValue | undefined>(undefined);

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}
