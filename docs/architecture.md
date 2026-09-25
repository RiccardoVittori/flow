# FLOW — decisioni architetturali

Ricerca: 25 settembre 2026. Destinazione: GitHub Pages, italiano; futura espansione per lingua senza duplicare ora le route.

## Ricerca e confronto

Audit mirato dei README, struttura, licenze e metadati GitHub (non audit integrale del codice upstream):

| Candidato                                             | Stato osservato                                                                         | Punti utili                                | Decisione                                                   |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| [AstroPaper](https://github.com/satnaing/astro-paper) | MIT, 5.077 stelle, push 18/09/2026, 27 issue/PR aperte                                  | Collections, Pagefind, RSS, accessibilità  | Riferimento per struttura editoriale; nessun codice copiato |
| [AstroWind](https://github.com/arthelokyo/astrowind)  | MIT, 5.993 stelle, push 12/09/2026, 2 issue/PR aperte; vecchio URL onwidget reindirizza | Landing e widget marketing                 | Troppa struttura marketing per il nucleo editoriale         |
| [Starlight](https://github.com/withastro/starlight)   | MIT, 9.300 stelle, push 25/09/2026, 26 issue/PR aperte                                  | Navigazione, documentazione, knowledge hub | Ottimo per documentazione; layout poco adatto alla rivista  |

Consultati anche [Awesome Astro](https://github.com/one-aalam/awesome-astro), [collections](https://docs.astro.build/en/guides/content-collections/), [Pages](https://docs.astro.build/en/guides/deploy/github/), [Pagefind](https://pagefind.app/), [PhotoSwipe](https://photoswipe.com/), [Leaflet](https://leafletjs.com/), [Fontsource](https://fontsource.org/fonts/source-serif-4), [Stripe Payment Links](https://docs.stripe.com/payment-links). Stelle e attività sono segnali, non garanzie di sicurezza/accessibilità.

## Problema → alternative → decisione → ragione

- Pubblicazione statica: Astro / Eleventy / Next export → Astro stable da npm, versione bloccata nel lockfile → MDX, immagini build-time, TypeScript, HTML senza hydration.
- Identità: starter completo / componenti propri → componenti Astro originali → meno dipendenze, controllo sul linguaggio editoriale.
- Stile: Tailwind / CSS → CSS nativo con token → nessuna necessità di utility framework per questo sistema contenuto.
- Ricerca: Fuse con indice completo / servizio SaaS / Pagefind → Pagefind, solo nella ricerca → indice suddiviso e nessun account/backend.
- Tipografia: Lora+Inter / Source Serif 4+Manrope → seconda coppia, WOFF2 latin self-hosted, swap → tono da atlante e leggibilità; licenze OFL.
- Immagini: CDN runtime / Astro Picture → asset locali con WebP e AVIF generati alla build, dimensioni e sizes espliciti → nessuna dipendenza runtime esterna. Fotografie ambientali, mai prove tassonomiche.
- Gallerie: PhotoSwipe / figure native → griglia di figure native nell'MVP; PhotoSwipe (MIT) solo quando occorreranno zoom e lightbox → zero JS aggiuntivo oggi.
- Motion: GSAP / Motion / CSS → CSS e transizioni native progressive, reduced motion → nessuna libreria o scroll-jacking.
- Mappe: Leaflet / MapLibre / semplice riferimento geografico → componente con coordinate testuali e link OpenStreetMap; nessun luogo di raccolta inventato → mappe interattive solo con dati territoriali pubblicabili.
- Commerce: Stripe hosted checkout / Shopify Storefront / Snipcart → contratti e componenti isolati, vendite inattive → niente prezzi, disponibilità o eventi inventati; un futuro hosted checkout non richiederà un backend in Pages. Credenziali server mai nel client.
- Newsletter: form finto / provider esterno → RSS funzionante, email esplicitamente non ancora attiva → niente raccolta dati senza destinazione e informativa definite.
- SEO: schema generico ovunque / schema pertinente → Organization, BlogPosting, BreadcrumbList; Book/Event/Product solo con record reali completi.
- CSP: policy meta incompleta / rinvio a header controllabili → nessuna promessa di CSP forte su Pages; script tutti locali, assenza di embed e servizi terzi. Migrare a hosting con header configurabili se richiesto.

## Confini editoriali

Il repository del libro resta indipendente. Nessun capitolo, registro, fixture o asset TEST del libro viene pubblicato. Tre brevi testi originali di presentazione/metodo costituiscono l'avvio del blog, non una guida scientifica verificata. Esempi MDX e showcase vivono in `tests/fixtures`, esclusi dalle route, feed e indice. I record distinguono evidenza, esperienza, ipotesi e intenti editoriali; nessuna auto-promozione a VERIFIED.

## Sicurezza e distribuzione

Repository BLOG indipendente. `.env` ignorato prima dell'inizializzazione Git; il token serve solo alle operazioni GitHub locali e non alla build. GitHub Actions usa GITHUB_TOKEN con permessi minimi. Dipendenze riproducibili con pnpm lock e audit. Nessun cookie applicativo, analytics o font remoto. Il gestore GitHub Pages conserva i propri log: documentarlo nell'informativa.

## Compatibilità verificate durante implementazione

Astro 7.3.5, MDX 8.0.2, Pagefind 1.5.2, pnpm 12.6.0, Node 24.21.0. TypeScript 6.0.3 perché i peer di Astro Check e typescript-eslint escludono 7. Sharp esplicito richiesto dal servizio immagini. Pagefind Default UI è ancora supportata: scelta qui per ricerca inline semplice e API di query precompilata, verificata con axe; valutata la nuova Component UI 1.5 per future interfacce modali. Nessun servizio remoto nella ricerca.
