'use client';

import { useEffect } from 'react';
import { useTournamentData } from '@/contexts/TournamentDataContext';

/**
 * Performance optimization hook that prefetches tournament data
 * and provides helpful utilities for performance monitoring
 */
export function usePerformanceOptimization() {
  const { loading, error, _cache } = useTournamentData();

  useEffect(() => {
    // Performance monitoring
    const startTime = performance.now();
    
    if (!loading) {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      console.log(`📊 Tournament data loaded in ${loadTime.toFixed(2)}ms`);
      
      // Report performance metrics
      if (typeof window !== 'undefined' && 'performance' in window) {
        // Use Performance API to track metrics
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          console.log(`📊 Page load metrics:`, {
            DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
            Connect: navigation.connectEnd - navigation.connectStart,
            FirstByte: navigation.responseStart - navigation.requestStart,
            DOMComplete: navigation.domComplete - navigation.fetchStart,
            LoadComplete: navigation.loadEventEnd - navigation.fetchStart,
          });
        }
      }
    }
  }, [loading]);

  const isDataCached = _cache.lastFetchTime > 0;
  const cacheAge = _cache.lastFetchTime ? Date.now() - _cache.lastFetchTime : 0;

  return {
    loading,
    error,
    isDataCached,
    cacheAge,
    isStale: cacheAge > 30000, // 30 seconds
    performance: {
      isCacheHit: isDataCached && cacheAge < 30000,
      cacheAgeInSeconds: Math.floor(cacheAge / 1000),
    }
  };
}

/**
 * Hook to preload critical resources
 */
export function useResourcePreloader() {
  useEffect(() => {
    // Note: We no longer preload API endpoints since we're using direct API calls
    // and don't want to make unnecessary requests during initialization.
    // The TournamentDataContext handles data fetching efficiently.
  }, []);
}

/**
 * Hook to optimize image loading
 */
export function useImageOptimization() {
  useEffect(() => {
    // Preload common team colors/icons that might be used
    const commonImages = [
      '/favicon.svg',
      // Add other common images
    ];

    commonImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    });

    return () => {
      // Cleanup preload links
      document.querySelectorAll('link[rel="preload"][as="image"]').forEach(link => {
        link.remove();
      });
    };
  }, []);
}