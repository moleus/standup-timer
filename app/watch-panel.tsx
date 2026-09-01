"use client";

import { useSyncExternalStore } from "react";

const WATCH_STORAGE_KEY = "daily-standup:watch:v1";
const WATCH_CHANGE_EVENT = "daily-standup:watch-changed";
const DEFAULT_VIDEO_URL = "https://www.youtube.com/watch?v=zZ7AimPACzc";

function useHasHydrated(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

function extractYouTubeId(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.slice(1).split("/")[0] || null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com"
    ) {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }

      const pathMatch = url.pathname.match(
        /^\/(shorts|embed|live)\/([\w-]{11})/,
      );
      if (pathMatch) {
        return pathMatch[2];
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getWatchSnapshot(): string | null {
  try {
    return window.localStorage.getItem(WATCH_STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribeToWatch(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(WATCH_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(WATCH_CHANGE_EVENT, onStoreChange);
  };
}

function saveWatchUrl(url: string): void {
  window.localStorage.setItem(WATCH_STORAGE_KEY, url);
  window.dispatchEvent(new Event(WATCH_CHANGE_EVENT));
}

export default function WatchPanel() {
  const hasHydrated = useHasHydrated();
  const storedUrl = useSyncExternalStore(
    subscribeToWatch,
    getWatchSnapshot,
    () => null,
  );
  if (!hasHydrated) {
    return <aside className="watch-panel" aria-hidden="true" />;
  }

  const activeUrl = storedUrl ?? DEFAULT_VIDEO_URL;
  const videoId = extractYouTubeId(activeUrl);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextUrl = String(formData.get("videoUrl") ?? "").trim();
    if (nextUrl) {
      saveWatchUrl(nextUrl);
    }
  };

  const handleReset = () => {
    saveWatchUrl(DEFAULT_VIDEO_URL);
  };

  return (
    <aside className="watch-panel" aria-label="Standup background video">
      <div className="watch-frame">
        {videoId ? (
          <iframe
            key={videoId}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0`}
            title="Standup background video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="watch-empty">
            That link doesn&apos;t look like a YouTube video.
          </div>
        )}
      </div>
      <form className="watch-form" key={storedUrl ?? "default"} onSubmit={handleSubmit}>
        <input
          aria-label="YouTube link"
          defaultValue={storedUrl ?? ""}
          inputMode="url"
          name="videoUrl"
          placeholder="Paste a YouTube link"
          type="url"
        />
        <button className="watch-load-button" type="submit">
          Load
        </button>
        <button
          className="watch-reset-button"
          onClick={handleReset}
          type="button"
        >
          Reset
        </button>
      </form>
    </aside>
  );
}
