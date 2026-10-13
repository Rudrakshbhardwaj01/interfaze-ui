/// <reference types="vite/client" />

declare module '../../scripts/registry-url.mjs' {
  export const REGISTRY_ITEMS: string[]
  export const PACKAGE_MANAGERS: string[]
  export function normalizeRegistryBase(value?: string, origin?: string): string
  export function registryItemUrl(base: string, name: string): string
  export function buildRegistryCommand(base: string, name: string, manager: string): string
}
