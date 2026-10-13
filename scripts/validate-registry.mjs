import { readFile } from 'node:fs/promises'
import { access } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const registryPath = resolve(root, 'registry.json')
const registry = JSON.parse(await readFile(registryPath, 'utf8'))

if (!registry.$schema?.endsWith('/registry.json')) throw new Error('registry.json is missing the official schema URL')
if (!registry.name || !registry.homepage || !Array.isArray(registry.items)) throw new Error('registry.json is missing required metadata')
if (registry.items.length === 0) throw new Error('registry.json must contain at least one item')

for (const item of registry.items) {
  for (const field of ['name', 'type', 'title', 'description', 'files']) {
    if (!item[field]) throw new Error(`${item.name ?? 'registry item'} is missing ${field}`)
  }
  for (const file of item.files) {
    if (!file.path || !file.type) throw new Error(`${item.name} contains an incomplete file definition`)
    await access(resolve(root, file.path))
  }
}

console.log(`Validated ${registry.items.length} registry item(s): ${registry.items.map((item) => item.name).join(', ')}`)
