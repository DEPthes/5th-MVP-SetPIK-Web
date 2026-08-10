import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ALL_CONCERTS } from "@/components/concert/concert-data";
import { getStorageItem, setStorageItem } from "@/utils/storage";

const STORAGE_KEY = "recentlyViewedConcertIds";

interface RecentlyViewedContextValue {
  recentlyViewedConcertIds: string[];
  addRecentlyViewedConcert: (concertId: string) => void;
  removeRecentlyViewedConcert: (concertId: string) => void;
  clearRecentlyViewedConcerts: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | undefined>(undefined);

function loadRecentlyViewedConcertIds() {
  const stored = getStorageItem<string[]>(STORAGE_KEY, []);
  if (stored.length > 0) {
    return stored;
  }

  return ALL_CONCERTS.slice(0, 8).map((concert) => concert.id);
}

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewedConcertIds, setRecentlyViewedConcertIds] = useState<string[]>(loadRecentlyViewedConcertIds);

  useEffect(() => {
    setStorageItem(STORAGE_KEY, recentlyViewedConcertIds);
  }, [recentlyViewedConcertIds]);

  const addRecentlyViewedConcert = useCallback((concertId: string) => {
    setRecentlyViewedConcertIds((currentIds) => [concertId, ...currentIds.filter((id) => id !== concertId)]);
  }, []);

  const removeRecentlyViewedConcert = useCallback((concertId: string) => {
    setRecentlyViewedConcertIds((currentIds) => currentIds.filter((id) => id !== concertId));
  }, []);

  const clearRecentlyViewedConcerts = useCallback(() => {
    setRecentlyViewedConcertIds([]);
  }, []);

  const value = useMemo(
    () => ({ recentlyViewedConcertIds, addRecentlyViewedConcert, removeRecentlyViewedConcert, clearRecentlyViewedConcerts }),
    [recentlyViewedConcertIds, addRecentlyViewedConcert, removeRecentlyViewedConcert, clearRecentlyViewedConcerts],
  );

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>;
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}
