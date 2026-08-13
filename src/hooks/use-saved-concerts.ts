import { createContext, useContext } from "react";

interface SavedConcertsContextValue {
  savedConcertIds: Set<string>;
  toggleSavedConcert: (concertId: string) => void;
}

export const SavedConcertsContext = createContext<SavedConcertsContextValue | undefined>(undefined);

export function useSavedConcerts() {
  const context = useContext(SavedConcertsContext);
  if (!context) {
    throw new Error("useSavedConcerts must be used within a SavedConcertsProvider");
  }
  return context;
}
