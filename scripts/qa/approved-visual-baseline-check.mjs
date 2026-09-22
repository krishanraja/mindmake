#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
let origin;
const fixtures = [
  ["/prototypes/ai-brain-vnext-r5/", "Mindmake AI Brain in action prototype r5"],
  ["/prototypes/ai-gtm-vnext-r6/", "Mindmake AI GTM route r6"],
];
let server;

const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
const findEphemeralPort = () => new Promise((resolvePort, rejectPort) => {
  const probe = createServer();
  probe.unref();
  probe.once("error", rejectPort);
  probe.listen(0, "127.0.0.1", () => {
    const address = probe.address();
    probe.close((error) => {
      if (error) rejectPort(error);
      else resolvePort(address.port);
    });
  });
});
const inspectServer = async () => {
  for (const [pathname, marker] of fixtures) {
    const response = await fetch(`${origin}${pathname}`);
    if (!response.ok) throw new Error(`${pathname} returned ${response.status}`);
    const html = await response.text();
    if (!html.includes(marker)) throw new Error(`${pathname} is not the governed Mindmake fixture`);
  }
};

const startServer = async () => {
  const port = await findEphemeralPort();
  origin = `http://127.0.0.1:${port}`;
  const viteEntry = resolve(root, "node_modules/vite/bin/vite.js");
  server = spawn(process.execPath, [viteEntry, "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  let diagnostics = "";
  server.stdout.on("data", (chunk) => { diagnostics += chunk.toString(); });
  server.stderr.on("data", (chunk) => { diagnostics += chunk.toString(); });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`local Vite server exited before readiness\n${diagnostics}`);
    try {
      await inspectServer();
      return;
    } catch {
      await delay(125);
    }
  }
  throw new Error(`local Vite server did not become ready at ${origin}\n${diagnostics}`);
};

const runCheck = (relativePath) => new Promise((resolveCheck, rejectCheck) => {
  const child = spawn(process.execPath, [resolve(root, relativePath)], {
    cwd: root,
    env: { ...process.env, MINDMAKE_QA_ORIGIN: origin },
    stdio: "inherit",
    windowsHide: true,
  });
  child.once("error", rejectCheck);
  child.once("exit", (code, signal) => {
    if (code === 0) resolveCheck();
    else rejectCheck(new Error(`${relativePath} failed with ${signal ? `signal ${signal}` : `exit ${code}`}`));
  });
});

try {
  await startServer();
  console.log(`Using script-owned Mindmake server at ${origin}`);
  await runCheck("scripts/qa/ai-brain-prototype-r5-check.mjs");
  await runCheck("scripts/qa/ai-gtm-prototype-r6-check.mjs");
} finally {
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await Promise.race([
      new Promise((resolveExit) => server.once("exit", resolveExit)),
      delay(2000),
    ]);
  }
}
