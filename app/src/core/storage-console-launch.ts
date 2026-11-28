import { runConsoleCheck } from './storage-console-entry'
void runConsoleCheck().catch(() => console.warn('Storage check did not finish. No save changes were requested.'))
