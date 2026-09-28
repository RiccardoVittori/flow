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

# Redesign immersivo — 28 settembre 2026

Questa sezione descrive la homepage illustrata e sostituisce i risultati precedenti per questa versione. I risultati storici sotto non sono nuove misure.

- Typecheck: 71 file, zero errori, warning o hint. Build: 19 pagine; 547 collegamenti/asset/ancore, metadati, feed e sitemap verificati. Le collection senza contenuti restano vuote: i relativi avvisi di build sono attesi.
- Test: 9 contratti Node e 20 scenari Playwright PASS. Otto pagine a 360/390/768/1280/1440 px, zero violazioni axe nelle regole WCAG A/AA selezionate e nessun overflow. Reflow a 320 px e testo al 200%, tastiera, ricerca e link reali verificati.
- Nuovi scenari: motore differito e reversibile, interruttore manuale, no-JS, reduced motion senza scaricare GSAP, cambio della preferenza durante la visita, controlli touch e disclosure dei progetti futuri.
- Prova aggiuntiva Chromium e WebKit in emulazione mobile: navigazione, ricerca, cambio reduced motion e axe PASS. Non equivale a Safari iOS/Android su hardware fisico. Nessuna prova umana con NVDA/VoiceOver.
- Privacy: cartelle sorgente private assenti dall'indice Git e dall'artefatto pubblico; nessun PDF pubblico. Ritratto già autorizzato nel commit di partenza conservato. Le due nuove illustrazioni sono generate e identificate come concettuali nei crediti e nel registro asset.
- Audit dipendenze: nessuna vulnerabilità nota segnalata. Unica nuova dipendenza runtime: GSAP 3.15.0, licenza Standard GSAP documentata.

## Profilo sintetico dello scroll

`node scripts/profile-journey.mjs`, server locale statico, Chromium, scroll nativo di sei secondi. File dettagliato locale `artifacts/immersive-profile.json`. Risorse conteggiate con Resource Timing, escluso documento HTML; non sono byte trasferiti dal CDN. Mobile è viewport 390×844 con CPU rallentata 4×, non uno smartphone fisico.

| Misura | Desktop 1440×950 | Mobile simulato |
| --- | ---: | ---: |
| Risorse iniziali | 411.988 B | 287.095 B |
| Risorse osservate fino a fine scroll | 762.675 B | 414.992 B |
| Mediana / p95 intervalli frame | 16,7 / 16,8 ms | 16,7 / 16,7 ms |
| Intervalli sopra 50 ms | 1 | 0 |
| Long task durante scroll | 0 | 1 da 68 ms |
| Layout durante la prova | 215 | 135 |
| Heap JS al termine | 2,87 MB | 2,52 MB |

Bootstrap: 1.338 B gzip; chunk differito GSAP/ScrollTrigger: 44.478 B gzip. Fondale forestale AVIF massimo: 257.180 B, sotto il budget mobile di 350 KB. I numeri delle risorse osservate non garantiscono che ogni asset lazy sia stato richiesto. La prova mostra il comportamento di questa macchina e non garantisce 60 fps su ogni dispositivo; il long task mobile resta un limite misurato. INP e Core Web Vitals sul campo non misurati.

## Lighthouse del redesign

Lighthouse 13.5.0, Chromium locale, mobile simulato, build finale. Una misura per pagina; homepage rimisurata dopo ritaglio mobile e preload dei font. File locali `artifacts/immersive-lh-*.json`.

| Pagina | Performance / Accessibility / Best Practices / SEO | LCP | CLS | TBT |
| --- | --- | ---: | ---: | ---: |
| Homepage | 94 / 100 / 100 / 100 | 3,006 s | 0,00017 | 0 ms |
| Il Cercatore | 99 / 100 / 100 / 100 | 1,951 s | 0,00001 | 0 ms |
| Chi sono | 98 / 100 / 100 / 100 | 2,102 s | 0,02258 | 0 ms |
| Articolo introduttivo | 97 / 100 / 100 / 100 | 2,401 s | 0,00005 | 0 ms |

Homepage migliorata da 87 e LCP 3,751 s nella prima misura del redesign a 94 e 3,006 s. **Restano aperti il target performance ≥95 e LCP <2,5 s della homepage.** Nessuna certificazione WCAG o promessa di prestazioni sul campo deriva da questi audit. Priorità successive: misure su dispositivi fisici, prova assistiva umana e ottimizzazione ulteriore della prima schermata guidata da dati reali.

