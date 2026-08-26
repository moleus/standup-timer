export const SETTINGS_STORAGE_KEY = "daily-standup:settings:v1";
const SETTINGS_CHANGE_EVENT = "daily-standup:settings-changed";

export type StandupSettings = {
  version: 1;
  users: string[];
  durationMinutes: number;
};

export const DEFAULT_SETTINGS: StandupSettings = {
  version: 1,
  users: [],
  durationMinutes: 2,
};

export function parseUsers(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
}

export function normalizeSettings(value: unknown): StandupSettings | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<StandupSettings>;
  if (
    candidate.version !== 1 ||
    !Array.isArray(candidate.users) ||
    typeof candidate.durationMinutes !== "number" ||
    !Number.isFinite(candidate.durationMinutes) ||
    candidate.durationMinutes <= 0
  ) {
    return null;
  }

  const users = candidate.users
    .filter((name): name is string => typeof name === "string")
    .map((name) => name.trim())
    .filter(Boolean);

  if (users.length === 0) {
    return null;
  }

  return {
    version: 1,
    users,
    durationMinutes: candidate.durationMinutes,
  };
}

export function getSettingsSnapshot(): string | null {
  try {
    return window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function parseSettingsSnapshot(
  rawValue: string | null,
): StandupSettings | null {
  if (!rawValue) {
    return null;
  }

  try {
    return normalizeSettings(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

export function subscribeToSettings(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SETTINGS_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SETTINGS_CHANGE_EVENT, onStoreChange);
  };
}

export function saveSettings(settings: StandupSettings): void {
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
}

export function durationToMilliseconds(durationMinutes: number): number {
  return Math.round(durationMinutes * 60_000);
}
