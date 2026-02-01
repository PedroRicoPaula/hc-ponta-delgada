// Safe localStorage wrapper for iOS compatibility
// Handles private browsing mode where localStorage throws exceptions

interface StorageInterface {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class InMemoryStorage implements StorageInterface {
  private storage: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.storage.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }
}

class SafeStorage implements StorageInterface {
  private storage: StorageInterface;
  private isLocalStorageAvailable: boolean;

  constructor() {
    this.isLocalStorageAvailable = this.checkLocalStorage();
    this.storage = this.isLocalStorageAvailable
      ? window.localStorage
      : new InMemoryStorage();
  }

  private checkLocalStorage(): boolean {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('localStorage is not available, using in-memory storage fallback');
      return false;
    }
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch (e) {
      console.error(`Error reading from storage (key: ${key}):`, e);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (e) {
      console.error(`Error writing to storage (key: ${key}):`, e);
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (e) {
      console.error(`Error removing from storage (key: ${key}):`, e);
    }
  }
}

// Export singleton instance
export const safeStorage = new SafeStorage();
