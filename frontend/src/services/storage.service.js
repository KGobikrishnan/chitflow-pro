const STORAGE_KEY = 'CHITFLOW_APP_DATA_V1';

export const storageService = {
  get: (key, defaultValue = null) => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      console.error(`Error loading ${key} from localStorage`, e);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage`, e);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_${key}`);
    } catch (e) {
      console.error(`Error removing ${key} from localStorage`, e);
    }
  },

  clearAll: () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((k) => {
        if (k.startsWith(STORAGE_KEY)) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {
      console.error('Error clearing ChitFlow storage', e);
    }
  },
};

