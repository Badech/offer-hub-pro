import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Vercel-targeted TanStack Start config.
// Deploys via @tanstack/react-start's built-in Vercel adapter when VERCEL=1 is set in the build env,
// otherwise produces a generic Node SSR output that vercel.json can serve via a Node function.
export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
  // Vercel's Node serverless runtime doesn't ship our node_modules with the
  // function bundle (we don't include them in scripts/build-vercel-output.mjs
  // either — that would balloon the function size). So we bundle every
  // dependency INTO server.js for the SSR environment, leaving only Node
  // built-ins (node:async_hooks, node:crypto, etc.) as externals.
  //
  // Also: preserveEntrySignatures: 'strict' keeps the SSR entry's `default`
  // export alive. Without it, Vite's tree-shaker drops `default` because
  // nothing INSIDE the bundle imports it (the Vercel function wrapper at
  // .vercel/output/functions/_ssr.func/index.mjs imports it from outside,
  // which Rollup can't see — so it gets eliminated and the wrapper imports
  // `undefined`, causing FUNCTION_INVOCATION_FAILED at request time).
  environments: {
    ssr: {
      resolve: {
        noExternal: true,
        external: [
          "node:async_hooks",
          "node:buffer",
          "node:crypto",
          "node:fs",
          "node:http",
          "node:https",
          "node:net",
          "node:path",
          "node:process",
          "node:stream",
          "node:url",
          "node:util",
          "node:zlib",
        ],
      },
      build: {
        rollupOptions: {
          preserveEntrySignatures: "strict",
        },
      },
    },
  },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});
