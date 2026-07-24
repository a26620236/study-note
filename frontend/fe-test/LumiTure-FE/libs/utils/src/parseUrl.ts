// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function parseUrl<T>(url?: string): T {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const emptyObj: T = {} as T;
  if (!url) {
    return emptyObj;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return JSON.parse(decodeURIComponent(url)) as T;
  } catch (error) {
    console.error('Failed to parse URL:', error);
    return emptyObj;
  }
}
