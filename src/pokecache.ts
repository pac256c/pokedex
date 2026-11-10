export class Cache {
  private cache: Map<string, unknown>;

  constructor () {
    this.cache = new Map<string, unknown>();
  }

  add<T>(key: string, val: T) {
    this.cache.set(key, val);
  }

  get<T>(key: string): T | undefined {
    if (this.cache.has(key)) {
      return (this.cache.get(key) as T);
    }
    return undefined;
  }
}
