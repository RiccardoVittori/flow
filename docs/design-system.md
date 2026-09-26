# FLOW — sistema visivo

Riferimento: Visual Style Bible di Il Cercatore nel progetto principale. Realismo ambientale; nessuna fotografia è usata come prova di identificazione o attribuita a un territorio non documentato.

I token sono in `src/styles/tokens.css`: carta #f5f1e8, inchiostro #282820, muschio #525d42, terra #8a4e35. Serif Source Serif 4 per titoli e lettura, Manrope per orientamento. Tre WOFF2 latin locali: serif normale, corsivo, sans normale. `font-display: swap`; dimensioni strutturali e rapporto immagini riservano lo spazio. CLS misurato con Lighthouse, senza dichiarazioni di equivalenza ai dati sul campo.

Contenitore 1440 px; gutter fluido 22–80 px; testo massimo 68ch; titoli fluidi con clamp. Breakpoint 760 e 1000 px: CSS media queries esplicite (custom properties non utilizzabili nelle condizioni). Livelli CSS: token, base, layout, componenti. Spazi, bordi, ombre, motion e z-index centralizzati.

Homepage: fotografia a tutta larghezza, manifesto asimmetrico, storia principale, griglia tipografica, taccuino asimmetrico, sentiero FLOW LOOP, RSS. Nessuno slider, scroll-jacking o carosello automatico.

Navigazione mobile con details/summary: funziona senza JavaScript. Link di salto, focus evidente, landmark semantici, contrasto verificato automaticamente con axe. Reduced motion disabilita transizioni e smooth scroll. Le View Transitions sono solo progressive native CSS: nessun client router.

Le foto passano da Astro Picture (AVIF/WebP e fallback). Alt richiesto nello schema; dimensioni derivate dall’asset, widths e sizes espliciti; caricamento eager per hero, lazy sotto la piega. Non implementare trasformazioni diagnostiche senza revisione scientifica.

Componenti editoriali e commerce sono Astro, senza hydration. Le CTA commerciali non mostrano checkout senza dati espliciti. Non usare Event, Product o Book structured data finché i record non descrivono offerte/opere reali complete.

# Evoluzione visiva

Il FLOW LOOP è un SVG originale: un sentiero irregolare, contorni secondari e nove tappe numerate. L’elenco HTML mantiene l’ordine completo; nel manifesto ogni tappa si apre con `details/summary`, anche senza JavaScript. Nessuna animazione continua o nuova libreria. È una metafora di intenzioni, non una mappa geografica o scientifica.

La homepage alterna fotografia, composizione editoriale, indice tipografico, una lettura principale con due laterali, ciclo e RSS. Rimossi studio di copertina e sette aree vuote. La biografia segue un percorso semantico ordinato, con periodi, contesti, attività e competenze maturate. Nessun ritratto o viaggio inventato.

Microtesti precedentemente a 8–10 px portati a 11–12 px; ricerca mobile con target minimo 44 px. Fallback locali Georgia/Arial regolati sul campione «Natura, conoscenza, esplorazione. Il Cercatore osserva il bosco.» misurato a 100 px in Chromium Windows: serif size-adjust 107,94%, ascent 96,35%, descent 31,5%; sans 101,91%, 104,99%, 29,44%. Sono approssimazioni di questo ambiente e campione, non equivalenze universali tra sistemi operativi. I tre WOFF2 restano locali, OFL, senza dipendenze aggiuntive.
