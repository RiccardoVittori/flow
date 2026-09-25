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
