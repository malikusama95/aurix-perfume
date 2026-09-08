import { useState, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface AttemptRecord {
  count: number;
  windowStart: number;
  blockedUntil?: number;
}

export const useRateLimiter = (config: RateLimitConfig) => {
  const [attempts, setAttempts] = useState<Map<string, AttemptRecord>>(new Map());

  const isAllowed = useCallback((key: string): boolean => {
    const now = Date.now();
    const record = attempts.get(key);

    // If blocked, check if block period has expired
    if (record?.blockedUntil && now < record.blockedUntil) {
      return false;
    }

    // If no record or window expired, allow
    if (!record || now - record.windowStart > config.windowMs) {
      return true;
    }

    // Check if within rate limit
    return record.count < config.maxAttempts;
  }, [attempts, config]);

  const recordAttempt = useCallback((key: string): boolean => {
    const now = Date.now();
    const record = attempts.get(key);

    const newAttempts = new Map(attempts);

    if (!record || now - record.windowStart > config.windowMs) {
      // New window
      newAttempts.set(key, {
        count: 1,
        windowStart: now
      });
    } else {
      // Same window
      const newCount = record.count + 1;
      const newRecord: AttemptRecord = {
        count: newCount,
        windowStart: record.windowStart
      };

      // If reached limit, block for specified duration (so remaining time is available on next attempt)
      if (newCount >= config.maxAttempts && config.blockDurationMs) {
        newRecord.blockedUntil = now + config.blockDurationMs;
      }

      newAttempts.set(key, newRecord);
    }

    setAttempts(newAttempts);
    return newAttempts.get(key)!.count <= config.maxAttempts;
  }, [attempts, config]);

  const getRemainingTime = useCallback((key: string): number => {
    const record = attempts.get(key);
    if (!record?.blockedUntil) return 0;
    
    const remaining = record.blockedUntil - Date.now();
    return Math.max(0, remaining);
  }, [attempts]);

  const reset = useCallback((key: string): void => {
    const newAttempts = new Map(attempts);
    newAttempts.delete(key);
    setAttempts(newAttempts);
  }, [attempts]);

  return { isAllowed, recordAttempt, getRemainingTime, reset };
};