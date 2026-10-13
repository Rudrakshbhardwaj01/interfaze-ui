import assert from 'node:assert/strict'
import { buildRegistryCommand, normalizeRegistryBase, registryItemUrl, REGISTRY_ITEMS, PACKAGE_MANAGERS } from './registry-url.mjs'

assert.equal(normalizeRegistryBase('http://localhost:5173/r///'), 'http://localhost:5173/r')
for (const name of REGISTRY_ITEMS) {
  const url = registryItemUrl('http://localhost:5173/r/', name)
  assert.equal(url, `http://localhost:5173/r/${name}.json`)
  for (const manager of PACKAGE_MANAGERS) assert.match(buildRegistryCommand('http://localhost:5173/r', name, manager), new RegExp(`${name}\\.json$`))
}
assert.throws(() => registryItemUrl('http://localhost:5173/r', 'missing'))
console.log(`Validated the shared registry helper for ${REGISTRY_ITEMS.length} item(s) and ${PACKAGE_MANAGERS.length} package managers.`)
