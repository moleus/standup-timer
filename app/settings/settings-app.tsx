"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";
import {
  DEFAULT_SETTINGS,
  getSettingsSnapshot,
  parseUsers,
  parseSettingsSnapshot,
  saveSettings,
  StandupSettings,
  subscribeToSettings,
} from "@/lib/standup-settings";

const pagesBasePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";
const homePath = `${pagesBasePath}/`;

function SettingsForm({ initialSettings }: { initialSettings: StandupSettings }) {
  const [usersValue, setUsersValue] = useState(
    initialSettings.users.join("\n"),
  );
  const [durationValue, setDurationValue] = useState(
    String(initialSettings.durationMinutes),
  );
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const users = parseUsers(usersValue);
    const durationMinutes = Number(durationValue);

    if (users.length === 0) {
      setError("Add at least one person.");
      return;
    }

    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      setError("Timer duration must be greater than zero.");
      return;
    }

    try {
      saveSettings({ version: 1, users, durationMinutes });
      window.location.assign(homePath);
    } catch {
      setError("Settings could not be saved in this browser.");
    }
  };

  return (
    <main className="settings-shell">
      <header className="settings-header">
        <div>
          <p className="eyebrow">Daily standup</p>
          <h1>Settings</h1>
        </div>
        <a className="settings-link" href={homePath}>
          Back to standup
        </a>
      </header>

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <label className="field-group" htmlFor="users">
          <span className="field-heading">Users</span>
          <span className="field-hint">One person per line</span>
          <textarea
            id="users"
            onChange={(event) => {
              setUsersValue(event.target.value);
              setError("");
            }}
            placeholder={"Alex Morgan\nSam Rivera\nJordan Lee"}
            rows={8}
            value={usersValue}
          />
        </label>

        <label className="field-group" htmlFor="timer-duration">
          <span className="field-heading">Timer duration</span>
          <span className="field-hint">Minutes per person</span>
          <div className="duration-input-wrap">
            <input
              id="timer-duration"
              inputMode="decimal"
              min="0.01"
              onChange={(event) => {
                setDurationValue(event.target.value);
                setError("");
              }}
              step="any"
              type="number"
              value={durationValue}
            />
            <span aria-hidden="true">min</span>
          </div>
        </label>

        <div className="form-footer">
          <p className="form-error" role="alert">
            {error}
          </p>
          <button className="save-button" type="submit">
            Save settings
          </button>
        </div>
      </form>
    </main>
  );
}

export default function SettingsApp() {
  const hasHydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const settingsSnapshot = useSyncExternalStore(
    subscribeToSettings,
    getSettingsSnapshot,
    () => null,
  );
  const savedSettings = parseSettingsSnapshot(settingsSnapshot);
  const initialSettings =
    hasHydrated && savedSettings ? savedSettings : DEFAULT_SETTINGS;
  const formKey = hasHydrated
    ? (settingsSnapshot ?? "browser-default")
    : "server-default";

  return <SettingsForm initialSettings={initialSettings} key={formKey} />;
}
