#!/usr/bin/env node
/**
 * Construct .vercel/output/ (Vercel Build Output API v3) from the Vite build
 * output. Runs after `vite build`.
 *
 * Layout produced:
 *   .vercel/output/
 *     config.json                        — routing manifest
 *     static/                            — public files served at the edge
 *       <every file from dist/client>
 *     functions/
 *       _ssr.func/                       — Node serverless function
 *         .vc-config.json                — function manifest
 *         index.mjs                      — wrapper that re-exports default
 *         server.mjs                     — TanStack Start SSR entry
 *         assets/                        — SSR chunks
 *
 * Vercel routes static assets first; anything not found goes to the SSR
 * function, which TanStack Start handles via its own router.
 */
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC_CLIENT = join(ROOT, "dist", "client");
const SRC_SERVER = join(ROOT, "dist", "server");
const OUT = join(ROOT, ".vercel", "output");
const OUT_STATIC = join(OUT, "static");
const OUT_FUNC = join(OUT, "functions", "_ssr.func");

if (!existsSync(SRC_CLIENT) || !existsSync(SRC_SERVER)) {
  console.error("dist/client or dist/server missing — run `vite build` first.");
  process.exit(1);
}

console.log("→ Building Vercel output…");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
mkdirSync(OUT_STATIC, { recursive: true });
mkdirSync(OUT_FUNC, { recursive: true });

async function copyTree(srcDir, destDir) {
  for (const entry of readdirSync(srcDir)) {
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, entry);
    const st = statSync(srcPath);
    if (st.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      await copyTree(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

// Static assets: everything in dist/client → .vercel/output/static/
await copyTree(SRC_CLIENT, OUT_STATIC);
console.log(`  ✓ static: copied ${countFiles(OUT_STATIC)} files from dist/client`);

// SSR function: copy dist/server/* into the function bundle.
await copyTree(SRC_SERVER, OUT_FUNC);

// The Vercel Node runtime expects index.mjs to default-export a Web Fetch
// handler function: (req: Request) => Promise<Response>. TanStack Start's
// build output default-exports `{ fetch: handler }` (the createServerEntry
// shape), so we unwrap `.fetch` here.
await writeFile(
  join(OUT_FUNC, "index.mjs"),
  `import server from "./server.js";
const fetchHandler = server?.fetch ?? server;
if (typeof fetchHandler !== "function") {
  throw new Error("SSR entry did not export a fetch handler — got: " + typeof fetchHandler);
}
export default fetchHandler;
`,
  "utf8",
);

// Drop a package.json with "type": "module" inside the function dir so Node
// treats server.js (and any other .js files in the bundle) as ESM. Without
// this, Vercel's Node runtime falls back to CommonJS resolution and barfs
// on the `import { AsyncLocalStorage } from "node:async_hooks"` at line 1
// of server.js — "Cannot use import statement outside a module".
await writeFile(
  join(OUT_FUNC, "package.json"),
  JSON.stringify({ type: "module" }, null, 2),
  "utf8",
);

// .vc-config.json tells Vercel how to invoke the function.
await writeFile(
  join(OUT_FUNC, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs22.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      // The bundled server uses Web Fetch API; Vercel's Node launcher will
      // wrap it as a request handler.
      shouldAddHelpers: false,
      shouldAddSourcemapSupport: false,
      supportsResponseStreaming: true,
    },
    null,
    2,
  ),
  "utf8",
);
console.log(`  ✓ function: bundled ${countFiles(OUT_FUNC)} files into _ssr.func/`);

// Static asset filenames we want Vercel to serve directly (so they don't hit
// the SSR function). We build a regex matching everything under /assets/ and
// any common public file extension.
const config = {
  version: 3,
  routes: [
    // 1. Static assets get served from .vercel/output/static/
    { handle: "filesystem" },
    // 2. Anything else falls through to the SSR function.
    { src: "/.*", dest: "/_ssr" },
  ],
};
await writeFile(
  join(OUT, "config.json"),
  JSON.stringify(config, null, 2),
  "utf8",
);

console.log(`✓ .vercel/output ready at ${relative(ROOT, OUT)}`);

function countFiles(dir) {
  let n = 0;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) n += countFiles(p);
    else n += 1;
  }
  return n;
}

// silence unused-var warning
void dirname;
