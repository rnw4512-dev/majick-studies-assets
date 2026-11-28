import { browserSources, inspectStorage, formatReport } from './storage-inventory'

// Bundled into a self-contained console script; no fetch, dynamic imports,
// external code, storage writes or deployment required.
export async function runConsoleCheck(expectedOrigin = 'https://rnw4512-dev.github.io'): Promise<string | null> {
  if (window.location.origin !== expectedOrigin) {
    console.warn('Wrong website. Open your existing Aetheria website first. No scan ran.')
    return null
  }
  if (!window.confirm('List storage names only? Other projects on this website may share storage. Saved values will not be read. Review the list before sharing.')) return null
  const result = formatReport(await inspectStorage(browserSources()))
  console.log('AETHERIA STORAGE NAMES — review before sharing')
  console.log(result)
  return result
}
