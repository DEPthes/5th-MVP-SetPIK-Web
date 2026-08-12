import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getStorageItem, setStorageItem } from "@/utils/storage";

const STORAGE_KEY = "savedConcertIds";

interface SavedConcertsContextValue {
  savedConcertIds: Set<string>;
  toggleSavedConcert: (concertId: string) => void;
}

const SavedConcertsContext = createContext<SavedConcertsContextValue | undefined>(undefined);

function loadSavedConcertIds() {
  const saved = getStorageItem<string[]>(STORAGE_KEY, []);
  return new Set(saved);
}

export function SavedConcertsProvider({ children }: { children: ReactNode }) {
  const [savedConcertIds, setSavedConcertIds] = useState<Set<string>>(loadSavedConcertIds);

  useEffect(() => {
    setStorageItem(STORAGE_KEY, Array.from(savedConcertIds));
  }, [savedConcertIds]);

  const toggleSavedConcert = useCallback((concertId: string) => {
    setSavedConcertIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(concertId)) nextIds.delete(concertId);
      else nextIds.add(concertId);
      return nextIds;
    });
  }, []);

  const value = useMemo(
    () => ({ savedConcertIds, toggleSavedConcert }),
    [savedConcertIds, toggleSavedConcert],
  );

  return <SavedConcertsContext.Provider value={value}>{children}</SavedConcertsContext.Provider>;
}

export function useSavedConcerts() {
  const context = useContext(SavedConcertsContext);
  if (!context) {
    throw new Error("useSavedConcerts must be used within a SavedConcertsProvider");
  }
  return context;
}
