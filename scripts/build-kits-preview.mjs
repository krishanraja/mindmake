import { spawnSync } from "node:child_process";
if (!process.env.npm_execpath) throw new Error("Run through npm run build:parts-preview");
if (process.env.VERCEL_ENV === "production") throw new Error("A production environment cannot build a parts preview");
const result = spawnSync(process.execPath, [process.env.npm_execpath, "run", "build"], {
  stdio: "inherit", windowsHide: true, env: { ...process.env, KITS_PREVIEW_BUILD: "1" },
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
