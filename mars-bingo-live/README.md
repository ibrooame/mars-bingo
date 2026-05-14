# Mars Bingo Live

Production-oriented real-time Telegram Mini App Bingo platform for low-resource Android Termux hosting.

## Run

```bash
cp .env .env.local
npm install
npm run init-db
npm start
```

Set `BOT_TOKEN`, `PUBLIC_URL`, `ADMIN_SECRET`, and `ADMIN_IDS` before production use. Use PM2 with:

```bash
pm2 start ecosystem.config.js
pm2 save
```

## Termux boot hint

Install Termux:Boot and add a boot script that runs `pm2 resurrect` after Android starts. Keep `watch:false` in PM2 to avoid file watcher memory overhead.
