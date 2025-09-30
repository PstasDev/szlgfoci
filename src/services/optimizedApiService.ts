// Enhanced API service with optimization for live matches and performance
import { api } from '@/lib/api';
import type {
  LiveMatch,
  OptimizedMatch,
  LiveMatchesBulk,
  MatchPerformance,
  LiveUpdatePayload
} from '@/types/api';

// Cache management
class CacheManager {
  private cache = new Map<string, { data: any; expires: number; version: number }>();
  private defaultTTL = 30000; // 30 seconds default

  set<T>(key: string, data: T, ttl: number = this.defaultTTL, version: number = 1): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
      version
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

const cacheManager = new CacheManager();

// Performance monitoring
class PerformanceMonitor {
  private metrics = new Map<string, number[]>();

  startTimer(endpoint: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(endpoint, duration);
      return duration;
    };
  }

  private recordMetric(endpoint: string, duration: number): void {
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, []);
    }
    
    const times = this.metrics.get(endpoint)!;
    times.push(duration);
    
    // Keep only last 50 measurements
    if (times.length > 50) {
      times.shift();
    }
  }

  getStats(endpoint: string): { avg: number; min: number; max: number; count: number } {
    const times = this.metrics.get(endpoint) || [];
    if (times.length === 0) {
      return { avg: 0, min: 0, max: 0, count: 0 };
    }

    return {
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      count: times.length
    };
  }

  getAllStats(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: any = {};
    for (const [endpoint, _] of this.metrics) {
      result[endpoint] = this.getStats(endpoint);
    }
    return result;
  }
}

const performanceMonitor = new PerformanceMonitor();

