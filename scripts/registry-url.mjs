export const REGISTRY_ITEMS = ['floating-toolbar', 'magnetic-button', 'command-palette', 'otp-input', 'toast-notification', 'spotlight-card']
export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun']

export function normalizeRegistryBase(value, origin = 'http://localhost:5173') {
  const raw = (value || `${origin}/r`).trim().replace(/\/+$/, '')
  const url = new URL(raw)
  if (!['http:', 'https:'].includes(url.protocol) || url.search || url.hash) throw new Error('Registry base must be an HTTP(S) URL without query or hash')
  return url.toString().replace(/\/$/, '')
}

export function registryItemUrl(base, name) {
  if (!REGISTRY_ITEMS.includes(name)) throw new Error(`Unknown registry item: ${name}`)
  return `${normalizeRegistryBase(base)}/${name}.json`
}

export function buildRegistryCommand(base, name, manager) {
  const url = registryItemUrl(base, name)
  const commands = { npm: `npx shadcn@latest add ${url}`, pnpm: `pnpm dlx shadcn@latest add ${url}`, yarn: `yarn dlx shadcn@latest add ${url}`, bun: `bunx --bun shadcn@latest add ${url}` }
  if (!commands[manager]) throw new Error(`Unknown package manager: ${manager}`)
  return commands[manager]
}
