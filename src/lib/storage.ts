import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Language, Theme } from '../types/lab'

export interface WorkspaceSettings {
  selectedExercise: string
  language: Language
  theme: Theme
  speed: number
  inputs: Record<string, Record<string, unknown>>
  completedExercises: string[]
}

interface LabDatabase extends DBSchema {
  code: {
    key: string
    value: string
  }
  settings: {
    key: 'workspace'
    value: WorkspaceSettings
  }
}

let databasePromise: Promise<IDBPDatabase<LabDatabase>> | undefined

const database = (): Promise<IDBPDatabase<LabDatabase>> => {
  databasePromise ??= openDB<LabDatabase>('chess-algorithm-lab', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('code')) db.createObjectStore('code')
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings')
    },
  })
  return databasePromise
}

export async function loadWorkspace(): Promise<{ settings?: WorkspaceSettings; code: Record<string, string> }> {
  const db = await database()
  const [settings, keys] = await Promise.all([db.get('settings', 'workspace'), db.getAllKeys('code')])
  const entries = await Promise.all(keys.map(async (key) => [key, await db.get('code', key)] as const))
  return {
    settings,
    code: Object.fromEntries(entries.filter((entry): entry is readonly [string, string] => typeof entry[1] === 'string')),
  }
}

export async function saveWorkspace(settings: WorkspaceSettings, code: Record<string, string>): Promise<void> {
  const db = await database()
  const transaction = db.transaction(['settings', 'code'], 'readwrite')
  await transaction.objectStore('settings').put(settings, 'workspace')
  const codeStore = transaction.objectStore('code')
  for (const [exerciseId, source] of Object.entries(code)) await codeStore.put(source, exerciseId)
  await transaction.done
}

export async function clearWorkspace(): Promise<void> {
  const db = await database()
  const transaction = db.transaction(['settings', 'code'], 'readwrite')
  await Promise.all([
    transaction.objectStore('settings').clear(),
    transaction.objectStore('code').clear(),
    transaction.done,
  ])
}
