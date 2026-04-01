const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Cleanup expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of requestCounts) {
    if (now > entry.resetTime) {
      requestCounts.delete(key);
    }
  }
}

export function rateLimit(
  ip: string,
  options: { windowMs: number; max: number }
): { success: boolean; remaining: number } {
  cleanup();

  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + options.windowMs });
    return { success: true, remaining: options.max - 1 };
  }

  entry.count++;
  const remaining = Math.max(0, options.max - entry.count);

  if (entry.count > options.max) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining };
}
