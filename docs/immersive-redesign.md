# FLOW — il sentiero, sopra e sotto

Audit e decisioni prima dell’implementazione, 27 settembre 2026. Base: commit efcdd30, incluso il ritratto già selezionato dall’utente. Baseline: typecheck/build/link check, 9 test contratti e 16 browser PASS. Font locali, collection, URL, Pagefind, SEO, biografia e privacy rimangono il nucleo. Il precedente layout alterna moduli editoriali ma non crea attraversamento, cambio di scala o profondità. La homepage cambia regia; gli articoli restano tranquilli.

## Ricerca effettiva

| Risorsa primaria | Valutazione e decisione |
| --- | --- |
| [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [repo](https://github.com/greensock/GSAP) | Scelti per timeline coordinate, scrub, SVG e cleanup responsive. Import dinamico dopo intenzione di scroll; nessun pinning del testo. Licenza Standard GSAP, non MIT, [verificata](https://gsap.com/community/standard-license/). |
| [Lenis](https://github.com/darkroomengineering/lenis) | Scroll smoothing e integrazione GSAP disponibili, ma non adottato: non serve cambiare inerzia, touch, ancore e tastiera. |
| [Motion scroll](https://motion.dev/docs/scroll), [repo](https://github.com/motiondivision/motion) | Alternativa valida e MIT, ma aggiungerla insieme a GSAP duplicherebbe il motore. Non adottata. |
| [Rive Web](https://rive.app/docs/runtimes/web/web-js) | State machine utile per personaggi interattivi; runtime e asset dedicati non giustificati dalle scene previste. Non adottato. |
| [Lottie-web](https://github.com/airbnb/lottie-web) | MIT, adatto ad animazioni esportate da After Effects; nessuna composizione sorgente disponibile, SVG diretti più ispezionabili. Non adottato. |
| [Three.js](https://github.com/mrdoob/three.js), [React Three Fiber](https://github.com/pmndrs/react-three-fiber), [OGL](https://github.com/oframe/ogl) | WebGL offre camera e shader; aumenta runtime, costo GPU, gestione contesto e fallback. La profondità di questo racconto si ottiene in 2D; nessun renderer 3D aggiunto. |
| [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/) | Conservate transizioni CSS native progressive già presenti; nessun ClientRouter o conversione in SPA. |
| [CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines), [WebKit](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/) | Ottime per trasformazioni singole; GSAP scelto per una timeline coordinata e cleanup comune, senza duplicare ogni animazione in CSS. |
| [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) | Scelto per orientamento tra scene; non per calcolare ogni frame. |
| [Codrops: mappe SVG e GSAP](https://tympanus.net/codrops/2026/05/21/creating-scroll-driven-svg-map-animations-with-gsap/) | Studiati path drawing, gruppi camera e relazione tra scroll e percorso. Implementazione originale, senza plugin DrawSVG/MotionPath o codice copiato. |
| [Codrops: forme SVG](https://tympanus.net/codrops/2022/06/08/how-to-animate-svg-shapes-on-scroll/) | Transizioni organiche e maschere come alternativa a shader; qui bordi SVG e crossfade, evitando morph continuo costoso. |
| [Codrops: Three.js scroll](https://tympanus.net/codrops/2022/01/05/crafting-scroll-based-animations-in-three-js/), [Creative Hub](https://tympanus.net/codrops/hub/) | Confrontati parallax, particelle, transizioni, shader e movimento camera. Scartate particelle continue e WebGL in assenza di un bisogno spaziale reale. |
| [CSS Design Awards](https://www.cssdesignawards.com/), [Awwwards storytelling](https://www.awwwards.com/websites/storytelling/) | Consultato il catalogo CSSDA per composizione e ritmo; Awwwards non accessibile dal browser di ricerca, nessuna analisi di demo dichiarata per questa fonte. Premi e stelle non attestano accessibilità. |

Metadati GitHub (stelle, ultimo push, issue/PR, licenza e stato archiviato) acquisiti in `artifacts/immersive-research.json`. È un confronto mirato di documentazione e architettura, non un audit completo dei progetti upstream. Dimensione finale trasferita misurata sulla build, non dedotta dalle stelle o dalla dimensione npm.

## Budget prima del prototipo

- Nessuna hydration globale; solo bootstrap della homepage, budget gzip 5 KB iniziali e 55 KB motion differito.
- Fondale LCP responsive, budget 350 KB alla dimensione mobile selezionata; nessun video.
- Budget iniziale totale 650 KB; pagina completa caricata 2 MB trasferiti come obiettivo, non peso dei master nel repository.
- SVG decorativi non interattivi, trasformazioni/opacity prioritari; linee animate soltanto durante scroll. Nessun loop continuo, cursore sostitutivo o caricamento bloccante.
- Mobile: niente sticky lungo o camera significativa, meno piani e distanze ridotte. Reduced motion: scena statica completa e nessun caricamento del motore finché la preferenza resta attiva.
- Pulsante esplicito per attivare/disattivare il movimento. Nessun contenuto essenziale nascosto in attesa di animazioni.

## Vertical slice

Prototipo costruito e verificato prima dell'estensione: ingresso nel bosco illustrato → cambio di scala con appunti → sottosuolo / Il Cercatore. Sei combinazioni a 390/1440 px con movimento normale, ridotto e JavaScript disabilitato: PASS; nessun overflow, CTA accessibile e zero violazioni axe nelle modalità con JS. Screenshot locali `artifacts/prototype-*.png`. Lo scroll controlla i piani decorativi; i paragrafi scorrono normalmente.

## Direzione visiva

Naturalismo illustrato originale, pennellata e materiali leggibili, senza imitazioni di IP. Due fondali generati appositamente con lo strumento integrato imagegen; soggetti concettuali, non documentazione scientifica. SVG originali per foglie, sentieri, radici e gesto. Le sorgenti private restano locali; nessuna immagine privata viene inviata al generatore. Il ritratto pubblico precedentemente autorizzato resta disponibile nella biografia.

Color script: verde petrolio e salvia dell’ingresso → verde profondo dell’osservazione → terra d’ombra e rame del sottosuolo → carta calda delle letture → verde acqua della mappa → inchiostro e vermiglione del gesto → ocra delle esperienze → verde salvia della restituzione → tramonto minerale. Il colore dei numeri del FLOW LOOP è stato scurito dopo il controllo axe del contrasto.

## Implementazione finale

Dieci scene HTML: Entra, Osserva, Il Cercatore, Scoperte, Orizzonti, Movimento, Esperienza, Restituire, Riccardo, Orizzonte. Le tre letture provengono dai dati editoriali esistenti. La mappa distingue collegamenti disponibili e idee future; il gesto marziale è una figura generica, non una tecnica didattica o un'attribuzione biografica. Il ritratto è quello pubblico già scelto dall'utente. RSS, ricerca, articoli e biografia conservano i propri URL.

`JourneyController.astro` gestisce preferenze, indicatore di posizione e caricamento differito; `scene-motion.ts` contiene timeline e cleanup responsive. Il motore si carica al primo scroll, mai con reduced motion attivo. Disattivazione manuale, cambio della preferenza durante la visita e ritorno dalla cache del browser ripristinano uno stato coerente. I testi non dipendono dall'avvio del motore. Su mobile niente camera sticky lunga; su desktop piani separati di vegetazione, nebbia e fondale.

Due master PNG originali alimentano varianti AVIF e fallback JPEG generati da Astro, qualità 60, con WebP aggiuntivo per il sottosuolo. Il bosco mobile usa un ritaglio verticale 600×1024 effettivi (altezza limitata dal master): evita di scaricare i lati fuori schermo del master. I due font serif del titolo vengono precaricati solo sulla homepage. Niente immagini remote richieste al visitatore. Produzione e prompt sono in [visual-production.md](visual-production.md). Risultati misurati e limiti sono in [validation.md](validation.md).
