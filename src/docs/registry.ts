import { buildRegistryCommand as makeCommand, normalizeRegistryBase, registryItemUrl } from '../../scripts/registry-url.mjs'

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'
export { normalizeRegistryBase, registryItemUrl }

export const REGISTRY_BASE_URL = normalizeRegistryBase(import.meta.env.VITE_REGISTRY_BASE_URL, window.location.origin)
export function buildRegistryCommand(name: string, manager: PackageManager) {
  return makeCommand(REGISTRY_BASE_URL, name, manager)
}
