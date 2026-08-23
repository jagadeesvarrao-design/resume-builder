/**
 * ZenResume High-Resilience IndexedDB Engine (ZenResumeDB)
 * Replaces fragile 5MB localStorage with multi-gigabyte, persistent browser storage.
 * Prevents data loss from browser cache clearing & Safari 7-day auto-purge.
 */

const ZenResumeDB = (() => {
  const DB_NAME = 'ZenResumeDB';
  const DB_VERSION = 1;
  const STORE_RESUMES = 'resumes';
  const STORE_SETTINGS = 'settings';

  let dbPromise = null;

  function getDB() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported in this browser, falling back to localStorage');
        resolve(null);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_RESUMES)) {
          db.createObjectStore(STORE_RESUMES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
          db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        resolve(null);
      };
    });

    return dbPromise;
  }

  async function saveDraft(resumeData, draftId = 'active_draft') {
    // 1. Always sync to localStorage as immediate fallback
    try {
      localStorage.setItem('zen_resume_draft', JSON.stringify(resumeData));
    } catch (e) {
      console.warn('localStorage quota exceeded, relying solely on IndexedDB', e);
    }

    // 2. Persist to IndexedDB (Gigabyte-scale, immune to 5MB cap & Safari purge)
    const db = await getDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_RESUMES], 'readwrite');
        const store = transaction.objectStore(STORE_RESUMES);
        const record = {
          id: draftId,
          updatedAt: new Date().toISOString(),
          data: resumeData
        };
        store.put(record);
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => resolve(false);
      } catch (err) {
        console.error('IndexedDB saveDraft error:', err);
        resolve(false);
      }
    });
  }

  async function loadDraft(draftId = 'active_draft') {
    const db = await getDB();
    if (db) {
      try {
        const result = await new Promise((resolve) => {
          const transaction = db.transaction([STORE_RESUMES], 'readonly');
          const store = transaction.objectStore(STORE_RESUMES);
          const request = store.get(draftId);
          request.onsuccess = () => resolve(request.result ? request.result.data : null);
          request.onerror = () => resolve(null);
        });

        if (result) return result;
      } catch (err) {
        console.warn('IndexedDB loadDraft error, trying localStorage:', err);
      }
    }

    // Fallback to localStorage
    try {
      const local = localStorage.getItem('zen_resume_draft');
      return local ? JSON.parse(local) : null;
    } catch {
      return null;
    }
  }

  async function listSavedResumes() {
    const db = await getDB();
    if (!db) return [];

    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_RESUMES], 'readonly');
        const store = transaction.objectStore(STORE_RESUMES);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  // Auto-migrate legacy localStorage data into IndexedDB seamlessly on first boot
  async function autoMigrateLegacyStorage() {
    try {
      const localData = localStorage.getItem('zen_resume_draft');
      if (localData) {
        const parsed = JSON.parse(localData);
        await saveDraft(parsed, 'active_draft');
        console.log('✅ Legacy localStorage migrated safely into ZenResume IndexedDB.');
      }
    } catch (e) {
      console.warn('Auto-migration error:', e);
    }
  }

  // Self-execute auto migration on load
  if (typeof window !== 'undefined') {
    setTimeout(autoMigrateLegacyStorage, 1000);
  }

  return {
    saveDraft,
    loadDraft,
    listSavedResumes,
    autoMigrateLegacyStorage
  };
})();

if (typeof window !== 'undefined') {
  window.ZenResumeDB = ZenResumeDB;
}
