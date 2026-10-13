# InterfaZe

InterfaZe is a design-first React component library and documentation site with a shadcn-compatible static registry. It is intended to help developers discover, inspect, install, and customize carefully crafted UI components.

> **Status:** Initial component-library expansion. Six distributable components and their shared documentation pages are implemented. The public registry and Vercel deployment are not yet verified.

## Implemented

- Protected cinematic homepage with the existing InterfaZe visual identity.
- Responsive documentation shell at `/components`.
- Six component documentation routes under `/components/<name>`.
- Persistent light/dark documentation theme.
- Interactive preview, tooltips, selection state, notification indicators, and keyboard navigation.
- Preview/Code tabs and copyable source, import, usage, and installation examples.
- CLI and Manual installation modes with npm, pnpm, yarn, and bun command generation.
- Static shadcn-compatible registry generation into `public/r`.
- Searchable catalog filtering across the eight component categories.
- Production-ready Vite build configuration for Vercel deployment.

## Stack

- React 19
- TypeScript
- Vite
- shadcn CLI registry build
- Plain CSS design tokens and responsive styles

No backend, database, authentication, npm package, or animation dependency is required by the current milestone.

## Local setup

Prerequisites: Node.js 20 or newer and npm.

```bash
cd interfaze-ui
npm install
npm run dev
```

The development server prints its URL. Open `/` for the homepage, `/components` for the catalog, and `/components/floating-toolbar` for the component page.

## Commands

```bash
npm install                 # install dependencies
npm run dev                 # build registry, then start Vite
npm run typecheck          # TypeScript project check
npm run registry:validate  # validate registry metadata and source paths
npm run registry:build     # generate public/r/*.json
npm test                   # registry validation smoke test
npm run build              # build registry, typecheck, and production site
npm run check              # typecheck, registry validation, and production build
npm run preview            # serve the generated dist directory
```

There is no separate ESLint configuration in this first milestone. TypeScript, registry validation, and the production build are the current automated checks.

## Project architecture

```text
public/
  fonts/                 supplied Media Madre font
  images/                supplied homepage background
  r/                     generated registry JSON (ignored; rebuilt on dev/build)
src/
  components/            website component entry points
  docs/                  documentation shell and page composition
  styles.css             protected homepage styles
registry/
  default/floating-toolbar/
    floating-toolbar.tsx  portable distributable component
    floating-toolbar.css  portable component styles
scripts/
  validate-registry.mjs  source registry validation
registry.json            shadcn registry catalog
components.json          shadcn consumer alias configuration
vercel.json               SPA fallback for client-side routes
```

The website imports Floating Toolbar from the registry source through `src/components/FloatingToolbar.tsx`, so the live preview and distributed source share one implementation.

## Components

The current catalog contains:

- Floating Toolbar — Navigation
- Magnetic Button — Buttons & Actions
- Command Palette — Navigation
- OTP Input — Forms & Inputs
- Toast Notification — Feedback & Status
- Spotlight Card — Layout & Surfaces

Each component has a live preview, source-backed Code tab, CLI installation command, Manual installation source, usage example, and API notes.

## Floating Toolbar

### Registry installation

When the site is running locally, build the registry and use the actual development-server URL:

```bash
npm run dev
npx shadcn@latest add http://localhost:5173/r/floating-toolbar.json
```

The generated registry item installs `floating-toolbar.tsx` and its `floating-toolbar.css` into the consumer's configured UI directory. The component has no runtime dependency beyond React. Its CSS is imported relatively from the installed component file.

The production command should use the deployed site URL after Vercel deployment has been verified:

```bash
npx shadcn@latest add https://YOUR-DEPLOYED-DOMAIN.example/r/floating-toolbar.json
```

Do not treat that domain as live until it has been checked in a browser or with `curl`.

### Manual installation

Copy these source files into a consumer project:

- `registry/default/floating-toolbar/floating-toolbar.tsx`
- `registry/default/floating-toolbar/floating-toolbar.css`

The component exports `FloatingToolbar`, `FloatingToolbarItem`, and `FloatingToolbarProps`. It accepts `items`, optional `onSelect`, and optional `className`.

```tsx
import { FloatingToolbar } from '@/components/ui/floating-toolbar'

const Icon = ({ symbol }: { symbol: string }) => <span aria-hidden="true">{symbol}</span>

const items = [
  { id: 'menu', label: 'Menu', icon: <Icon symbol="☰" /> },
  { id: 'search', label: 'Search', icon: <Icon symbol="⌕" />, shortcut: '⌘ K' },
  { id: 'notifications', label: 'Notifications', icon: <Icon symbol="●" />, notification: true },
]

export function ToolbarExample() {
  return <FloatingToolbar items={items} onSelect={(id) => console.log(id)} />
}
```

The icon component in that example is intentionally consumer-owned. InterfaZe does not publish an icon package in this milestone; replace the small example symbols with an installed icon library or your own SVG components.

## Registry architecture

`registry.json` is the source catalog and follows the current shadcn registry schema. `npm run registry:build` resolves the source item and emits:

- `/r/registry.json` — catalog endpoint.
- `/r/floating-toolbar.json` — item endpoint.

Generated output is ignored because it is reproducible and is created automatically by both `predev` and `build`. Vercel runs the same build command, so static registry JSON is included in the deployment output.

To add a component:

1. Add portable source and styles under `registry/default/<name>/`.
2. Add an item with exact source paths to `registry.json`.
3. Reuse the shared documentation sections and connect a real catalog link.
4. Run `npm run registry:validate` and `npm run registry:build`.
5. Test the generated endpoint with `npx shadcn@latest view http://localhost:<port>/r/<name>.json`.

## Clean consumer testing

Use a separate temporary directory outside this repository:

```bash
mkdir interfaze-consumer-test
cd interfaze-consumer-test
npm init -y
npm install react react-dom typescript @types/react @types/react-dom
npx shadcn@latest init
npx shadcn@latest add http://localhost:5173/r/floating-toolbar.json
npx tsc --noEmit
```

The consumer must provide the icons used by its own example and import the installed component from the configured UI alias. A full browser render check is still recommended after installation.

## Vercel deployment

The repository includes `vercel.json` with an SPA fallback. In Vercel:

1. Import `Rudrakshbhardwaj01/interfaze-ui`.
2. Keep the framework preset as Vite.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Deploy without environment variables; none are currently required.
6. Verify `/`, `/components`, `/components/floating-toolbar`, `/r/registry.json`, and `/r/floating-toolbar.json` after deployment.

The public registry is not claimed to be available until those endpoints return the expected HTML or JSON responses.

## Known limitations

- The catalog currently contains six distributable components; additional planned categories are not populated with placeholder pages.
- The generated registry output is intentionally not committed; deployment must run the build command.
- No public deployment has been performed or verified in this workspace.
- No npm package is published.
- The icon examples use consumer-provided icons; the registry does not add an icon dependency.
- The repository license decision is pending. Until a license file is added, reuse permissions should not be assumed.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development checklist and registry workflow.

## License

No license has been selected yet. The absence of a license does not grant general permission to reuse the code. Add a definitive `LICENSE` file only after the project owner chooses the intended terms.

## Links

- Repository: https://github.com/Rudrakshbhardwaj01/interfaze-ui
- shadcn registry documentation: https://ui.shadcn.com/docs/registry/getting-started
