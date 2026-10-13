# Contributing to InterfaZe

## Development

Use Node.js 20+ and npm. Run `npm install`, then `npm run dev` from the repository root.

Before opening a change, run:

```bash
npm run typecheck
npm run registry:validate
npm run registry:build
npm run build
```

## Adding a registry component

Keep distributable component source independent from the documentation app. Place it under `registry/default/<component-name>/`, list every required file in the root `registry.json`, and avoid imports that only exist inside the website. Use relative imports between files installed together or documented registry dependencies.

Update the documentation page only after the portable source is working. The live preview, manual source, API table, and registry metadata must agree.

## Pull requests

Describe the user-facing behavior, include the commands you ran, and call out any deployment or registry limitations. Do not commit `node_modules`, `dist`, `.env` files, or generated temporary consumer projects.

## License

The project license is currently undecided. Do not add a license header or represent the project as open source until the owner selects license terms.