// Enhanced API service for optimized live match handling
export const optimizedApiService = {
  // Live match endpoints with caching
  async getLiveMatches(useCache: boolean = true): Promise<LiveMatch[]> {
    const cacheKey = 'live_matches';
    
    if (useCache) {
      const cached = cacheManager.get<LiveMatch[]>(cacheKey);
      if (cached) {
        console.log('🚀 Cache hit for live matches');
        return cached;
      }
    }

    const endTimer = performanceMonitor.startTimer('getLiveMatches');
    
    try {
      console.log('🔥 optimizedApiService.getLiveMatches() called');
      const result = await api.get<LiveMatch[]>('/matches/live');
      
      const duration = endTimer();
      console.log(`🔥 optimizedApiService.getLiveMatches() success in ${duration.toFixed(2)}ms:`, result);
      
      // Cache for 30 seconds
      cacheManager.set(cacheKey, result, 30000);
      return result;
    } catch (error) {
      endTimer();
      console.error('🔥 optimizedApiService.getLiveMatches() failed:', error);
      throw error;
    }
  },

  async getOptimizedMatch(matchId: number, useCache: boolean = true): Promise<OptimizedMatch> {
    const cacheKey = `optimized_match_${matchId}`;
    
    if (useCache) {
      const cached = cacheManager.get<OptimizedMatch>(cacheKey);
      if (cached) {
        console.log(`🚀 Cache hit for match ${matchId}`);
        return cached;
      }
    }

    const endTimer = performanceMonitor.startTimer('getOptimizedMatch');
    
    try {
      console.log(`🔥 optimizedApiService.getOptimizedMatch(${matchId}) called`);
      const result = await api.get<OptimizedMatch>(`/matches/${matchId}/optimized`);
      
      const duration = endTimer();
      console.log(`🔥 optimizedApiService.getOptimizedMatch(${matchId}) success in ${duration.toFixed(2)}ms`);
      
      // Cache for 1 minute if live, 5 minutes if not
      const isLive = result.status === 'live' || false;
      const ttl = isLive ? 60000 : 300000;
      cacheManager.set(cacheKey, result, ttl);
      return result;
    } catch (error) {
      endTimer();
      console.error(`🔥 optimizedApiService.getOptimizedMatch(${matchId}) failed:`, error);
      throw error;
    }
  },

  async getLiveMatchesBulk(useCache: boolean = true): Promise<LiveMatchesBulk> {
    const cacheKey = 'live_matches_bulk';
    
    if (useCache) {
      const cached = cacheManager.get<LiveMatchesBulk>(cacheKey);
      if (cached) {
        console.log('🚀 Cache hit for bulk live matches');
        return cached;
      }
    }

    const endTimer = performanceMonitor.startTimer('getLiveMatchesBulk');
    
    try {
      console.log('🔥 optimizedApiService.getLiveMatchesBulk() called');
      const result = await api.get<LiveMatchesBulk>('/matches/live/bulk');
      
      const duration = endTimer();
      console.log(`🔥 optimizedApiService.getLiveMatchesBulk() success in ${duration.toFixed(2)}ms:`, result);
      
      // Cache for 20 seconds
      cacheManager.set(cacheKey, result, 20000);
      return result;
    } catch (error) {
      endTimer();
      console.error('🔥 optimizedApiService.getLiveMatchesBulk() failed:', error);
      throw error;
    }
  },

  async getFeaturedMatches(useCache: boolean = true): Promise<OptimizedMatch[]> {
    const cacheKey = 'featured_matches';
    
    if (useCache) {
      const cached = cacheManager.get<OptimizedMatch[]>(cacheKey);
      if (cached) {
        console.log('🚀 Cache hit for featured matches');
        return cached;
      }
    }

    const endTimer = performanceMonitor.startTimer('getFeaturedMatches');
    
    try {
      console.log('🔥 optimizedApiService.getFeaturedMatches() called');
      const result = await api.get<OptimizedMatch[]>('/matches/featured');
      
      const duration = endTimer();
      console.log(`🔥 optimizedApiService.getFeaturedMatches() success in ${duration.toFixed(2)}ms:`, result);
      
      // Cache for 10 minutes (featured matches change less frequently)
      cacheManager.set(cacheKey, result, 600000);
      return result;
    } catch (error) {
      endTimer();
      console.error('🔥 optimizedApiService.getFeaturedMatches() failed:', error);
      throw error;
    }
  },

  // Performance monitoring
  async getMatchPerformance(matchId: number): Promise<MatchPerformance> {
    const endTimer = performanceMonitor.startTimer('getMatchPerformance');
    
    try {
      console.log(`🔥 optimizedApiService.getMatchPerformance(${matchId}) called`);
      const result = await api.get<MatchPerformance>(`/matches/${matchId}/performance`);
      
      const duration = endTimer();
      console.log(`🔥 optimizedApiService.getMatchPerformance(${matchId}) success in ${duration.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      endTimer();
      console.error(`🔥 optimizedApiService.getMatchPerformance(${matchId}) failed:`, error);
      throw error;
    }
  },

  // Cache management
  async refreshMatchCache(matchId: number): Promise<{ message: string; cache_version: number }> {
    try {
      console.log(`🔥 optimizedApiService.refreshMatchCache(${matchId}) called`);
      const result = await api.post<{ message: string; cache_version: number }>(`/matches/${matchId}/cache/refresh`);
      
      // Invalidate local cache
      cacheManager.invalidate(`match_${matchId}`);
      cacheManager.invalidate('live_matches');
      
      console.log(`🔥 optimizedApiService.refreshMatchCache(${matchId}) success:`, result);
      return result;
    } catch (error) {
      console.error(`🔥 optimizedApiService.refreshMatchCache(${matchId}) failed:`, error);
      throw error;
    }
  },

  async clearAllCaches(): Promise<{ message: string }> {
    try {
      console.log('🔥 optimizedApiService.clearAllCaches() called');
      const result = await api.delete<{ message: string }>('/matches/cache/clear');
      
      // Clear local cache
      cacheManager.clear();
      
      console.log('🔥 optimizedApiService.clearAllCaches() success:', result);
      return result;
    } catch (error) {
      console.error('🔥 optimizedApiService.clearAllCaches() failed:', error);
      throw error;
    }
  },

  // Local cache management
  cache: {
    get: <T>(key: string) => cacheManager.get<T>(key),
    set: <T>(key: string, data: T, ttl?: number) => cacheManager.set(key, data, ttl),
    invalidate: (pattern: string) => cacheManager.invalidate(pattern),
    clear: () => cacheManager.clear(),
    stats: () => cacheManager.getStats()
  },

  // Performance monitoring
  performance: {
    getStats: (endpoint?: string) => endpoint ? performanceMonitor.getStats(endpoint) : performanceMonitor.getAllStats(),
    startTimer: (endpoint: string) => performanceMonitor.startTimer(endpoint)
  }
};

// WebSocket service for real-time updates
export class LiveMatchWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscribers = new Map<string, ((data: LiveUpdatePayload) => void)[]>();

  constructor(private wsUrl: string) {}

  connect(): void {
    try {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        console.log('🔗 WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data: LiveUpdatePayload = JSON.parse(event.data);
          this.notifySubscribers(data);
          
          // Invalidate related caches
          cacheManager.invalidate(`match_${data.match_id}`);
          if (data.type === 'status' || data.type === 'event') {
            cacheManager.invalidate('live_matches');
          }
        } catch (error) {
          console.error('🔥 Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('🔗 WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('🔥 WebSocket error:', error);
      };
    } catch (error) {
      console.error('🔥 WebSocket connection failed:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔗 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  subscribe(eventType: string, callback: (data: LiveUpdatePayload) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    
    this.subscribers.get(eventType)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private notifySubscribers(data: LiveUpdatePayload): void {
    // Notify general subscribers
    const generalSubscribers = this.subscribers.get('all') || [];
    generalSubscribers.forEach(callback => callback(data));

    // Notify type-specific subscribers
    const typeSubscribers = this.subscribers.get(data.type) || [];
    typeSubscribers.forEach(callback => callback(data));

    // Notify match-specific subscribers
    const matchSubscribers = this.subscribers.get(`match_${data.match_id}`) || [];
    matchSubscribers.forEach(callback => callback(data));
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Export a singleton instance
export const liveMatchWebSocket = new LiveMatchWebSocketService(
  process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/matches/'
);