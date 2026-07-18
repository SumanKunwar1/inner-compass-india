// PM2 config for the TanStack Start (Nitro node-server) frontend.
// Uses .cjs because package.json has "type": "module".
//
//   cd frontend
//   npm ci && npm run build          # produces .output/ (node-server preset)
//   pm2 start ecosystem.config.cjs   # boots the server on PORT below
//   pm2 save                         # persist across reboots (run `pm2 startup` once)
//
// Nginx should proxy_pass to http://127.0.0.1:3000.
module.exports = {
  apps: [
    {
      name: "inner-compass-frontend",
      // Absolute-safe: __dirname is the frontend folder, so cwd doesn't matter.
      script: "./.output/server/index.mjs",
      cwd: __dirname,
      // Nitro node-server binds a single process; use fork mode (not cluster —
      // the bundled server is not cluster-aware).
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // Bind loopback only; Nginx terminates public traffic. Use 0.0.0.0 to expose directly.
        HOST: "127.0.0.1",
      },
      autorestart: true,
      max_restarts: 10,
      // Nitro's own server logs "Listening on…" — no extra interpreter needed.
      time: true,
    },
  ],
};
