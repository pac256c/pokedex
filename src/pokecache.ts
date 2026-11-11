export class CacheEntry<T> {
  public createdAt: number;
  public val: T;

  constructor(
    createdAt: number,
    val: T,
  ) {
    this.createdAt = createdAt;
    this.val = val;
  };
};

export class Cache {
  private cache: Map<string, CacheEntry<unknown>>;
  private interval: number;
  private reapIntervalId: NodeJS.Timeout | undefined;

  constructor (interval: number) {
    this.cache = new Map<string, CacheEntry<unknown>>();
    this.interval = interval;
    // explicitly bind reap method
    this.reap = this.reap.bind(this);
    this.reapIntervalId = setInterval(this.reap, interval);
  }

  add<T>(key: string, val: T) {
    const createdAt = Date.now();
    this.cache.set(key, {createdAt, val});
  }

  get<T>(key: string): T | undefined {
    if (this.cache.has(key)) {
      const entry = this.cache.get(key);
      if (entry === undefined) return undefined;
      return (entry.val as T);
    }
    return undefined;
  }

  reap(): void {
    for (const key of this.cache.keys()) {
      // entry is older than the interval, remove
      const entry = this.cache.get(key);
      if ((entry !== undefined) && (Date.now() - entry.createdAt > this.interval)) {
        this.cache.delete(key);
      }
    }
  }

  stopReapLoop(): void {
    clearInterval(this.reapIntervalId);
    this.reapIntervalId = undefined;
  }
}
