# FLOW

Natura, conoscenza, esplorazione. Primo verticale: **Il Cercatore — Tartufi, natura e arte di leggere il bosco**.

Sito statico Astro, TypeScript strict, MDX, Pagefind, CSS nativo. Repository indipendente dal progetto del libro.

[Visita FLOW](https://riccardovittori.github.io/flow/) · [Repository GitHub](https://github.com/RiccardoVittori/flow) · [Deploy e controlli](https://github.com/RiccardoVittori/flow/actions/workflows/deploy.yml)

## Avvio

Node 24 LTS e pnpm 12.6.0. Le versioni effettive sono fissate nel lockfile. TypeScript 6 è scelto perché Astro Check e typescript-eslint non supportano ancora TypeScript 7.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
pnpm qa:links
pnpm exec playwright install chromium
pnpm test
pnpm preview
```

Indirizzo locale: `http://localhost:4321/flow/`. Pagefind viene creato dalla build e va provato con preview. In dev il fallback della ricerca permette di raggiungere il taccuino.

Su questa workstation, se Node/pnpm non sono nel PATH, aprire PowerShell in BLOG:

```powershell
$env:PATH = (Get-ChildItem -Directory .tools/node-*-win-x64 | Select-Object -First 1).FullName + ';' + (Resolve-Path .tools/pnpm/node_modules/.bin).Path + ';' + $env:PATH
pnpm.cmd dev
```

`.tools` è un bootstrap locale ignorato, non necessario sui normali ambienti Node. Non modificare impostazioni globali per usarlo.

## Deploy GitHub Pages

Configurazione unica in `site.config.mjs`: site `https://riccardovittori.github.io`, base `/flow/`. Il workflow `.github/workflows/deploy.yml` verifica installazione, TypeScript, lint, audit, build, link e browser prima del deploy da main. Impostare Pages → Source → GitHub Actions. Il token personale non è necessario in Actions.

Per dominio personalizzato, modificare site e base `/` nella configurazione (o SITE_URL/BASE_PATH in CI), configurare DNS e il custom domain in Pages, aggiungere public/CNAME e aggiornare gli URL attesi nei test. Per repository diverso modificare base. La pipeline ufficiale Pages è esplicita anziché astro/action per eseguire tutti i quality gate prima di caricare l’artefatto.

## Contenuti e qualità

- [Decisioni e ricerca](docs/architecture.md)
- [Sistema visivo](docs/design-system.md)
- [Modello editoriale e componenti](docs/content-model.md)
- [Registro immagini](docs/assets.json)
- [Licenze](docs/open-source.md)
- [Risultati di verifica](docs/validation.md)

Nessun backend commerce o newsletter email attivo. Feed RSS reale. Nessuna scheda scientifica dichiarata verificata. Fixtures escluse dalle route di produzione. `.env`, strumenti locali, log e screenshot esclusi da Git.

# Evoluzione editoriale e Chi sono — 26 settembre 2026

La homepage ora propone un viaggio illustrato in dieci scene, con scroll nativo, animazioni progressive e versione statica accessibile. [Ricerca e architettura del redesign](docs/immersive-redesign.md), [asset originali e prompt](docs/visual-production.md), [verifiche](docs/validation.md).

Homepage, [manifesto](https://riccardovittori.github.io/flow/manifesto/), percorso [Il Cercatore](https://riccardovittori.github.io/flow/il-cercatore/) e [Chi sono](https://riccardovittori.github.io/flow/chi-sono/) condividono il sistema visivo FLOW. Il percorso collega tre letture reali; aree e temi vuoti non generano voci di navigazione. La visione della restituzione resta distinta da azioni e impatti documentati.

- [Audit, ricerca e decisioni](docs/evolution-audit.md)
- [Contratti per l’ecosistema e commerce](docs/ecosystem.md)
- [Fonti biografiche e direzione visiva](docs/about-visual-assets.md)
- [Verifiche e limiti](docs/validation.md)

`curriculum/` (anche `Curriculum/`) e `immagini-reali/` sono sorgenti **private locali** ignorate da Git. Non importarle in Astro né copiarle in `public`. `pnpm qa:links` comprende il controllo dell’indice Git e degli artefatti pubblici; `pnpm test` comprende contratti dati e browser. Il CV non è un allegato pubblico.
