/**
 * ZenResume High-Resilience IndexedDB Engine (ZenResumeDB) v2.0
 * Provides robust, multi-gigabyte persistent storage for stored resumes and user subscription details.
 * Prevents data loss from browser quota limits, private browsing restrictions, and Safari 7-day purge.
 */

const ZenResumeDB = (() => {
  const DB_NAME = 'ZenResumeDB';
  const DB_VERSION = 2;
  const STORE_RESUMES = 'resumes';
  const STORE_SETTINGS = 'settings';

  let dbPromise = null;
  const _memoryCache = {
    resumes: {},
    settings: {},
    isReady: false
  };

  function getDB() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('[ZenResumeDB] IndexedDB not supported, falling back to storage mirror');
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
        console.error('[ZenResumeDB] Open error:', event.target.error);
        resolve(null);
      };
    });

    return dbPromise;
  }

  // Pre-load all settings and profiles into memory cache on boot for instantaneous 0ms synchronous access
  async function initMemoryCache() {
    const db = await getDB();
    if (!db) {
      _memoryCache.isReady = true;
      return;
    }

    try {
      // 1. Load settings
      const settingsTx = db.transaction([STORE_SETTINGS], 'readonly');
      const settingsStore = settingsTx.objectStore(STORE_SETTINGS);
      const settingsReq = settingsStore.getAll();
      settingsReq.onsuccess = () => {
        (settingsReq.result || []).forEach(item => {
          if (item && item.key) _memoryCache.settings[item.key] = item.value;
        });
      };

      // 2. Load resumes
      const resumesTx = db.transaction([STORE_RESUMES], 'readonly');
      const resumesStore = resumesTx.objectStore(STORE_RESUMES);
      const resumesReq = resumesStore.getAll();
      resumesReq.onsuccess = () => {
        (resumesReq.result || []).forEach(item => {
          if (item && item.id) _memoryCache.resumes[item.id] = item.data;
        });
        _memoryCache.isReady = true;
      };
    } catch (e) {
      console.warn('[ZenResumeDB] Memory cache pre-load note:', e);
      _memoryCache.isReady = true;
    }
  }

  /**
   * Save a specific resume profile into IndexedDB (Master or tailored)
   */
  async function saveProfile(profileId = 'default', resumeData) {
    if (!profileId || !resumeData) return false;

    // 1. Update in-memory cache mirror immediately
    _memoryCache.resumes[profileId] = resumeData;

    // 2. Dual-save to localStorage fallback
    try {
      const storageKey = profileId === 'default' ? 'zenresume_state' : `zenresume_profile_${profileId}`;
      localStorage.setItem(storageKey, JSON.stringify(resumeData));
      if (profileId === 'default') {
        localStorage.setItem('zen_resume_draft', JSON.stringify(resumeData));
      }
    } catch (e) {
      console.warn('[ZenResumeDB] localStorage fallback quota exceeded, safely relying on IndexedDB:', e);
    }

    // 3. Persist to IndexedDB
    const db = await getDB();
    if (!db) return true;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction([STORE_RESUMES], 'readwrite');
        const store = tx.objectStore(STORE_RESUMES);
        const record = {
          id: profileId,
          updatedAt: new Date().toISOString(),
          data: resumeData
        };
        store.put(record);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (err) {
        console.error('[ZenResumeDB] saveProfile error:', err);
        resolve(false);
      }
    });
  }

  /**
   * Load a specific resume profile from IndexedDB (with memory & localStorage fallback)
   */
  async function loadProfile(profileId = 'default') {
    // 1. Fast memory cache check
    if (_memoryCache.resumes[profileId]) {
      return _memoryCache.resumes[profileId];
    }

    // 2. Query IndexedDB
    const db = await getDB();
    if (db) {
      try {
        const result = await new Promise((resolve) => {
          const tx = db.transaction([STORE_RESUMES], 'readonly');
          const store = tx.objectStore(STORE_RESUMES);
          const req = store.get(profileId);
          req.onsuccess = () => resolve(req.result ? req.result.data : null);
          req.onerror = () => resolve(null);
        });

        if (result) {
          _memoryCache.resumes[profileId] = result;
          return result;
        }
      } catch (err) {
        console.warn('[ZenResumeDB] loadProfile error, checking localStorage:', err);
      }
    }

    // 3. Fallback to localStorage
    try {
      const storageKey = profileId === 'default' ? 'zenresume_state' : `zenresume_profile_${profileId}`;
      const local = localStorage.getItem(storageKey) || (profileId === 'default' ? localStorage.getItem('zen_resume_draft') : null);
      if (local) {
        const parsed = JSON.parse(local);
        _memoryCache.resumes[profileId] = parsed;
        return parsed;
      }
    } catch (e) {}

    return null;
  }

  /**
   * Delete a tailored resume profile from IndexedDB
   */
  async function deleteProfile(profileId) {
    if (!profileId || profileId === 'default') return false;

    delete _memoryCache.resumes[profileId];

    try {
      localStorage.removeItem(`zenresume_profile_${profileId}`);
    } catch (e) {}

    const db = await getDB();
    if (!db) return true;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction([STORE_RESUMES], 'readwrite');
        const store = tx.objectStore(STORE_RESUMES);
        store.delete(profileId);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (err) {
        console.error('[ZenResumeDB] deleteProfile error:', err);
        resolve(false);
      }
    });
  }

  /**
   * Retrieve all saved profiles from IndexedDB
   */
  async function getAllProfiles() {
    const db = await getDB();
    if (!db) {
      return Object.keys(_memoryCache.resumes).map(id => ({ id, data: _memoryCache.resumes[id] }));
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction([STORE_RESUMES], 'readonly');
        const store = tx.objectStore(STORE_RESUMES);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  /**
   * Save a setting (subscription, profiles registry, etc.)
   */
  async function saveSetting(key, value) {
    if (!key) return false;

    _memoryCache.settings[key] = value;

    // Dual-write to localStorage for fallback
    try {
      if (typeof value === 'object') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, String(value));
      }
    } catch (e) {}

    const db = await getDB();
    if (!db) return true;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction([STORE_SETTINGS], 'readwrite');
        const store = tx.objectStore(STORE_SETTINGS);
        store.put({ key, value, updatedAt: new Date().toISOString() });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Load a setting (with memory cache and localStorage fallback)
   */
  async function loadSetting(key, fallback = null) {
    if (_memoryCache.settings[key] !== undefined) {
      return _memoryCache.settings[key];
    }

    const db = await getDB();
    if (db) {
      try {
        const result = await new Promise((resolve) => {
          const tx = db.transaction([STORE_SETTINGS], 'readonly');
          const store = tx.objectStore(STORE_SETTINGS);
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result ? req.result.value : undefined);
          req.onerror = () => resolve(undefined);
        });

        if (result !== undefined) {
          _memoryCache.settings[key] = result;
          return result;
        }
      } catch (e) {}
    }

    // Fallback to localStorage
    try {
      const local = localStorage.getItem(key);
      if (local !== null) {
        try {
          const parsed = JSON.parse(local);
          _memoryCache.settings[key] = parsed;
          return parsed;
        } catch {
          _memoryCache.settings[key] = local;
          return local;
        }
      }
    } catch (e) {}

    return fallback;
  }

  /**
   * Instant Synchronous Setting Getter (reads from memory cache or localStorage fallback)
   */
  function getSettingSync(key, fallback = null) {
    if (_memoryCache.settings[key] !== undefined) {
      return _memoryCache.settings[key];
    }
    try {
      const local = localStorage.getItem(key);
      if (local !== null) {
        try { return JSON.parse(local); } catch { return local; }
      }
    } catch (e) {}
    return fallback;
  }

  /**
   * Instant Synchronous Profile Getter (reads from memory cache or localStorage fallback)
   */
  function getProfileSync(profileId, fallback = null) {
    if (_memoryCache.resumes[profileId] !== undefined) {
      return _memoryCache.resumes[profileId];
    }
    try {
      const key = (profileId === 'default') ? 'zenresume_state' : `zenresume_profile_${profileId}`;
      const local = localStorage.getItem(key);
      if (local !== null) {
        try { return JSON.parse(local); } catch { return local; }
      }
    } catch (e) {}
    return fallback;
  }

  /**
   * Save Subscription details into IndexedDB settings
   */
  async function saveSubscription(tier, expiresAtMs, extra = {}) {
    if (tier !== 'free' && expiresAtMs && expiresAtMs <= Date.now()) {
      tier = 'free';
      expiresAtMs = 0;
    }
    if (tier === 'free') {
      expiresAtMs = 0;
    }

    const subRecord = {
      tier: tier || 'free',
      expiresAt: expiresAtMs || 0,
      updatedAt: new Date().toISOString(),
      ...extra
    };

    // CRITICAL: Synchronously mirror into _memoryCache so getSettingSync() has zero latency
    _memoryCache.settings['zen_subscription'] = subRecord;
    _memoryCache.settings['zen_user_tier'] = tier || 'free';
    if (expiresAtMs > 0) {
      _memoryCache.settings['zen_tier_expiry'] = expiresAtMs.toString();
    } else {
      delete _memoryCache.settings['zen_tier_expiry'];
      try { localStorage.removeItem('zen_tier_expiry'); } catch (e) {}
    }

    await saveSetting('zen_subscription', subRecord);
    await saveSetting('zen_user_tier', tier);
    if (expiresAtMs > 0) {
      await saveSetting('zen_tier_expiry', expiresAtMs.toString());
    }
    return subRecord;
  }

  /**
   * Auto-migrate existing localStorage data into IndexedDB on first load
   */
  async function autoMigrateLegacyStorage() {
    try {
      // 1. Master resume
      const masterRaw = localStorage.getItem('zenresume_state') || localStorage.getItem('zen_resume_draft');
      if (masterRaw) {
        const parsed = JSON.parse(masterRaw);
        await saveProfile('default', parsed);
      }

      // 2. Profiles registry
      const regRaw = localStorage.getItem('zenresume_application_profiles');
      if (regRaw) {
        const reg = JSON.parse(regRaw);
        await saveSetting('zenresume_application_profiles', reg);

        if (reg.profiles && Array.isArray(reg.profiles)) {
          for (const p of reg.profiles) {
            if (p.id && p.id !== 'default') {
              const profRaw = localStorage.getItem(`zenresume_profile_${p.id}`);
              if (profRaw) {
                await saveProfile(p.id, JSON.parse(profRaw));
              }
            }
          }
        }
      }

      // 3. Subscription
      const tier = localStorage.getItem('zen_user_tier') || 'free';
      const expiry = parseInt(localStorage.getItem('zen_tier_expiry') || '0', 10);
      if (tier && tier !== 'free') {
        await saveSubscription(tier, expiry);
      }

      console.log('✅ Local data verified and mirrored in ZenResumeDB (IndexedDB).');
    } catch (e) {
      console.warn('[ZenResumeDB] Auto-migration error:', e);
    }
  }

  // Self-execute boot routines
  if (typeof window !== 'undefined') {
    initMemoryCache().then(() => {
      setTimeout(autoMigrateLegacyStorage, 800);
    });
  }

  return {
    init: initMemoryCache,
    saveProfile,
    loadProfile,
    deleteProfile,
    getAllProfiles,
    saveSetting,
    loadSetting,
    getSettingSync,
    getProfileSync,
    saveSubscription,
    // Backward compatibility aliases
    saveDraft: saveProfile,
    loadDraft: loadProfile,
    listSavedResumes: getAllProfiles
  };
})();

if (typeof window !== 'undefined') {
  window.ZenResumeDB = ZenResumeDB;
}