# Evoluzione FLOW e Chi sono — 26 settembre 2026

Questa sezione descrive la nuova versione; i risultati precedenti restano sotto come storico. Audit iniziale completato prima delle modifiche: 25 pagine, 618 collegamenti, 12 test browser.

- Typecheck: 0 errori, warning o hint. Lint PASS. Audit dipendenze: nessuna vulnerabilità nota al momento della prova; nessuna nuova dipendenza.
- Build statica: 19 pagine. Link check: 536 collegamenti/asset/ancore, canonical, JSON-LD, feed, sitemap ed esclusione showcase PASS. Sette aree precedentemente vuote non vengono più generate.
- Contratti: 9 test Node PASS. Draft/TEST/date future, distinzione progetto/azione/impatto, riferimenti alle evidenze, fondi ricevuti/promessi/spesi, reciprocità, campagne/partner e URL commerciali non sicuri.
- Browser: 15 scenari PASS in esecuzione completa, più il nuovo scenario Chi sono PASS separatamente (16 complessivi). Otto pagine sui viewport 360/390/768/1280/1440, zero violazioni nelle regole axe WCAG A/AA selezionate, nessun overflow. Menu, skip link, ricerca, sequenza delle tappe, disclosure FLOW LOOP da tastiera e senza JS, temi, 404 e metadati verificati.
- Reflow a 320 px e dimensione radice del testo al 200%: homepage, percorso, manifesto e biografia senza overflow. Questo controllo non equivale a una prova di ogni modalità di zoom del browser. Timeline ordinata in HTML; riduzione movimento supportata. Nessuna prova umana NVDA/VoiceOver o su dispositivo fisico eseguita.
- Dominio personalizzato: build separata `SITE_URL=https://flow.example`, `BASE_PATH=/`, 536 collegamenti validati; browser su Chi sono, canonical e ricerca Pagefind PASS.
- Laboratorio MDX: build separata PASS, sempre esclusa dalla produzione.
- Privacy: cartelle private ignorate anche nelle varianti di maiuscole/minuscole; zero file tracciati e zero percorsi nella history. Nessun PDF pubblico. Confronto di cinque identificatori privati estratti localmente e hash del PDF contro sorgenti pubblici, documentazione e build: zero corrispondenze. Nessuna fotografia disponibile in `immagini-reali/`; nessuna fotografia personale pubblicata o generata.
- Screenshot locali prima/dopo e biografia a 390/1440 px in `artifacts/`, esclusi da Git. Controllo visivo di homepage desktop, dettaglio taccuino e biografia mobile eseguito.

## Lighthouse della nuova versione

Lighthouse 13.5.0, Chromium locale, profilo mobile simulato, una esecuzione per pagina. Punteggi nell’ordine Performance / Accessibility / Best Practices / SEO:

| Pagina       | Punteggi             | LCP     | CLS     | TBT  |
| ------------ | -------------------- | ------- | ------- | ---- |
| Homepage     | 95 / 100 / 100 / 100 | 2,777 s | 0,00003 | 0 ms |
| Il Cercatore | 99 / 100 / 100 / 100 | 1,951 s | 0,00001 | 0 ms |
| Manifesto    | 98 / 100 / 100 / 100 | 1,801 s | 0,00001 | 0 ms |
| Chi sono     | 98 / 100 / 100 / 100 | 2,102 s | 0,0226  | 0 ms |

Il target di punteggio ≥95 è raggiunto su queste pagine. La homepage supera il target LCP <2,5 s: **rimane un limite aperto**, non un CWV passato. Il caricamento dell’immagine principale è già eager, rilevabile nell’HTML e ad alta priorità; ulteriori ottimizzazioni devono preservare la resa e usare misure ripetute. INP e CWV sul campo non misurati. Nessuna certificazione WCAG dedotta dagli audit automatici. I risultati dell’articolo riportati nello storico non sono misure della nuova versione.

## Passi successivi, per dipendenza

1. Selezionare eventuali fotografie personali autorizzate, revisionare diritti/metadati e creare copie web deliberate.
2. Pubblicare approfondimenti e voci dell’atlante soltanto dopo revisione delle fonti e dei limiti.
3. Quando esisterà un’iniziativa reale, attivare il relativo contratto e la verifica dei riferimenti; misurare accessibilità assistiva e performance sul campo prima di ampliare interazioni e servizi.

---
