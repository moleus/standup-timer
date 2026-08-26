import { copyFile, mkdir, rename, rm } from "node:fs/promises";

const clientOutput = new URL("../dist/client/", import.meta.url);
const settingsDirectory = new URL("settings/", clientOutput);
const pagesBasePath = (process.env.PAGES_BASE_PATH ?? "").replace(
  /^\/+|\/+$/g,
  "",
);

if (pagesBasePath) {
  const nestedAssets = new URL(`${pagesBasePath}/_next/`, clientOutput);
  const rootAssets = new URL("_next/", clientOutput);

  await rm(rootAssets, { force: true, recursive: true });
  await rename(nestedAssets, rootAssets);
  await rm(new URL(`${pagesBasePath}/`, clientOutput), {
    force: true,
    recursive: true,
  });
}

await mkdir(settingsDirectory, { recursive: true });
await copyFile(
  new URL("settings.html", clientOutput),
  new URL("index.html", settingsDirectory),
);
