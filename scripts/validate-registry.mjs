import { readFile } from 'node:fs/promises'
import { access } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const registryPath = resolve(root, 'registry.json')
const registry = JSON.parse(await readFile(registryPath, 'utf8'))

if (!registry.$schema?.endsWith('/registry.json')) throw new Error('registry.json is missing the official schema URL')
if (!registry.name || !registry.homepage || !Array.isArray(registry.items)) throw new Error('registry.json is missing required metadata')
if (registry.items.length === 0) throw new Error('registry.json must contain at least one item')
const names = new Set()
const paths = new Set()

for (const item of registry.items) {
  if (names.has(item.name)) throw new Error(`Duplicate registry item name: ${item.name}`)
  names.add(item.name)
  if (!Array.isArray(item.files) || item.files.length === 0) throw new Error(`${item.name ?? 'registry item'} must contain at least one file`)
  for (const field of ['name', 'type', 'title', 'description', 'files']) {
    if (!item[field]) throw new Error(`${item.name ?? 'registry item'} is missing ${field}`)
  }
  for (const file of item.files) {
    if (!file.path || !file.type) throw new Error(`${item.name} contains an incomplete file definition`)
    if (paths.has(file.path)) throw new Error(`Duplicate registry file path: ${file.path}`)
    paths.add(file.path)
    if (!file.path.startsWith('registry/')) throw new Error(`${item.name} contains a file outside registry/: ${file.path}`)
    await access(resolve(root, file.path))
  }
}

console.log(`Validated ${registry.items.length} registry item(s): ${registry.items.map((item) => item.name).join(', ')}`)
