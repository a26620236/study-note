/*
 * Retrieves a value from localStorage by its key, and parses it as type `T`.
 * @param key The key to look up in localStorage.
 * @returns The parsed value as type `T`, or `null` if no value is found for the given key.
 * @template T The type of the value to parse from localStorage. Defaults to `unknown`.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const getLocalStorageItem = <T = unknown>(key: string): T | null => {
  if (typeof window !== 'undefined') {
    const value = window.localStorage.getItem(key);
    if (!value) return null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return JSON.parse(value) as T;
  }
  return null;
};

/*
 * Saves a value to localStorage with the given key.
 * @param key The key to use to store the value in localStorage.
 * @param value The value to save to localStorage.
 */
export const setLocalStorageItem = (key: string, value: unknown) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};
/*
 * Removes a value from localStorage by its key.
 * @param key The key of the value to remove from localStorage.
 */
export const removeLocalStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
};
