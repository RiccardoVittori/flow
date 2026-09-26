# Verifica iniziale FLOW

## Aggiornamento: percorsi tematici, 26 settembre 2026

Aggiunti indici statici per gli argomenti con contenuti pubblicati, conteggi da collection e navigazione dagli articoli. I temi ancora vuoti sono raccolti in un elenco espandibile senza collegamenti a ricerche prive di risultati. Nessun nuovo articolo o dato scientifico in questo aggiornamento.

Typecheck: 0 errori/warning/hint; lint e build PASS. Output: 25 pagine HTML, 618 link/asset/ancore interne validati. Browser: 12/12 test PASS in modalità CI; audit axe esteso anche al percorso Ricerca sui cinque viewport, navigazione avanti/indietro tra tema e articolo, conteggi, assenza di pagine tematiche vuote e uso senza JavaScript. I risultati Lighthouse della release iniziale riportati sotto non sono stati rimisurati per questa modifica.

---

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

| Pagina                | Performance | Accessibility | Best Practices | SEO | LCP     | CLS    | TBT  |
| --------------------- | ----------- | ------------- | -------------- | --- | ------- | ------ | ---- |
| Homepage              | 97          | 100           | 100            | 100 | 2,482 s | 0,0012 | 0 ms |
| Articolo Il Cercatore | 97          | 100           | 100            | 100 | 2,407 s | 0,0405 | 0 ms |

Lighthouse 13.5.0, preview localhost, singola esecuzione per pagina. Questi dati sono sintetici: non certificano CWV reali, tempi su CDN o INP sul campo. INP non misurato. Margine LCP ridotto sulla homepage; controllare con dati reali dopo il lancio. Audit automatico axe non equivale a una certificazione WCAG né a una prova completa con screen reader. Browser mobile simulato, non dispositivo fisico.

## Correzioni durante QA

Etichetta accessibile all’icona ricerca mobile; canonical della 404; font WOFF2 con import compatibili; Sharp dichiarato esplicitamente; TypeScript 6 compatibile con i peer; testo alternativo della foto del lago corretto dopo ispezione; studio di copertina ridimensionato per evitare tagli.

## Deploy

Pubblicazione completata il 26 settembre 2026: [FLOW online](https://riccardovittori.github.io/flow/). [Workflow 36221745339](https://github.com/RiccardoVittori/flow/actions/runs/36221745339): build e deploy SUCCESS, commit applicativo `483ce93`. Installazione, typecheck, lint, audit, build, link e tutti i 9 test browser superati sul runner Linux.

Il primo tentativo si era bloccato dopo i test nella chiusura del server avviato tramite pnpm. Corretto usando un server statico Node diretto, shutdown esplicito e timeout dei job. Suite rieseguita anche localmente con CI=true: 9/9 PASS e terminazione regolare.

Verifica pubblica del 26 settembre 2026, ore 05:48 UTC: homepage, articolo, esplora, ricerca, RSS, sitemap e robots HTTP 200; URL inesistente HTTP 404 con pagina personalizzata. Ricerca «tartufi» e apertura del risultato riuscite. Axe mobile 390 px sulle quattro pagine HTML: 0 violazioni selezionate; nessun overflow o errore JavaScript. Evidenza locale: `artifacts/live-verification.json` e `artifacts/live-mobile.png`. I punteggi Lighthouse sopra restano misure locali, non nuove misure sul sito pubblico.
