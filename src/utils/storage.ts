const STORAGE_NAMESPACE = "setpik:v1";

function getStorageKey(key: string) {
  return `${STORAGE_NAMESPACE}:${key}`;
}

export function getStorageItem<T>(key: string, fallback: T): T {
  const storedValue = localStorage.getItem(getStorageKey(key));

  if (storedValue === null) {
    return fallback;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T) {
  localStorage.setItem(getStorageKey(key), JSON.stringify(value));
}

export function removeStorageItem(key: string) {
  localStorage.removeItem(getStorageKey(key));
}
