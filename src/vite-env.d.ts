/// <reference types="vite/client" />

declare module 'prismjs/components/prism-markup'
declare module 'prismjs/components/prism-jsx'
declare module 'prismjs/components/prism-tsx'
declare module 'prismjs/components/prism-typescript'
declare module 'prismjs/components/prism-css'
declare module 'prismjs/components/prism-json'
declare module 'prismjs/components/prism-bash'

declare module '../../scripts/registry-url.mjs' {
  export const REGISTRY_ITEMS: string[]
  export const PACKAGE_MANAGERS: string[]
  export function normalizeRegistryBase(value?: string, origin?: string): string
  export function registryItemUrl(base: string, name: string): string
  export function buildRegistryCommand(base: string, name: string, manager: string): string
}
