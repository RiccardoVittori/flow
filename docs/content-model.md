# Modello dei contenuti

Fonte del blog: `src/content.config.ts`, `src/content/*`, tassonomia in `src/config/taxonomy.ts`. Il blog non modifica né importa automaticamente il manifest del libro.

## Articoli

Markdown o MDX con titolo, description, slug, publishedDate, updatedDate opzionale, author, category, topics, tags, heroImage locale, heroAlt, readingTime, featured, draft, test, sources, scientificNames, relatedContent e knowledgeStatus. Date ISO; slug ASCII univoco. Le prime tre pagine sono testi editoriali originali di lancio, non fixture né approfondimenti scientifici.

`draft: true` è il default. `test: true`, draft e date future sono escluse da tutte le liste, route, RSS e Pagefind. Una relazione esplicita a una voce non pubblicabile ferma la build. Tassonomia chiusa per categorie e topic; tag liberi per la ricerca.

Stati epistemici: editorial (intenti/metodo), experience (esperienza documentata), hypothesis (interpretazione aperta), evidence (affermazioni con fonti). Nessun automatismo certifica un testo. Le fonti includono titolo, URL e nota opzionale sul supporto effettivo.

## Knowledge graph

Collection species, glossary, places, books, experiences predisposte e inizialmente vuote. Tutte hanno i campi comuni e corpi MDX. Route generate sotto `atlante/<collection>/<slug>/` solo quando esistono record pubblicabili. Le relazioni esplicite usano `{ collection, id }`; i suggerimenti automatici incrociano topics. Articoli ordinati per pertinenza; collegamenti alle altre collection mostrati se esistono record reali. Non sono inventate schede biologiche o località per riempire la UI.

## Percorsi per argomento

`src/lib/topics.ts` unisce articoli e voci dell’atlante già pubblicabili. La build genera `argomenti/<topic>/` soltanto per temi con almeno una lettura; conteggi e collegamenti derivano dalle collection. La pagina Esplora mostra i temi futuri in un elenco espandibile senza link verso risultati vuoti. Gli articoli e le schede rimandano ai rispettivi percorsi con navigazione HTML funzionante anche senza JavaScript. Gli indici tematici entrano nella sitemap ma non duplicano gli articoli nell’indice di ricerca Pagefind.

## Componenti MDX

Importare da `src/components/editorial`: Figure (ImageMetadata, alt, caption), Gallery (label), Callout (title), FieldNote (title, date), ScientificName (name, authority), Quote (attribution), Comparison (caption, headers, rows), Timeline (items). Da knowledge: SpeciesCard e Map (coordinate e equivalente testuale con link OSM). Da commerce: BookCTA, ExperienceCTA, ProductCard, BookCard, ExperienceCard, Price, CTA, CartTrigger.

`tests/fixtures/editorial.mdx` è materiale TEST separato: non copiarlo nelle collection di produzione. Il laboratorio di componenti è verificato separatamente e non incluso nel deploy.

## Aggiungere una pagina

1. Creare Markdown/MDX con draft true e campi completi.
2. Registrare provenienza e diritti di ogni nuovo asset in docs/assets.json; conservare fonti e limiti delle affermazioni.
3. Verificare testo, alt, fonti, collegamenti e stato editoriale.
4. Impostare draft false solo per contenuti effettivamente pubblicabili; eseguire i controlli README.
5. Commit su main: il workflow convalida e distribuisce automaticamente.

Futuro IT/EN: collection unica con locale e translationKey quando esistono traduzioni, route per lingua, hreflang solo per pagine equivalenti reali. Nessun duplicato inglese fittizio oggi.
