import { copyFile, mkdir } from "node:fs/promises";

const clientOutput = new URL("../dist/client/", import.meta.url);
const settingsDirectory = new URL("settings/", clientOutput);

await mkdir(settingsDirectory, { recursive: true });
await copyFile(
  new URL("settings.html", clientOutput),
  new URL("index.html", settingsDirectory),
);
