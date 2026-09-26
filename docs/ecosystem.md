# FLOW: dalla lettura alla restituzione

## Presente e futuro

Oggi vengono pubblicati tre articoli introduttivi e un percorso editoriale. Il manifesto espone una **visione**, non una rendicontazione. Non ci sono offerte, partner, campagne o impatti pubblicati. La sola nuova collection registrata è `paths`, con un record reale: Il Cercatore. Nessun backend aggiunto.

`src/schemas/ecosystem.ts` contiene contratti Zod per le future entità `projects`, `impactUpdates`, `experiences`, `campaigns`, `partners`. Sono tipi e validatori, non collection vuote attivate. Per attivarne una: introdurre un record documentato, registrare loader/schema, convalidare i riferimenti tra collection pubblicabili e aggiungere la route soltanto per i record visibili. Non usare gli ID dei test come contenuti.

## Due assi distinti

`knowledgeStatus` descrive la natura editoriale: intento, esperienza, ipotesi, evidenza. `stage` descrive lo stato: `vision`, `project`, `action`, `impact`. Nessuno dei due certifica la verità di una dichiarazione o sostituisce una revisione scientifica.

Ogni record conserva `draft`, `test`, eventuale data di pubblicazione, ID e documentazione. `evidence` contiene ID, titolo, URL HTTPS, tipo, data e limiti. I riferimenti alle evidenze devono risolversi; ID duplicati sono rifiutati. Le azioni e gli impatti richiedono documentazione. La validazione controlla struttura e coerenza: non può verificare automaticamente che una fonte provi quanto dichiarato.

## Tracciabilità dei progetti

Un progetto comprende luogo, problema, obiettivo, stato, partner, beneficiari, intenzioni per persone/flora/fauna, risorse, attività, partecipanti, output, outcome, indicatori, aggiornamenti, immagini con provenienza/licenza e lezioni apprese.

Catena di lettura futura: **risorsa → destinazione → progetto → attività → risultato → evidenza**. Gli importi sono interi nell’unità monetaria minima con valuta esplicita. Fondi promessi, ricevuti e spesi restano distinti; non sommare valute diverse. Una risorsa utilizzata deve essere una spesa, non una promessa.

Un progetto nello stadio visione/progetto non può contenere attività o risorse già registrate, partecipanti o misure di impatto. Azione richiede attività documentate; impatto richiede anche outcome e indicatori con baseline, osservazione, unità, metodo, data e limiti. Un output (es. un documento prodotto) non dimostra un outcome. Un confronto prima/dopo, da solo, non dimostra causalità. Non esistono promozioni automatiche a VERIFIED.

Gli aggiornamenti di impatto fanno riferimento a un progetto e a un periodo ordinato. Prima della loro futura pubblicazione occorrerà risolvere gli ID verso progetti realmente pubblicabili e revisionare metodi, evidenze e autorizzazioni. Il contratto locale non sostituisce questo passaggio.

## Esperienze, campagne e partner

Esperienze, corsi, bootcamp, retreat e scambi richiedono obiettivi di apprendimento, attività, luogo e reciprocità: da chi imparare, cosa scambiare, come contribuire e come restituire documentazione. Accesso aperto, finanziato, a pagamento o misto va spiegato. Una dichiarazione di impatto richiede aggiornamenti collegati.

Le campagne hanno uno scopo (accesso, territorio, cultura, ricerca), obiettivo, piano di destinazione, eventuale traguardo economico e risorse documentate. Una campagna aperta non può restare una semplice visione. Le relazioni con partner richiedono documentazione: non pubblicare loghi per riempire una sezione.

## Commerce separabile

I componenti in `src/components/commerce` restano separati dalle collection. `schemas/commerce.ts` convalida URL HTTPS privi di credenziali, CTA interne e prezzi non negativi. Non viene caricato uno SDK, creato un carrello o attivato un pagamento. I componenti esistenti possono rappresentare libri, esperienze, corsi, retreat, prodotti e gift card quando ci saranno dati reali; le campagne devono mantenere il proprio piano di destinazione, senza diventare una scheda prodotto generica.

Percorso futuro: contenuto → scoperta → fiducia → proposta → risorse → restituzione → risultati documentati → nuova conoscenza. Il fornitore di checkout resta sostituibile. Segreti, verifica dei pagamenti e webhook appartengono a un eventuale servizio server, mai al bundle statico. Prima delle vendite occorreranno offerte, condizioni, disponibilità, informativa e responsabilità definite.

## Percorsi di lettura

`src/content/paths/il-cercatore.md` ordina tre riferimenti Astro ad articoli esistenti. Il loader usa gli ID derivati dagli slug dichiarati. `lib/paths.ts` rifiuta tappe duplicate o non pubblicabili e ricava durata e conteggi. `PathNavigation.astro` offre precedente/successiva/ritorno; temi e conoscenze collegate conservano la navigazione trasversale. URL storico `/il-cercatore/` invariato.

Per un secondo percorso aggiungere un record e una route statica generata dai record visibili, preservando l’URL storico del Cercatore. Non predisporre menu pubblici per percorsi senza contenuti. Geologia e acqua sono ammesse nella tassonomia, ma compariranno soltanto con letture pubblicate.
