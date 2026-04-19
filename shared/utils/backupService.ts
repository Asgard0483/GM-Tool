/**
 * Backup Service for Ultimate GM Tool
 * Handles export and import of the entire IndexedDB database
 */

import { indexedDBStorage } from './storage';

const STORAGE_KEYS = [
  'gmtool_campaigns',
  'gmtool_characters',
  'gmtool_relationships',
  'gmtool_worldbuilding',
  'gmtool_gameplay',
  'gmtool_maps',
  'gmtool_story',
  'gmtool_calendar',
  'gmtool_dice',
  'gmtool_settings'
];

export interface BackupPayload {
  version: string;
  exportedAt: string;
  data: Record<string, string | null>;
}

export async function exportAllData() {
  const payload: BackupPayload = {
    version: '1.2',
    exportedAt: new Date().toISOString(),
    data: {}
  };

  // Asynchronously gather all data from IndexedDB
  for (const key of STORAGE_KEYS) {
    try {
      payload.data[key] = await indexedDBStorage.getItem(key);
    } catch (err) {
      console.error(`Failed to export ${key}:`, err);
      payload.data[key] = null;
    }
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  
  a.href = url;
  a.download = `gmtool-db-backup-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importAllData(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const payload = JSON.parse(content) as BackupPayload;
        
        if (!payload.data || typeof payload.data !== 'object') {
          throw new Error('Ungültiges Backup-Format');
        }

        // Restore each key
        Object.entries(payload.data).forEach(([key, value]) => {
          if (value !== null) {
            localStorage.setItem(key, value);
          }
        });

        resolve(true);
      } catch (err) {
        console.error('Import failed:', err);
        reject(err);
      }
    };
    
    reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
    reader.readAsText(file);
  });
}
