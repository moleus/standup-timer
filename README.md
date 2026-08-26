# Daily Standup Timer

A minimal, large-screen friendly web app for running daily standups.

## Features

- `/settings` stores a participant list and timer duration in the current browser.
- `/` shuffles the participants whenever it opens.
- Only one countdown runs at a time; starting another participant pauses the previous one.
- Active rows pulse slowly and timers display minutes, seconds, and centiseconds.
- Countdown digits stay hidden while a participant is speaking and appear on pause.
- Finishing a standup celebrates with confetti and ranks only participants whose timers ran.

## Development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Use `npm test` to build the deployment bundle and run the route-level tests.

## GitHub Pages

The project exports to static files in `dist/client/`. Pushes to `main` deploy that
directory through `.github/workflows/deploy-pages.yml`.

For a project repository, the workflow injects the GitHub Pages base path so
assets and both routes work under `https://<user>.github.io/<repository>/`.
