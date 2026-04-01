import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * Validate an API key and return the associated adminId if valid.
 * Returns null if the key is invalid, expired, or revoked.
 */
export async function validateApiKey(key: string): Promise<string | null> {
  // Fetch all non-revoked keys
  const apiKeys = await prisma.apiKey.findMany({
    where: {
      revokedAt: null,
    },
    select: {
      id: true,
      keyHash: true,
      adminId: true,
      expiresAt: true,
    },
  });

  for (const apiKey of apiKeys) {
    const match = await bcrypt.compare(key, apiKey.keyHash);
    if (!match) continue;

    // Check expiration
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    // Update lastUsedAt
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return apiKey.adminId;
  }

  return null;
}
