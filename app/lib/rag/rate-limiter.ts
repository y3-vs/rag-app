/**
 * Rate Limiting Utility
 * Implements in-memory rate limiting for API routes
 * 
 * Note: For production with multiple server instances, 
 * consider using Redis or similar distributed cache
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private static requests: Map<string, RateLimitEntry> = new Map();
  
  /**
   * Check if a request should be allowed
   * @param identifier - Unique identifier (IP address, user ID, etc.)
   * @param maxRequests - Maximum requests allowed in the time window
   * @param windowMs - Time window in milliseconds
   * @returns true if request is allowed, false if rate limit exceeded
   */
  static isAllowed(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 60000 // 1 minute default
  ): boolean {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // No previous request or window has expired
    if (!entry || now > entry.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      return false;
    }

    // Increment counter
    entry.count++;
    return true;
  }

  /**
   * Get remaining requests for an identifier
   */
  static getRemaining(identifier: string, maxRequests: number = 100): number {
    const entry = this.requests.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return maxRequests;
    }
    return Math.max(0, maxRequests - entry.count);
  }

  /**
   * Get reset time (Unix timestamp) for an identifier
   */
  static getResetTime(identifier: string): number {
    const entry = this.requests.get(identifier);
    return entry?.resetTime || Date.now();
  }

  /**
   * Clear old entries (garbage collection)
   * Call periodically to prevent memory buildup
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [identifier, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(identifier);
      }
    }
  }

  /**
   * Reset rate limit for a specific identifier
   */
  static reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Clear all rate limit data
   */
  static clearAll(): void {
    this.requests.clear();
  }
}

/**
 * Helper function to extract client IP from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS = {
  chat: {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
    description: '100 requests per minute',
  },
  upload: {
    maxRequests: 50,
    windowMs: 60000, // 1 minute
    description: '50 requests per minute',
  },
  default: {
    maxRequests: 200,
    windowMs: 60000, // 1 minute
    description: '200 requests per minute',
  },
};

// Run cleanup every 5 minutes
if (typeof global !== 'undefined') {
  setInterval(() => RateLimiter.cleanup(), 5 * 60 * 1000);
}

export default RateLimiter;
