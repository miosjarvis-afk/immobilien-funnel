# Backend für Immobilien-Funnel

Einfacher Express Server für Telegram-Notifications.

## Deployment (Railway.app - kostenlos)

1. Gehe zu: https://railway.app
2. Sign up mit GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Wähle `immobilien-funnel` Repo
5. Root Directory: `/backend`
6. Deploy

Railway erkennt automatisch Node.js und installiert Dependencies.

## Nach Deployment

1. Kopiere die Railway URL (z.B. `https://immobilien-funnel-backend.up.railway.app`)
2. In `script.js` ersetze:
   ```javascript
   const BACKEND_URL = 'https://DEINE-RAILWAY-URL.up.railway.app';
   ```

## Lokal testen

```bash
cd backend
npm install
npm start
```

Server läuft auf: http://localhost:3000

Test:
```bash
curl http://localhost:3000
# {"status":"ok","service":"immobilien-funnel-backend"}
```
