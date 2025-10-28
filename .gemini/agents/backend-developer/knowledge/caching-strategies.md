# Caching Strategies

## What is Caching?
- **Temporary Storage**: Storing copies of data in a temporary location to reduce latency and improve performance.
- **Reduces Load**: Decreases the load on primary data sources (databases, APIs).

## Types of Caching
- **Client-Side Caching**: Browser caching, CDN caching.
- **Server-Side Caching**: Application-level caching, database caching, distributed caching.

## Caching Mechanisms
- **In-Memory Cache**: Storing data directly in the application's memory (e.g., `HashMap`, `ConcurrentHashMap`).
- **Distributed Cache**: Storing data across multiple servers, accessible by all application instances (e.g., Redis, Memcached).
- **Database Caching**: Database systems often have their own caching mechanisms.

## Caching Strategies
- **Cache-Aside (Lazy Loading)**: Application checks cache first; if not found, fetches from database and populates cache.
- **Write-Through**: Data is written to cache and database simultaneously.
- **Write-Back (Write-Behind)**: Data is written to cache first, then asynchronously written to the database.
- **Refresh-Ahead**: Cache entries are refreshed before they expire.

## Invalidation Strategies
- **Time-Based Expiration (TTL)**: Entries expire after a certain time.
- **Least Recently Used (LRU)**: Evicts the least recently used items when cache is full.
- **Least Frequently Used (LFU)**: Evicts the least frequently used items.
- **Write-Through/Write-Back with Invalidation**: Invalidate cache entries when underlying data changes.

## Best Practices
- **Cache Only What's Necessary**: Don't cache sensitive or rapidly changing data.
- **Monitor Cache Hit Ratio**: Track how often cached data is used.
- **Handle Cache Invalidation Carefully**: Stale data can lead to incorrect application behavior.
