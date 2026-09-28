# FLOW — produzione delle scene illustrate

Data: 27 settembre 2026. Due master raster originali prodotti con lo strumento integrato **imagegen**, non con un runner API. Gli originali generati sono stati copiati nel workspace; Astro produce derivati AVIF/WebP alla build. Nessuna fotografia privata è stata passata allo strumento. Le immagini sono **interpretazioni ambientali**, non fonti scientifiche o immagini di un luogo identificato.

## Ingresso nel bosco

Asset: `src/assets/flow-forest-illustration.png`, 1536×1024. Uso: fondale della scena iniziale. Composizione a tre piani: tronchi/felci ai margini, sentiero in primo piano, valle e montagne lontane. Inquadratura ad altezza del cammino, luce mattutina, verdi petrolio/salvia/giada, ocra e accenti ruggine. Regione sinistra scurita in CSS per i titoli HTML. Nessuna trasparenza nel raster: foglie SVG separate forniscono il piano animabile. Desktop a tutta larghezza, mobile crop centrale orientato sul sentiero; `sizes` tiene conto dell’altezza per evitare ingrandimenti sfocati. Alt vuoto perché il fondale è decorativo e la scena è descritta dal testo.

Prompt finale:

> Use case: stylized-concept. Asset type: original wide website forest background painting for FLOW, premium adult adventure natural-history editorial. Generate a beautiful cinematic illustrated temperate forest, 1536x1024 landscape composition. An ancient oak on the far left and tall mossy trunks on the far right frame a winding pale ochre footpath leading from the lower center toward a softly luminous turquoise mountain valley in the center-right distance. Lush layered ferns, credible leaf forms, moss, limestone, tiny warm russet plants. Strong readable silhouettes with refined hand-painted gouache texture, delicate organic ink edges, sophisticated semi-realistic stylized naturalism. Morning mist, shafts of pale warm sunlight, jade and deep teal greens, sage, golden ochre and restrained burnt vermilion. Upper left/central area relatively quiet and dark for cream headline overlaid later in HTML. Deep foreground, midground trail and atmospheric distant mountain background, no flat vector look. Delightful and adventurous but adult and credible, not photorealism or children's cartoon. No humans, no dogs, no buildings, no decorative Asian motifs, no text, no letters, no logos, no UI, no watermark. Original visual language, do not imitate any named artist or franchise. This is environmental concept illustration, not scientific specimen evidence.

## Sotto la superficie

Asset: `src/assets/flow-underground-illustration.png`, 1536×1024. Uso: scena Il Cercatore. Composizione di taglio, sottosuolo sulla destra e spazio quieto a sinistra; humus, radici, pietre e reticolo fungino evocativo. Palette terra d’ombra, rame, avorio e muschio. Le radici SVG sovrapposte sono separate dal master e vengono tracciate durante lo scroll. Mobile: testo in alto, dettaglio del terreno sotto, senza pretendere che l’immagine costituisca un diagramma in scala. Nessuna trasparenza nel raster. Vincolo pubblico esplicito: non utilizzare per identificare specie o dedurre interazioni biologiche.

Prompt finale:

> Use case: stylized-concept. Asset type: FLOW website underground narrative background, landscape 1536x1024. Original semi-realistic hand-painted natural-history adventure illustration, atmospheric cutaway of a forest floor. The top 15 percent shows moss, fallen ochre leaves, fern stems and one massive oak root entering dark warm umber soil. Across the right two thirds, branching roots descend among small limestone pebbles, delicate irregular white fungal filaments, and one small knobbly dark brown truffle-like fruit body nestled in soil near the lower right. This is explicitly an evocative conceptual illustration, not a labeled scientific diagram or identification guide. Root forms tactile and credible, no glowing magic, no luminous networks or neurons. Left third quiet nearly black chocolate earthy shading with sparse subtle grains, for cream HTML typography added later. Layered sienna, charcoal, muted copper and ivory threads, restrained deep moss green at top, rich gouache textures and precise organic ink accents. Strong composition, premium adult adventure book atmosphere, selective detail, subtle mineral flecks. No animals, humans, fossils, skeletons, gold treasure, buildings, text, labels, letters, logos or UI. Avoid cartoon mushrooms, neon, oversaturated orange, faux Japanese decoration. Match a cinematic painted forest art direction, not photorealism, not flat vectors.

## Biblioteca SVG originale

- `Foliage.astro`: rami e foglie con nervature, sfondo trasparente, variante laterale. Animazione dei gruppi, mai del contenuto testuale.
- `Landscape.astro`: montagne, piani di vegetazione, sentiero, uccelli lontani e cielo; varianti diurno/tramonto. Crop mobile verticale, movimento limitato al piano lontano.
- `InkGesture.astro`: figura astratta in un gesto di pratica e traccia circolare. Non ritratto di Riccardo, non grado, stile marziale o sequenza didattica. Respiro e rotazione contenuti, disattivati su mobile e in reduced motion.
- `JourneyOpening.astro`: bordo del suolo e ramificazioni SVG originali. `FlowLoop.astro`: sentiero circolare preesistente, animato solo nella homepage.

La libreria è decorativa (`aria-hidden`, nessun focus) eccetto il FLOW LOOP, che conserva titolo, descrizione e alternativa HTML ordinata. Nessun asset è copiato dalle demo studiate.

## Persona e fonti private

La scena personale riusa **soltanto** `src/assets/riccardo-vittori.jpg`, già selezionato e pubblicato dall’utente nel commit efcdd30. Nessun nuovo originale da `curriculum/` o `immagini-reali/` viene copiato o pubblicato. L’illustrazione marziale non deriva dalla fotografia personale. Crediti e registro delle immagini distinguono foto pubblica autorizzata e fondali generati.
