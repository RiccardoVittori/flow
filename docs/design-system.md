# FLOW — sistema visivo

Riferimento: Visual Style Bible di Il Cercatore nel progetto principale. Realismo ambientale; nessuna fotografia è usata come prova di identificazione o attribuita a un territorio non documentato.

I token sono in `src/styles/global.css`: carta #f3f0e8, inchiostro #262c25, muschio #525d42, terra #826040. Serif Source Serif 4 per titoli e lettura, Manrope per orientamento. Tre WOFF2 latin locali: serif normale, corsivo, sans normale. `font-display: swap`; dimensioni strutturali e rapporto immagini riservano lo spazio. CLS misurato con Lighthouse, senza dichiarazioni di equivalenza ai dati sul campo.

Contenitore 1440 px; gutter fluido 22–80 px; testo massimo 68ch; titoli fluidi con clamp. Breakpoint 760 e 1000 px: CSS media queries esplicite (custom properties non utilizzabili nelle condizioni). Livelli CSS: token, base, layout, componenti. Spazi, bordi, ombre, motion e z-index centralizzati.

Homepage: fotografia a tutta larghezza, manifesto asimmetrico, storia principale, griglia tipografica, taccuino, citazione, studio del libro, orizzonti futuri, RSS. Nessuno slider, scroll-jacking o carosello automatico.

Navigazione mobile con details/summary: funziona senza JavaScript. Link di salto, focus evidente, landmark semantici, contrasto verificato automaticamente con axe. Reduced motion disabilita transizioni e smooth scroll. Le View Transitions sono solo progressive native CSS: nessun client router.

Le foto passano da Astro Picture (AVIF/WebP e fallback). Alt richiesto nello schema; dimensioni derivate dall’asset, widths e sizes espliciti; caricamento eager per hero, lazy sotto la piega. Non implementare trasformazioni diagnostiche senza revisione scientifica.

Componenti editoriali e commerce sono Astro, senza hydration. Le CTA commerciali non mostrano checkout senza dati espliciti. Non usare Event, Product o Book structured data finché i record non descrivono offerte/opere reali complete.
