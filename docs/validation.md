# Verifica iniziale FLOW

Data: 25 settembre 2026. Ambiente locale Windows, Node 24.21.0, pnpm 12.6.0, Chromium Playwright 153. Report grezzi e screenshot in `artifacts/` (ignorati da Git).

## Quality gate eseguiti

- `pnpm install --frozen-lockfile`: PASS.
- `pnpm typecheck`: 0 errori, 0 warning, 0 hint.
- `pnpm lint`: PASS.
- `pnpm build`: PASS, 21 pagine HTML, immagini responsive AVIF/WebP/JPEG, indice Pagefind italiano con 5 pagine editoriali.
- `pnpm qa:links`: PASS, 516 link/asset/ancore interne, canonical, JSON-LD, feed, sitemap, esclusione fixture e segreti.
- `pnpm test`: 9/9 PASS. Cinque viewport (360, 390, 768, 1280, 1440); homepage, articolo, esplora e ricerca. Nessun overflow, 0 violazioni axe WCAG A/AA selezionate. Menu e skip link da tastiera, ricerca con risultati/vuota, navigazione senza JS, 404, reduced motion e canonical.
- `pnpm audit`: 0 vulnerabilità note, incluse dipendenze di sviluppo, al momento della verifica.
- Laboratorio MDX separato: build con `FLOW_SHOWCASE=1` in `artifacts/showcase`, componenti renderizzati, axe mobile 390 px: 0 violazioni, nessun overflow. La build di produzione non contiene `/lab/`.
- Dominio futuro: build separata con `SITE_URL=https://flow.example`, `BASE_PATH=/`, output `artifacts/domain`; indice Pagefind e check di 516 link/asset/ancore: PASS.

Le collection species, glossary, places, books ed experiences sono intenzionalmente vuote. Astro segnala questo stato: non sono errori né contenuti mancanti nascosti da record inventati.

## Lighthouse locale, mobile simulato

| Pagina | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage | 97 | 100 | 100 | 100 | 2,482 s | 0,0012 | 0 ms |
| Articolo Il Cercatore | 97 | 100 | 100 | 100 | 2,407 s | 0,0405 | 0 ms |

Lighthouse 13.5.0, preview localhost, singola esecuzione per pagina. Questi dati sono sintetici: non certificano CWV reali, tempi su CDN o INP sul campo. INP non misurato. Margine LCP ridotto sulla homepage; controllare con dati reali dopo il lancio. Audit automatico axe non equivale a una certificazione WCAG né a una prova completa con screen reader. Browser mobile simulato, non dispositivo fisico.

## Correzioni durante QA

Etichetta accessibile all’icona ricerca mobile; canonical della 404; font WOFF2 con import compatibili; Sharp dichiarato esplicitamente; TypeScript 6 compatibile con i peer; testo alternativo della foto del lago corretto dopo ispezione; studio di copertina ridimensionato per evitare tagli.

## Deploy

Workflow GitHub Pages incluso; installazione, typecheck, lint, audit, build, link e test bloccano la pubblicazione in caso di errore. Stato del deploy effettivo registrato dopo l’esecuzione, non dedotto dalla sola presenza del workflow.
