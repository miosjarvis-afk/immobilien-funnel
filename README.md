# Immobilien-Funnel - Schweiz

Professioneller Lead-Funnel für Immobilien-Eignungscheck in der Schweiz.

## Features

✅ **Landing Page** - Swiss Bank Design, Mobile-First
✅ **Quiz** (6 Fragen) - Progressbar, smooth UX
✅ **Lead Form** - Telefonnummer Pflicht, DSGVO-konform
✅ **Instant Notifications** - Telegram Bot bei jedem Lead
✅ **Tracking** - GA4 + Meta Pixel ready
✅ **Scoring System** - Automatische Qualifizierung
✅ **Vollständiges Ergebnis** - 3-stufige Einordnung

## Quick Start

### Lokaler Test

1. Öffne `index.html` im Browser
2. Teste den kompletten Funnel durch
3. Bei Lead-Submit bekommst du Telegram-Notification

### GitHub Pages Deployment

```bash
# 1. Erstelle neues GitHub Repo
git init
git add .
git commit -m "Initial commit: Immobilien-Funnel"

# 2. Verbinde mit GitHub
git remote add origin https://github.com/[USERNAME]/[REPO-NAME].git
git branch -M main
git push -u origin main

# 3. Aktiviere GitHub Pages
# Settings → Pages → Source: main branch → Save

# 4. Site ist live unter:
# https://[USERNAME].github.io/[REPO-NAME]/
```

### Custom Domain verbinden

1. In GitHub Repo: Settings → Pages → Custom Domain
2. Domain eingeben: `immobilien-check.ch`
3. Bei Domain-Provider (z.B. Namecheap):
   - CNAME Record: `www` → `[USERNAME].github.io`
   - A Records für Root Domain:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

## Tracking Setup

### Google Analytics 4

1. GA4 Property erstellen
2. Measurement ID kopieren (G-XXXXXXXXXX)
3. In `index.html` einfügen (vor `</head>`):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Meta Pixel

1. Meta Events Manager → Pixel erstellen
2. Pixel ID kopieren
3. In `index.html` einfügen (vor `</head>`):

```html
<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'XXXXXXXXXX');
  fbq('track', 'PageView');
</script>
```

## Telegram Notifications

Aktuell verbunden mit:
- Bot Token: `8529364495:AAEd651kGB2bgNwm9MnCx8gVtIJsIrJ3aCM`
- Chat ID: `830554328` (Samu)

Bei jedem Lead bekommst du sofort:
- Name, E-Mail, Telefon
- Score & Eignungslevel
- Alle Quiz-Antworten
- Source (UTM)
- Timestamp

## Conversion Tracking

Automatische Events:
1. `ViewContent` - Landingpage View
2. `StartQuiz` - Quiz gestartet
3. `QuizQuestion` - Jede Frage
4. `QuizComplete` - Quiz fertig
5. `Lead` - Formular submitted

## Anpassungen

### Copy ändern
- Texte in `index.html` direkt editieren
- Quiz-Fragen in `script.js` → `quizQuestions` Array

### Design anpassen
- Farben in `style.css` → `:root` CSS Variables
- Layout/Spacing in entsprechenden Sections

### Kontaktdaten
- `impressum.html` - Firmenname, Adresse ergänzen
- `datenschutz.html` - E-Mail anpassen

## UTM Tracking

### Ads:
```
https://immobilien-check.ch/?utm_source=meta&utm_medium=paid&utm_campaign=launch
```

### Flyer:
```
https://immobilien-check.ch/?utm_source=flyer&utm_medium=offline
```

## KPIs

Ziele (Startphase):
- Landing → Quiz: 25-40%
- Quiz Completion: 70-85%
- Quiz → Lead: 20-35%
- Cost per Lead: 40-80 CHF

## Support

Bei Fragen: Telegram @Jarvis_Bot

---

**Status:** ✅ Ready for deployment
**Ladezeit:** < 2s (Static HTML/CSS/JS)
**Mobile:** ✅ Fully responsive
**Tracking:** ✅ GA4 + Meta Pixel ready
