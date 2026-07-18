// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The Lovable wrapper defaults Nitro to the `cloudflare-module` preset, which emits a
// Cloudflare *Worker* (`export default { fetch }`) — NOT a Node server. Running that file
// with `node .output/server/index.mjs` just imports a module that binds nothing and exits.
//
// This deployment is a Node VPS (PM2 + Nginx), so we pin Nitro to the `node-server` preset.
// That preset's runtime reads PORT/NITRO_PORT and calls `serve(...)`, producing a real
// long-lived HTTP server at `.output/server/index.mjs`.
//
// Overridable via NITRO_PRESET for other targets (e.g. NITRO_PRESET=cloudflare-module).
const nitroPreset = process.env.NITRO_PRESET || "node-server";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this.
    server: { entry: "server" },
  },
  // Force a Node-runnable server build. `preset` wins over the wrapper's cloudflare `defaultPreset`.
  nitro: {
    preset: nitroPreset,
  },
});
