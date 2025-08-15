/**
 * User Preference Manager
 * 
 * Manages user preferences and customizes the user experience based on stored data.
 * This manager will handle:
 * - Storing and retrieving user preferences from client-side storage.
 * - Applying customizations to the user interface.
 * - Syncing preferences with a backend service if available.
 */

export class UserPreferenceManager {
  private storageKey = 'user_preferences';
  private preferences: Record<string, any> = {};

  constructor() {
    this.init();
  }

  private init() {
    // Initialize with default preferences if none are stored
    // In a browser environment, this would use localStorage
    // For testing, we'll use in-memory storage
    if (typeof localStorage !== 'undefined') {
      if (!localStorage.getItem(this.storageKey)) {
        localStorage.setItem(this.storageKey, JSON.stringify({ theme: 'light' }));
      }
    } else {
      // Fallback for non-browser environments (like testing)
      this.preferences = { theme: 'light' };
    }
  }

  /**
   * Get a user preference by key.
   * @param key The key of the preference to retrieve.
   */
  getPreference(key: string): any {
    const preferences = this.getAllPreferences();
    return preferences[key];
  }

  /**
   * Set a user preference.
   * @param key The key of the preference to set.
   * @param value The value of the preference to set.
   */
  setPreference(key: string, value: any): void {
    const preferences = this.getAllPreferences();
    preferences[key] = value;
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(preferences));
    } else {
      // Fallback for non-browser environments
      this.preferences = preferences;
    }
  }

  /**
   * Get all user preferences.
   */
  getAllPreferences(): any {
    if (typeof localStorage !== 'undefined') {
      const preferences = localStorage.getItem(this.storageKey);
      return preferences ? JSON.parse(preferences) : {};
    } else {
      // Fallback for non-browser environments
      return this.preferences;
    }
  }
}
